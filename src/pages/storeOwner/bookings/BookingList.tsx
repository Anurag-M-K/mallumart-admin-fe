import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchBookings } from '../../../api/storeApi';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { convertTo12HourFormat, formatDate } from '../../../utils/util-functions';

function BookingList() {
    const storeToken = useSelector((state: any) => state?.storeOwner?.storeOwnerToken);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [page, setPage] = useState(1);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'store',
        direction: 'asc',
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ['bookings', storeToken, page, pageSize, sortStatus],
        queryFn: () => fetchBookings(storeToken, page, pageSize, sortStatus),
        enabled: !!storeToken,
    });

    if (isLoading) {
        return <div>Data loading</div>;
    }
    if (error) return <div>Error loading data</div>;
    if (Array.isArray(data)) return <div>No data available</div>;
  
    return (
        <div className="container mx-auto p-4">
            <DataTable
                className="whitespace-nowrap table-hover"
                records={data.bookings}
                columns={[
                    {
                        accessor: 'fullName',
                        title: 'Name',
                        sortable: true,
                        render: (data: any) => data?.userDetails?.fullName,
                    },
                    {
                        accessor: 'phone',
                        title: 'Phone',
                        sortable: true,
                        render: (data: any) => data?.userDetails?.phone,
                    },
                    {
                        accessor: 'date',
                        title: 'Date',
                        render: (date: any) =>formatDate(date) ,
                    },
                    {
                        accessor: 'startTime',
                        title: 'Slot',
                        render: (slot: any) => convertTo12HourFormat(slot?.startTime) + ' - ' + convertTo12HourFormat(slot?.endTime),
                    },

                    {
                        accessor: 'token',
                        title: 'Token Number',
                    },
                ]}
                totalRecords={data?.total || 0}
                minHeight={200}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={(p) => setPage(p)}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
            />
        </div>
    );
}

export default BookingList;

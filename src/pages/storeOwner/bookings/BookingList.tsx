import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchBookings } from '../../../api/storeApi';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { convertTo12HourFormat } from '../../../utils/util-functions';

function BookingList() {
    const storeToken = useSelector((state: any) => state?.storeOwner?.storeOwnerToken);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'store',
        direction: 'asc',
    });
    const { storeOwnerData } = useSelector((state: any) => state?.storeOwner);

    const { data, isLoading, error } = useQuery({
        queryKey: ['bookings', storeToken, page, pageSize, sortStatus],
        queryFn: () => fetchBookings(storeToken, page, pageSize, sortStatus),
        enabled: !!storeToken,
    });

    const [bookings, setBookings] = useState<any>([]);

    // Update bookings state when data or search changes
    useEffect(() => {
        if (data?.bookings) {
            setBookings(() => {
                return data.bookings.filter((item: any) =>
                    item?.doctorDetails?.name?.toLowerCase().includes(search.toLowerCase())
                );
            });
        }
    }, [data, search]);

    if (isLoading) {
        return <div>Data loading</div>;
    }
    if (error) return <div>Error loading data</div>;
    if (!data?.bookings?.length) return <div>No data available</div>;

    const columns = [
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
    ];

    // Conditionally add columns based on storeOwnerData
    if (storeOwnerData?.category?.name !== 'Hospital' && storeOwnerData?.category?.name !== 'Clinic' && storeOwnerData?.category?.name !== 'Clinic and lab') {
        columns.push({
            accessor: 'startTime',
            title: 'Slot',
            sortable: false, // Explicitly set sortable to false
            render: (data: any) => convertTo12HourFormat(data?.startTime) + ' - ' + convertTo12HourFormat(data?.endTime),
        });
    } else {
        columns.push({
            accessor: 'doctor',
            title: "Doctor",
            render: (data: any) => data?.doctorDetails?.name,
            sortable: false
        });
    }

    columns.push({
        accessor: 'token',
        title: 'Token Number',
        sortable: false,
        render: (data: any) => data.token,
    });

    console.log("bookings ", bookings);
    return (
        <div className="container mx-auto p-4">
            <div className="my-2">
                <input
                    type="text"
                    className="form-input w-auto"
                    placeholder="Search by doctor name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <DataTable
                className="whitespace-nowrap table-hover"
                records={bookings}
                columns={columns}
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

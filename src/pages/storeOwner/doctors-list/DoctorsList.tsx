import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { changeDrAvailability, deleteDoctor, fetchAllDoctors, fetchBookings } from '../../../api/storeApi';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { convertTo12HourFormat, formatDate, showAlert } from '../../../utils/util-functions';
import { Button } from 'flowbite-react';
import AddDoctor from './AddDoctorForm';
import IconPlus from '../../../components/Icon/IconPlus';
import Swal from 'sweetalert2';
import IconTrashLines from '../../../components/Icon/IconTrashLines';

function DoctorsList() {
    const storeToken = useSelector((state: any) => state?.storeOwner?.storeOwnerToken);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [page, setPage] = useState(1);
    const [addingDoctor, setAddingDoctor] = useState<boolean>(false);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'store',
        direction: 'asc',
    });
    const queryClient = useQueryClient();

    const { data, isLoading, error,refetch  } = useQuery({
        queryKey: ['doctors'],
        queryFn: () => fetchAllDoctors(storeToken),
        enabled: !!storeToken,
    });


    const { mutateAsync, isPending} = useMutation({
        mutationFn:(id:string) => {
            return deleteDoctor(storeToken,id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["doctors"]});
            showAlert("success",'Deleted successfully')
        }
    })

    if (isLoading) {
        return <div>Loading data...</div>;
    }

    if (error) {
        return <div>Error loading data: {error.message}</div>;
    }

    // if (Array.isArray(data)) {
    //     return <div>No data available</div>;
    // }
    
const handleAvailabilityChange  = async (id:string) =>{
    console.log("id ",id)
    const res:any = await changeDrAvailability(storeToken,id)
    console.log("res => ",res)
    if(res?.success){
        refetch()
        showAlert("success",res?.message)
    }else{
        showAlert("error","Something went wrong, please try again later.")
    }
}

const handleDeleteDoctor = async ( id: string) => {
    Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: "You want to delete this doctor?",
        showCancelButton: true,
        // confirmButtonText,
        padding: '2em',
        customClass: 'sweet-alerts',
    }).then(async (result) => {
        if (result.value) {
            await mutateAsync(id);
        }
    });
};
    return (
        <>
            {addingDoctor ? (
                <div>
                    {/* Add Doctor Form Component can go here */}
                    <AddDoctor token={storeToken} handleCancel={setAddingDoctor} id='' editDefaultValues={[]} refetch={refetch}  />
                    {/* <Button onClick={() => setAddingDoctor(false)}>Cancel</Button> */}
                </div>
            ) : (
                <div className="container mx-auto p-4">
                    <div className="flex justify-end my-2">

                        <Button color={'blue'} onClick={() => setAddingDoctor(true)}>
                    <IconPlus className="w-5 h-5 ltr:mr-1.5 rtl:ml-1.5 shrink-0" />
                            Add Doctor
                            </Button>
                    </div>
                    <DataTable
                        className="whitespace-nowrap table-hover"
                        records={data || []}
                        columns={[
                            {
                                accessor: 'name',
                                title: 'Doctor Name',
                                sortable: true,
                                render: (data: any) => data?.name,
                            },
                            {
                                accessor: 'specialisationDetails',
                                title: 'Specialisation',
                                sortable: true,
                                render: (data: any) => data?.specialisationDetails?.name ,
                            },
                            {
                                accessor: 'availableTime',
                                title: 'Timing',
                                render: (data: any) => data.availableTime,
                            },
                            {
                                accessor: 'totalTokens',
                                title: 'Token Number',
                                render: (data: any) => data?.noOfToken,
                            },
                            {
                                accessor: 'isAvailable',
                                title: 'Availablity - Click to change   ',
                                render: (data: any) => <button onClick={()=>handleAvailabilityChange(data?._id)} className='border p-2 rounded-md border-gray-500'>{data?.isAvailable ? "Avialable":"Not Available"}</button>,
                            },
                            {
                                accessor: '',
                                title: 'Delete ',
                                render: (data: any) =>
                                    <button type="button" onClick={() => handleDeleteDoctor(data?._id)}>
                                <IconTrashLines />
                            </button>
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
            )}
        </>
    );
}

export default DoctorsList;

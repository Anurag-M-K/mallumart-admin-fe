import { Fragment, useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import orderBy from 'lodash/orderBy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal, { SweetAlertIcon } from 'sweetalert2';

import { useDispatch, useSelector } from 'react-redux';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEdit from '../../../components/Icon/IconEdit';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import AddAdvertisement from './AddAdvertisement';
import { deleteAdvertisement, fetchAllAdvertisement, updateAdvertisementDisplay } from '../../../api/adminApi';
import { setAdvertisementDetails } from '../../../store/advertisementSlice';
import { Spinner, Tooltip } from 'flowbite-react';
import { Dialog, Transition } from '@headlessui/react';
import { Field, Form } from 'react-final-form';
import WrappedInput from '../../../components/wrappedComponents/WrappedInputField';
import WrappedSelect from '../../../components/wrappedComponents/wrappedComponent';
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';

const PAGE_SIZES = [10, 20, 30, 50, 100];

export default function AdvertisementManagement() {
    const advertisementDetails  = useSelector((state:any) => state.advertisement.advertisementDetails);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [loading, setLoading] = useState<boolean>(false);
    const adminDetails = useSelector((state: any) => state.admin.adminDetails);
    const { _id: id } = adminDetails;
    const dispatch = useDispatch();
    const [initialRecords, setInitialRecords] = useState(orderBy(advertisementDetails));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [search, setSearch] = useState('');
    const [updatingModal, setUpdatingModal] = useState<string>('');

    const { isPending, error, data } = useQuery({
        queryKey: ['advertisement'],
        queryFn: () => fetchAllAdvertisement(adminDetails.token),
    });
    dispatch(setAdvertisementDetails(data));
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });

    const queryClient = useQueryClient();

    useEffect(() => {
        setInitialRecords(advertisementDetails);
    }, [data]);

    useEffect(() => {
        setRecordsData(initialRecords);
    }, [initialRecords]);

    // useEffect(() => {
    //     setInitialRecords(() => {
    //         return data?.filter((item: { name: string; store: { name: string } }) => {
    //             return item?.store?.toLowerCase().includes(search.toLowerCase()) || item?.store?.name.toLowerCase().includes(search.toLowerCase());
    //         });
    //     });
    // }, [search]);

    useEffect(() => {
        setRecordsData(orderBy(initialRecords));
    }, []);

    const [addNewProduct, setAddNewProduct] = useState(false);
    const [editDefaultValues, setEditDefaultValues] = useState<any>(null);

    const { mutateAsync, isPending: isDeleting } = useMutation({
        mutationFn: (id: string) => {
            return deleteAdvertisement(adminDetails.token, id);
        },
        onSuccess: () => {
            const res: any = fetchAllAdvertisement(adminDetails.token);
            dispatch(setAdvertisementDetails(res));
            queryClient.invalidateQueries({ queryKey: ['products'] });
            showAlert('success', 'deleted successfully');
        },
        onError: (data: any) => {
            const errorMsg = data?.response?.data?.message ?? data.message;
            showAlert('error', errorMsg);
        },
    });

    const showAlert = async (icon: SweetAlertIcon, title: string) => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
        });
        toast.fire({
            icon,
            title,
            padding: '10px 20px',
        });
    };

    const toggleStatus = async (message: string, confirmButtonText: string, id: string) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: message,
            showCancelButton: true,
            confirmButtonText,
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then(async (result) => {
            console.log('resuelt ', result);
            if (result.value) {
                //    await deleteAdvertisement(adminDetails.token,id)

                await mutateAsync(id);
            }
        });
    };

    const onSubmit = async (values: TAdvertisementUpdate) => {
        try {
            setLoading(true);
            values.advertisementId = updatingModal;
            const response: any = await updateAdvertisementDisplay(adminDetails.token, values);
            showAlert('success', response?.data?.message);

            const res = await fetchAllAdvertisement(adminDetails.token);
            dispatch(setAdvertisementDetails(res));
            setUpdatingModal('');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <div>
            <Breadcrumbs heading="Advertisement Manage" links={[{ name: 'Dashboard', href: '/admin' }, { name: 'Advertisement' }]} />

            {!addNewProduct ? (
                <div className="panel mt-6">
                    <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                        <div className="">
                            <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <button type="button" onClick={() => setAddNewProduct(true)} className="btn btn-primary ml-auto">
                            <IconPlus className="w-5 h-5 ltr:mr-1.5 rtl:ml-1.5 shrink-0" />
                            Add Advertisement
                        </button>
                    </div>
                    <div className="datatables">
                        <DataTable
                            className="whitespace-nowrap table-hover"
                            records={recordsData}
                            columns={[
                                {
                                    accessor: 'image',
                                    title: 'image',
                                    render: ( image:any ) => {
                                        // const imageUrl = new Cloudinary(import.meta.env.VITE_CLOUDINARY_UPLOAD_NAME, { cloudName: images[0] });
                                        return (
                                            <div>
                                                <img src={image} alt="product image" className="w-10 h-10 rounded-full object-cover" />;
                                            </div>
                                        );
                                    },
                                },
                                {
                                    accessor: 'name',
                                    title: 'Store',
                                    sortable: true,
                                    render: ({ store }) => {
                                        return <span>{store ? store : '---'}</span>;
                                    },
                                },
                                {
                                    accessor: 'advertisementDisplayStatus',
                                    title: 'Status',
                                    sortable: false,
                                    render: ({ advertisementDisplayStatus }) => (
                                        <span className="uppercase cursor-pointer bg-primary text-white px-2 py-1 rounded-md hover:bg-blue-500">
                                            {advertisementDisplayStatus === 'showInSecondCarousal'
                                                ? 'Active on Second ad'
                                                : advertisementDisplayStatus === 'showInMainCarousal'
                                                ? 'Active on Main ad'
                                                : advertisementDisplayStatus === 'hideFromBothCarousal'
                                                ? 'Inactive'
                                                : ''}
                                        </span>
                                    ),
                                },
                                {
                                    accessor: 'id',
                                    title: 'Action',
                                    titleClassName: '!text-center',
                                    render: ({ _id }) => {
                                        return (
                                            <div className="flex items-center w-max mx-auto gap-2">
                                                <Tooltip content="How users can see this advertisement">
                                                    <button onClick={() => setUpdatingModal(_id)} type="button">
                                                        <IconEdit />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip content="Delete this advertisement">
                                                    <button type="button" onClick={() => toggleStatus('Are you sure want to delete this advertisement', 'Yes, Delete', _id as string)}>
                                                        <IconTrashLines />
                                                    </button>
                                                </Tooltip>
                                            </div>
                                        );
                                    },
                                },
                            ]}
                            totalRecords={initialRecords?.length || 0}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                        />
                    </div>
                </div>
            ) : (
                <AddAdvertisement
                    handleCancel={() => {
                        setAddNewProduct(false);
                        setEditDefaultValues(null);
                    }}
                    id={id as string}
                    editDefaultValues={editDefaultValues}
                />
            )}
            <Transition appear show={updatingModal !== '' ? true : false} as={Fragment}>
                <Dialog
                    as="div"
                    open={updatingModal != '' ? true : false}
                    onClose={() => {
                        setUpdatingModal('');
                    }}
                >
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div id="register_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel my-8 w-full max-w-sm overflow-hidden rounded-lg border-0 py-1 px-4 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between p-5 text-lg font-semibold dark:text-white">
                                        <h5>Update Advertisement displaying</h5>
                                        <button type="button" onClick={() => setUpdatingModal('')} className="text-white-dark hover:text-dark">
                                            x
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <Form
                                            onSubmit={onSubmit}
                                            render={({ handleSubmit, values }) => (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="relative my-5 text-white-dark">
                                                        <Field
                                                            id="status"
                                                            type="status"
                                                            component={WrappedSelect}
                                                            className="form-input ps-10 placeholder:text-white-dark"
                                                            name="advertisement"
                                                            options={[
                                                                { value: 'showInMainCarousal', label: 'Show in main carousal' },
                                                                { value: 'showInSecondCarousal', label: 'Show in second carousal' },
                                                                { value: 'hideFromBothCarousal', label: 'Hide from both carousal' },
                                                            ]}
                                                        />
                                                    </div>

                                                    <button type="submit" className="btn mb-5 btn-primary w-full">
                                                        {loading ? <Spinner /> : 'Update'}
                                                    </button>
                                                </form>
                                            )}
                                        />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

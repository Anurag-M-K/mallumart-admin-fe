import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Field, Form } from 'react-final-form';
import WrappedInput from '../../../components/wrappedComponents/WrappedInputField';
import { useDispatch, useSelector } from 'react-redux';
import { addStore, fetchAllStore, updateStoreStatus } from '../../../api/staffApi';
import toast, { Toaster } from 'react-hot-toast';
import { validation_required } from '../../../utils/validation';
import { useNavigate } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import {} from 'react';
import sortBy from 'lodash/sortBy';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconCircleCheck from '../../../components/Icon/IconCircleCheck';
import IconEye from '../../../components/Icon/IconEye';
import { storeStatus } from '../../../constants/store';
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { setStoreData } from '../../../store/storeSlice';
import IconEdit from '../../../components/Icon/IconEdit';
import { Button } from 'flowbite-react';
import IconPlus from '../../../components/Icon/IconPlus';

function StoreListing() {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const storeData = useSelector((state: any) => state.stores.storeData);
    const [initialRecords, setInitialRecords] = useState(sortBy(storeData, 'store'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'store',
        direction: 'asc',
    });
    const [storeAddingModal, setStoreAddingModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const staffData = useSelector((state: any) => state.staff);
    useEffect(() => {
        dispatch(setPageTitle('Stores'));
    });
    const navigate = useNavigate();

    // Fetching all store data
    const { isLoading, error, data } = useQuery({
        queryKey: ['store'],
        queryFn: () =>
            fetchAllStore(staffData?.staffToken).then((res) => {
                dispatch(setStoreData(res?.data));
            }),
    });

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords?.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    console.log('Staoredart ', storeData);
    useEffect(() => {
        setInitialRecords(() => {
            return storeData?.filter((item: { status: any; storeName: string; category: string; phone: { toString: () => string }; email: string }) => {
                return (
                    item?.storeName.toLowerCase().includes(search.toLowerCase()) ||
                    item?.category.toLowerCase().includes(search.toLowerCase()) ||
                    item?.phone.toString().toLowerCase().includes(search.toLowerCase()) ||
                    item?.email.toLowerCase().includes(search.toLowerCase()) ||
                    item?.status.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);

    const onSubmit = async (values: any) => {
        try {
            setLoading(true);
            const response:any = await addStore(values, staffData?.staffToken);
            if (response?.status === 201) {
                toast.success('Store added successfully');
                console.log('response ', response);
                setLoading(false);
                setStoreAddingModal(false);
            }
        } catch (error) {
            toast.error('Something went wrong, please try again');
            setLoading(false);
            console.log(error);
        }
    };

    const updateStatus = async (id: string) => {
        const res = await updateStoreStatus(staffData?.staffToken, id);
        const response: any = await fetchAllStore(staffData?.staffToken);
        dispatch(setStoreData(response?.data));
        setInitialRecords(response.data);
    };
    return (
        <div>
            <Breadcrumbs heading="Stores" links={[{ name: 'Dashboard', href: '/staff' }, { name: 'Stores' }]} />

            <div className="flex justify-end my-3">
                <button type="button" onClick={() => navigate('/staff/stores/new')} className="btn btn-primary">
                    <IconPlus className="w-5 h-5 ltr:mr-1.5 rtl:ml-1.5 shrink-0" />
                    Register
                </button>
            </div>

            <div className="datatables">
                <DataTable
                    className="whitespace-nowrap table-hover"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'store',
                            title: 'Name',
                            sortable: true,
                            render: ( store:any) => {
                                return (
                                    <div className="w-max">
                                        <h2 className="font-bold">{store.storeName}</h2>
                                        <small>
                                            {/* {city}, */}
                                            {store.district}
                                        </small>
                                    </div>
                                );
                            },
                        },
                        { accessor: 'category', title: 'Category', sortable: true, render: ({ category }) => <span className="badge bg-primary">{category}</span> },
                        {
                            accessor: 'phone',
                            title: 'Contact',
                            sortable: true,
                            render: (store:any) => (
                                <div className="w-max">
                                    <h2>{store.phone}</h2>
                                    <small>{store.email}</small>
                                </div>
                            ),
                        },
                        {
                            accessor: 'wholeSale',
                            title: 'wholeSale',
                            sortable: false,
                            render: ( wholeSale:any ) => wholeSale && <IconCircleCheck className="w-6 h-6" />,
                        },
                        { accessor: 'retail', title: 'Retail', sortable: false, render: ({ retail }) => retail && <IconCircleCheck className="w-6 h-6" /> },
                        {
                            accessor: 'status',
                            title: 'Status',
                            sortable: false,
                            render: (store:any) =>
                                status && (
                                    <span onClick={() => updateStatus(store._id)} className="uppercase cursor-pointer bg-primary text-white px-2 py-1 rounded-md hover:bg-blue-500">
                                        {store.status}
                                    </span>
                                ),
                        },

                        {
                            accessor: 'id',
                            title: 'Action',
                            titleClassName: '!text-center',
                            render: ( _id:any ) => {
                                return (
                                    <div className="flex items-center w-max mx-auto gap-2">
                                        <Tippy content="view">
                                            <Link to={`/staff/stores/${_id}`} type="button">
                                                <IconEye />
                                            </Link>
                                        </Tippy>
                                        {/* <Tippy content="Delete">
                                                <button type="button">
                                                    <IconTrashLines />
                                                </button>
                                            </Tippy> */}
                                    </div>
                                );
                            },
                        },
                    ]}
                    totalRecords={initialRecords.length}
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

            {/* <div>
                <Transition appear show={storeAddingModal} as={Fragment}>
                    <Dialog
                        as="div"
                        open={storeAddingModal}
                        onClose={() => {
                            setStoreAddingModal(false);
                        }}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
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
                                            <h5>Add Store</h5>
                                            <button type="button" onClick={() => setStoreAddingModal(false)} className="text-white-dark hover:text-dark">
                                                x
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <Form
                                                onSubmit={onSubmit}
                                                render={({ handleSubmit, values }) => (
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="relative my-2 text-white-dark">
                                                            <Field
                                                                id="storeName"
                                                                type="text"
                                                                placeholder="Enter store name"
                                                                component={WrappedInput}
                                                                className="form-input  placeholder:text-white-dark"
                                                                name="storeName"
                                                                validate={validation_required}
                                                            />
                                                        </div>
                                                        <div className="relative my-5 text-white-dark">
                                                            <Field
                                                                id="storeOwnerName"
                                                                type="text"
                                                                placeholder="Enter store owner name"
                                                                component={WrappedInput}
                                                                className="form-input ps-10 placeholder:text-white-dark"
                                                                name="storeOwnerName"
                                                                validate={validation_required}
                                                            />
                                                        </div>
                                                        <div className="relative my-5 text-white-dark">
                                                            <Field
                                                                id="address"
                                                                type="text"
                                                                placeholder="Enter store address"
                                                                component={WrappedInput}
                                                                className="form-input ps-10 placeholder:text-white-dark"
                                                                name="address"
                                                            />
                                                        </div>
                                                        <div className="relative my-5 text-white-dark">
                                                            <Field
                                                                id="location"
                                                                type="text"
                                                                placeholder="Enter store location"
                                                                component={WrappedInput}
                                                                className="form-input ps-10 placeholder:text-white-dark"
                                                                name="location"
                                                            />
                                                        </div>
                                                        <div className="relative my-5 text-white-dark">
                                                            <Field
                                                                id="phone"
                                                                type="text"
                                                                placeholder="Enter store phone number"
                                                                component={WrappedInput}
                                                                className="form-input ps-10 placeholder:text-white-dark"
                                                                name="phone"
                                                                validate={validation_required}
                                                            />
                                                        </div>
                                                        <div className="relative my-5 text-white-dark">
                                                            <Field
                                                                id="email"
                                                                type="text"
                                                                placeholder="Enter store email"
                                                                component={WrappedInput}
                                                                className="form-input ps-10 placeholder:text-white-dark"
                                                                name="email"
                                                            />
                                                        </div>

                                                        <Button type="submit" className="btn mb-5 btn-success p-0  w-full">
                                                            {loading ? <Spinner color={'green'} /> : 'Submit'}
                                                        </Button>
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
            </div> */}
            <Toaster position="bottom-right" />
        </div>
    );
}

export default StoreListing;

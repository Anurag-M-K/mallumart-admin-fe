import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import IconCircleCheck from '../../../components/Icon/IconCircleCheck';
import IconEye from '../../../components/Icon/IconEye';
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';
import { Link } from 'react-router-dom';
import { fetchAllStore, updateStoreStatus } from '../../../api/adminApi';
import { useQuery } from '@tanstack/react-query';
import { setStoreData } from '../../../store/storeSlice';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { deleteStoreById } from '../../../api/commonApi';


const StoreListingDup = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Stores'));
        fetchStore();
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const storeData = useSelector((state: any) => state?.stores?.storeData) || [];
    const [initialRecords, setInitialRecords] = useState<any>(sortBy(storeData, 'store'));
    const [recordsData, setRecordsData] = useState<any>(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'store',
        direction: 'asc',
    });
    const adminDetails = useSelector((state: any) => state.admin.adminDetails);

    const fetchStore = async () => {
        const res = await fetchAllStore(adminDetails?.token);
        dispatch(setStoreData(res?.data));
        setInitialRecords(res?.data);
    };


    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        if(Array.isArray(storeData)){

            setInitialRecords(() => {
                return storeData?.filter((item: { status: any; storeName: string; category: string; phone: { toString: () => string }; email: string }) => {
                    return (
                        item?.storeName.toLowerCase().includes(search.toLowerCase()) ||
                        item.category.toLowerCase().includes(search.toLowerCase()) ||
                        item.phone.toString().toLowerCase().includes(search.toLowerCase()) ||
                        item.email.toLowerCase().includes(search.toLowerCase()) ||
                        item.status.toLowerCase().includes(search.toLowerCase())
                    );
                });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);

    const formatDate = (date: string | number | Date) => {
        if (date) {
            const dt = new Date(date);
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            return day + '/' + month + '/' + dt.getFullYear();
        }
        return '';
    };

    const updateStatus = async (id: string) => {
        const res = await updateStoreStatus(adminDetails?.token, id);
        const response: any = await fetchAllStore(adminDetails?.token);
        dispatch(setStoreData(response?.data));
        setInitialRecords(response.data);
    };

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

    const deleteStore = async (storeId: string) => {
        Swal.fire({
            icon: 'warning',
            title: 'Do you want to delete store permenently?',
            text: 'Please verify store, it cant be take back',
            showCancelButton: true,
            // confirmButtonText,
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then(async (result) => {
            if (result.value) {
                await deleteStoreById(adminDetails?.token, storeId, 'admin');
                const response: any = await fetchAllStore(adminDetails?.token);
                dispatch(setStoreData(response?.data));
                setInitialRecords(response.data);

                // setEditCategoryId(id);
                // await mutateAsync(field);
                // if (isError) {
                //     showAlert('error', 'status update fail');
                // } else {
                //     showAlert('success', 'status updated');
                // }
            }
        });
    };
    return (
        <div>
            <Breadcrumbs heading="Stores" links={[{ name: 'Dashboard', href: '/admin' }, { name: 'Stores' }]} />
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Stores</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
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
                                render: (store: any) => (
                                    <div className="w-max">
                                        <h2 className="font-bold">{store?.storeName}</h2>
                                        <small>{store?.district}</small>
                                    </div>
                                ),
                            },
                            { accessor: 'category', title: 'Category', sortable: true, render: (store: any) => <span className="badge bg-primary">{store?.category}</span> },
                            {
                                accessor: 'phone',
                                title: 'Contact',
                                sortable: true,
                                render: (store: any) => (
                                    <div className="w-max">
                                        <h2>{store?.phone}</h2>
                                        <small>{store?.email}</small>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'wholesale',
                                title: 'Wholesale',
                                sortable: false,
                                render: (store: any) => (store.wholesale ? <IconCircleCheck className="w-6 h-6" /> : null),
                            },
                            {
                                accessor: 'retail',
                                title: 'Retail',
                                sortable: false,
                                render: (store: any) => (store.retail ? <IconCircleCheck className="w-6 h-6" /> : null),
                            },
                            {
                                accessor: 'status',
                                title: 'Status',
                                sortable: false,
                                render: (store: any) => (
                                    <span onClick={() => updateStatus(store?._id)} className="uppercase cursor-pointer bg-primary text-white px-2 py-1 rounded-md hover:bg-blue-500">
                                        {store?.isActive ? 'active' : 'inactive'}
                                    </span>
                                ),
                            },
                            {
                                accessor: '_id',
                                title: 'Action',
                                titleClassName: '!text-center',
                                render: (store: any) => (
                                    <div className="flex items-center w-max mx-auto gap-2">
                                        <div className="flex gap-x-2 items-center justify-center">
                                            <Tippy content="view and edit">
                                                <Link to={`/admin/stores/${store._id}`} type="button">
                                                    <IconEye />
                                                </Link>
                                            </Tippy>
                                            <MdOutlineDeleteOutline onClick={() => deleteStore(store?._id)} className="cursor-pointer" color="red" size={20} />
                                        </div>
                                    </div>
                                ),
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
                        paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>
    );
};

export default StoreListingDup;

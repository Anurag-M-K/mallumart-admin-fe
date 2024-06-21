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

const StoreListingDup = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Stores'));
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const storeData = useSelector((state: any) => state.stores.storeData);
    const [initialRecords, setInitialRecords] = useState<any>(sortBy(storeData, 'store'));
    const [recordsData, setRecordsData] = useState<any>(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'store',
        direction: 'asc',
    });
    const adminDetails = useSelector((state: any) => state.admin.adminDetails);

    // Fetching all store data
    const { isLoading, error, data } = useQuery({
        queryKey: ['store'],
        queryFn: () =>
            fetchAllStore(adminDetails?.token).then((res) => {
                dispatch(setStoreData(res?.data));
            }),
    });

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return storeData?.filter((item: {
                status: any; storeName: string; category: string; phone: { toString: () => string; }; email: string; 
            }) => {
                return (
                    item?.storeName.toLowerCase().includes(search.toLowerCase()) ||
                    item.category.toLowerCase().includes(search.toLowerCase()) ||
                    item.phone.toString().toLowerCase().includes(search.toLowerCase()) ||
                    item.email.toLowerCase().includes(search.toLowerCase()) ||
                    item.status.toLowerCase().includes(search.toLowerCase())
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
    }

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
                                accessor: 'wholeSale',
                                title: 'Wholesale',
                                sortable: false,
                                render: (store: any) => (store.wholeSale ? <IconCircleCheck className="w-6 h-6" /> : null),
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
                                    <span onClick={() => updateStatus(store?._id)} className='uppercase cursor-pointer bg-primary text-white px-2 py-1 rounded-md hover:bg-blue-500'>
                                        {store?.status}
                                    </span>
                                ),
                            },
                            {
                                accessor: '_id',
                                title: 'Action',
                                titleClassName: '!text-center',
                                render: (store: any) => (
                                    <div className="flex items-center w-max mx-auto gap-2">
                                        <Tippy content="view">
                                            <Link to={`/admin/stores/${store._id}`} type="button">
                                                <IconEye />
                                            </Link>
                                        </Tippy>
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

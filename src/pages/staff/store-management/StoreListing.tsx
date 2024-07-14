import 'tippy.js/dist/tippy.css';
import { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import Tippy from '@tippyjs/react';
import { Link } from 'react-router-dom';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import Swal from 'sweetalert2';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { setPageTitle } from '../../../store/themeConfigSlice';
import { setStoreData } from '../../../store/storeSlice';

import { fetchAllStore, updateStoreStatus } from '../../../api/staffApi';
import { deleteStoreById } from '../../../api/commonApi';

import IconCircleCheck from '../../../components/Icon/IconCircleCheck';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEye from '../../../components/Icon/IconEye';
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';

function StoreListing() {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const storeData = useSelector((state: any) => state?.stores?.storeData);
    const [initialRecords, setInitialRecords] = useState(sortBy(storeData, 'store'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'store',
        direction: 'asc',
    });
    const dispatch = useDispatch();
    const staffData = useSelector((state: any) => state.staff);
    useEffect(() => {
        dispatch(setPageTitle('Stores'));
    });
    const navigate = useNavigate();

    // Fetching all store data
    // const { isLoading, error, data } = useQuery({
    //     queryKey: ['store'],
    //     queryFn: () => fetchAllStore(staffData?.staffToken)
    //        .then((res) => {
    //             dispatch(setStoreData(res?.data));
    //         }),

    // });

    const fetchWholeStore = async () => {
        try {
            const data: any = await fetchAllStore(staffData?.staffToken);
            dispatch(setStoreData(data?.data));
            setInitialRecords(sortBy(data?.data, 'store'));
            setRecordsData(sortBy(data?.data, 'store').slice(0, pageSize));
        } catch (error) {
            console.log('error while fetching stores ', error);
        }
    };

    useEffect(() => {
        fetchWholeStore();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords?.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

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
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus?.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    const updateStatus = async (id: string) => {
        const res = await updateStoreStatus(staffData?.staffToken, id);
        const response: any = await fetchAllStore(staffData?.staffToken);
        dispatch(setStoreData(response?.data));
        setInitialRecords(response?.data);
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
                await deleteStoreById(staffData?.staffToken, storeId, 'staff');
                const response: any = await fetchAllStore(staffData?.staffToken);
                dispatch(setStoreData(response?.data));
                setInitialRecords(response?.data);
            }
        });
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
                            render: (store: any) => {
                                return (
                                    <div className="w-max">
                                        <h2 className="font-bold">{store?.storeName}</h2>
                                        <small>
                                            {/* {city}, */}
                                            {store?.district}
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
                            render: (store: any) => (
                                <div className="w-max">
                                    <h2>{store?.phone}</h2>
                                    <small>{store?.email}</small>
                                </div>
                            ),
                        },
                        {
                            accessor: 'wholesale',
                            title: 'wholesale',
                            sortable: false,
                            render: ({ wholesale }) => wholesale && <IconCircleCheck className="w-6 h-6" />,
                        },
                        { accessor: 'retail', title: 'Retail', sortable: false, render: ({ retail }) => retail && <IconCircleCheck className="w-6 h-6" /> },
                        {
                            accessor: 'isActive',
                            title: 'Status',
                            sortable: false,
                            render: (store: any) => (
                                <span onClick={() => updateStatus(store?._id)} className="uppercase cursor-pointer bg-primary text-white px-2 py-1 rounded-md hover:bg-blue-500">
                                    {store?.isActive ? 'active' : 'inactive'}
                                </span>
                            ),
                        },

                        {
                            accessor: 'id',
                            title: 'Action',
                            titleClassName: '!text-center',
                            render: (store: any) => {
                                return (
                                    <div className="flex items-center w-max mx-auto gap-2">
                                        <div className="flex gap-x-3 justify-center items-center">
                                            <Tippy content="view and edit">
                                                <Link to={`/staff/stores/${store?._id}`} type="button">
                                                    <IconEye />
                                                </Link>
                                            </Tippy>
                                            <MdOutlineDeleteOutline onClick={() => deleteStore(store?._id)} className="cursor-pointer" color="red" size={20} />
                                        </div>
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
            <Toaster position="bottom-right" />
        </div>
    );
}

export default StoreListing;

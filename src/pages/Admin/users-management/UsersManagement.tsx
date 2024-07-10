import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';
import { changeUserStatus, deleteUser, fetchAllStore, fetchAllUsers, updateStoreStatus } from '../../../api/adminApi';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import Swal from 'sweetalert2';
import { setUsersData } from '../../../store/usersManagementSlice';
import { showAlert } from '../../../utils/util-functions';
const UsersManageMent = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Stores'));
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'store',
        direction: 'asc',
    });
    const usersData: TResponseUsers = useSelector((state: any) => state?.users?.usersData);
    const adminDetails = useSelector((state: any) => state?.admin?.adminDetails);
    const [recordsData, setRecordsData] = useState<any>(usersData?.users || []);

    useEffect(() => {
        fetchUsers();
    }, [page, pageSize, search]);
    const fetchUsers = async () => {
        const res: any = await fetchAllUsers(adminDetails?.token, page, pageSize, search);
        dispatch(setUsersData(res?.data));
        setRecordsData(res?.data?.users);
    };

    const updateStatus = async (id: string) => {
        const res: any = await changeUserStatus(adminDetails?.token, id);
        if (res?.status === 200) {
            fetchUsers();
            showAlert('success', res?.data?.message);
        } else {
            showAlert('error', res?.data?.message);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        Swal.fire({
            icon: 'warning',
            title: 'Do you want to delete user permenently?',
            text: 'Please verify user, it cant be take back',
            showCancelButton: true,
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then(async (result) => {
            if (result.value) {
                await deleteUser(adminDetails?.token, userId);
                fetchUsers();
            }
        });
    };

    return (
        <div>
            <Breadcrumbs heading="Users" links={[{ name: 'Dashboard', href: '/admin' }, { name: 'Users' }]} />
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Users</h5>
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
                                accessor: 'fullName',
                                title: 'Name',
                                sortable: true,
                                render: (user: any) => (
                                    <div className="w-max">
                                        <h2 className="font-bold">{user?.fullName}</h2>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'phone',
                                title: 'Contact',
                                sortable: true,
                                render: (user: TUsers) => (
                                    <div className="w-max">
                                        <h2>{user?.phone}</h2>
                                        <small>{user?.email}</small>
                                    </div>
                                ),
                            },

                            {
                                accessor: 'status',
                                title: 'Status',
                                sortable: false,
                                render: (user: TUsers) => (
                                    <span onClick={() => updateStatus(user?._id)} className="uppercase cursor-pointer bg-primary text-white px-2 py-1 rounded-md hover:bg-blue-500">
                                        {user?.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                ),
                            },
                            {
                                accessor: '_id',
                                title: 'Action',
                                titleClassName: '!text-center',
                                render: (user: TUsers) => (
                                    <div className="flex items-center w-max mx-auto gap-2">
                                        <Tippy content="Delete ">
                                            <div className="flex gap-x-2 items-center justify-center">
                                                <MdOutlineDeleteOutline onClick={() => handleDeleteUser(user?._id)} className="cursor-pointer" color="red" size={20} />
                                            </div>
                                        </Tippy>
                                    </div>
                                ),
                            },
                        ]}
                        totalRecords={usersData?.total}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={setPage}
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

export default UsersManageMent;

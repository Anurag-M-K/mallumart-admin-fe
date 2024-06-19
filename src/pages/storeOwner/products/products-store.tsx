import { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import orderBy from 'lodash/orderBy';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal, { SweetAlertIcon } from 'sweetalert2';

import { deleteProduct, fetchAllProductsOfAStore, fetchOneProductDetails } from '../../../api/product.api';
import { useSelector } from 'react-redux';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEdit from '../../../components/Icon/IconEdit';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import NewStore from '../../staff/store-management/new-product/new-product';

const PAGE_SIZES = [10, 20, 30, 50, 100];

export default function ProductView() {
    const storeOwnerData = useSelector((state: any) => state.storeOwner.storeOwnerData);
    const { _id: id } = storeOwnerData;
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const { isPending, error, data } = useQuery({
        queryKey: ['products', id],
        queryFn: () => fetchAllProductsOfAStore(id as string),
    });
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });

    const queryClient = useQueryClient();

    const [initialRecords, setInitialRecords] = useState(orderBy(data || [], [(product) => product[sortStatus.columnAccessor].toLowerCase()], sortStatus.direction));
    const [recordsData, setRecordsData] = useState(initialRecords);

    useEffect(() => {
        setInitialRecords(orderBy(data || [], [(product) => product[sortStatus.columnAccessor].toLowerCase()], sortStatus.direction));
    }, [data]);

    useEffect(() => {
        setRecordsData(initialRecords);
    }, [initialRecords]);

    const [search, setSearch] = useState('');

    useEffect(() => {
        setInitialRecords(() => {
            return data?.filter((item: { name: string; category: { name: string } }) => {
                return item?.name.toLowerCase().includes(search.toLowerCase()) || item?.category.name.toLowerCase().includes(search.toLowerCase());
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        setRecordsData(orderBy(initialRecords || [], [(product) => product[sortStatus.columnAccessor].toLowerCase()], sortStatus.direction));
    }, [sortStatus]);

    const [addNewProduct, setAddNewProduct] = useState(false);
    const [editDefaultValues, setEditDefaultValues] = useState<any>(null);

    const { mutateAsync, isPending: isDeleting } = useMutation({
        mutationFn: (id: string) => {
            return deleteProduct(id);
        },
        onSuccess: () => {
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
            if (result.value) {
                await mutateAsync(id);
            }
        });
    };

    const handleEdit = async (id: string) => {
        try {
            const response = await fetchOneProductDetails(id);
            setEditDefaultValues(response.data);
            setAddNewProduct(true);
        } catch (error:any) {
            const errorMsg = error?.response?.data?.message ?? error.message;
            showAlert('error', errorMsg);
        }
    };

    return (
        <div>
            {!addNewProduct ? (
                <div className="panel mt-6">
                    <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                        <div className="">
                            <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <button type="button" onClick={() => setAddNewProduct(true)} className="btn btn-primary ml-auto">
                            <IconPlus className="w-5 h-5 ltr:mr-1.5 rtl:ml-1.5 shrink-0" />
                            Add Prodcut
                        </button>
                    </div>
                    <div className="datatables">
                        <DataTable
                            className="whitespace-nowrap table-hover"
                            records={recordsData}
                            columns={[
                                {
                                    accessor: 'images',
                                    title: 'image',
                                    render: ({ images }: { images: string[] }) => {
                                        return <img src={images[0]} alt="product image" className="w-10 h-10 rounded-full object-cover" />;
                                    },
                                },
                                {
                                    accessor: 'name',
                                    title: 'Name',
                                    sortable: true,
                                },
                                { accessor: 'category.name', title: 'Category' },
                                {
                                    accessor: 'price',
                                    title: 'Price',
                                },
                                {
                                    accessor: 'offerPrice',
                                    title: 'Offer Price',
                                },
                                {
                                    accessor: 'isActive',
                                    title: 'Status',
                                    sortable: false,
                                    render: (record: { images: string[]; isActive?: boolean; isPending?: boolean; }, index: number) => (
                                        <span className={`uppercase cursor-pointer bg-primary text-white px-2 py-1 rounded-md hover:bg-blue-500`}>
                                            {record.isPending ? 'Pending' : record.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    ),
                                    
                                    
                                    
                                },
                                // {
                                //     accessor: 'status',
                                //     title: 'Retails',
                                //     sortable: true,
                                //     render: ({ status }) => <span className={storeStatus[status].badgeClass}>{status}</span>,
                                // },
                                {
                                    accessor: 'id',
                                    title: 'Action',
                                    titleClassName: '!text-center',
                                    render: (_id:any) => {
                                        return (
                                            <div className="flex items-center w-max mx-auto gap-2">
                                                <button onClick={() => handleEdit(_id)} type="button">
                                                    <IconEdit />
                                                </button>
                                                <button type="button" onClick={() => toggleStatus('Are you sure want to delete this Product', 'Yes, Delete', _id as string)}>
                                                    <IconTrashLines />
                                                </button>
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
                <NewStore
                    handleCancel={() => {
                        setAddNewProduct(false);
                        setEditDefaultValues(null);
                    }}
                    id={id as string}
                    editDefaultValues={editDefaultValues}
                />
            )}
        </div>
    );
}

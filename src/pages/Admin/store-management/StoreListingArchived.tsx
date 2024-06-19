import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { fetchAllStore, updateSubscription } from '../../../api/adminApi';
import { setStoreData } from '../../../store/storeSlice';
import { Button } from 'flowbite-react';
import Swal from 'sweetalert2';

const StoreListing = () => {
    const adminDetails = useSelector((state: any) => state.admin.adminDetails);
    const dispatch = useDispatch();
    const storeData = useSelector((state: any) => state.stores);
    const [searchQuery, setSearchQuery] = useState<string>('');


    const fetchStores = async () => {
        const res = await fetchAllStore(adminDetails?.token);
        dispatch(setStoreData(res?.data));
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const editSubscription = async (storeId:string) => {   Swal.fire({
        title: 'Update subscription?',
        text: "Please verify store",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Update it!',
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await updateSubscription(adminDetails?.token,storeId)
            await fetchStores()
            Swal.fire('Updated!', 'Subscription updated', 'success');
        }
    });
     

    }

    const columns:any = [
        {
            name: 'STORE NAME',
            selector: (row: { storeName: string }) => row?.storeName,
        },
        {
            name: 'PHONE NUMBER',
            selector: (row: { phone: string }) => row?.phone,
        },
        {
            name: 'EMAIL',
            selector: (row: { email: string }) => row?.email,
        },
        {
            name: 'ACTION',
            selector: (row: any) => (
                <div>
                    {row?.isSubscribed ? (
                        <Button onClick={()=>editSubscription(row?._id)} className="text-white my-2 bg-success">Close Subsription</Button>
                    ) : (
                        <Button onClick={()=>editSubscription(row?._id)} className="hover:bg-green-500 shadow-md my-2 bg-success text-white" color={'green'}>
                            Activate Subscription
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const dataArray = Array.isArray(storeData.storeData) ? storeData.storeData : [storeData.storeData];
    const filteredData = dataArray?.filter((item: { storeName: string; }) => item.storeName.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div>
            <div className="text-end">
                <input type="text" placeholder="Search store name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border border-black rounded-md  px-2  py-2" />
            </div>
            <DataTable columns={columns} pagination data={filteredData} />
        </div>
    );
};

export default StoreListing;

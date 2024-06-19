import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../Icon/IconX';
import { Field, Form } from 'react-final-form';
import { Spinner, Tooltip } from 'flowbite-react';
import WrappedSelect from '../wrappedComponents/wrappedComponent';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStore, updateSubscription } from '../../api/adminApi';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { setStoreData } from '../../store/storeSlice';

function SubscriptionManage() {
    const [modal, setModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const pathname = useLocation();
    const storeId = pathname.pathname.split('/').pop();
    const adminDetails = useSelector((state: any) => state.admin.adminDetails);
    const storeData = useSelector((state: any) => state?.stores?.storeData);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const response = await fetchAllStore(adminDetails.token);
                dispatch(setStoreData(response?.data));
            } catch (error) {
                console.log(error);
            }
        };

        if (!Array.isArray(storeData)) {
            fetchStore();
        }
    }, [dispatch, adminDetails.token, storeData]);

    const store = Array.isArray(storeData) ? storeData?.filter((item: any) => item._id === storeId) : [];
    console.log('storeDAAT ', storeData);

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
    const onSubmit = async (values: any) => {
        try {
            setLoading(true);
            values.storeId = storeId;
            const res: any = await updateSubscription(adminDetails.token, values);
            const response = await fetchAllStore(adminDetails.token);
            dispatch(setStoreData(response?.data));
            res.status === 200 ? showAlert('success', res?.data.message) : showAlert('error', res?.data.message);
            console.log('values ', values, storeId);
            setLoading(false);
            setModal(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const calculateDaysLeft = (expirationDate: any) => {
        const currentDate:any = new Date();
        const expiryDate:any = new Date(expirationDate);
        const timeDifference = expiryDate - currentDate;
        const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        return daysLeft;
    };

    const daysleft = calculateDaysLeft(store[0].subscriptionExpiresAt);
    console.log('daysleft', daysleft);
    return (
        <div>
            <div className="panel  sm:w-1/2 p-0 border-0 overflow-hidden">
                <div className={`p-6 bg-gradient-to-r from-[#4361ee] to-[#201b5f] ${store[0]?.subscriptionPlan !== 'noPlanTaken' ? 'min-h-[190px]' : 'h-auto'}`}>
                    <div className={`flex justify-between items-center ${store[0]?.subscriptionPlan !== 'noPlanTaken' ? 'mb-6' : 'mb-0'}`}>
                        <div className="bg-black/50 p-2  rounded-full text-lg px-3 flex items-center text-white font-semibold">
                            {store[0]?.subscriptionPlan === 'basic' ? 'Basic plan' : store[0]?.subscriptionPlan === 'premium' ? 'Premium Plan' : 'Free Plan'}
                        </div>
                        <Tooltip content="Verify the store, and update">
                            <button onClick={() => setModal(true)} className="btn cursor-pointer btn-secondary ltr:mr-2 rtl:ml-2">
                                Update Plan
                            </button>
                        </Tooltip>
                    </div>
                    {store[0].subscriptionPlan !== 'noPlanTaken' && (
                        <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                            <div
                                className="bg-gradient-to-r from-[#d39e62] to-[#e90b0b] w-full h-full rounded-full"
                                style={{
                                    width: `${
                                        daysleft === 0
                                            ? '0%'
                                            : daysleft < 29
                                            ? '8%'
                                            : daysleft < 54
                                            ? '15%'
                                            : daysleft < 91
                                            ? '25%'
                                            : daysleft < 127
                                            ? '35%'
                                            : daysleft < 164
                                            ? '45%'
                                            : daysleft < 200
                                            ? '55%'
                                            : daysleft < 239
                                            ? '65%'
                                            : daysleft < 273
                                            ? ' 75%'
                                            : daysleft < 310
                                            ? '85%'
                                            : daysleft < 365
                                            ? '100%'
                                            : ''
                                    }`,
                                }}
                            ></div>
                            <span className=" flex-row my-2  text-center rounded-full  flex items-center justify-start text-white font-semibold">
                                <h1 className="bg-orange-400 rounded-full px-2 py-1">Days Left : {daysleft}</h1>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <Transition appear show={modal} as={Fragment}>
                <Dialog
                    as="div"
                    open={modal}
                    onClose={() => {
                        setModal(false);
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
                                        <h5>Update Store Plans</h5>
                                        <button type="button" onClick={() => setModal(false)} className="text-white-dark hover:text-dark">
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <Form
                                            onSubmit={onSubmit}
                                            render={({ handleSubmit, values }) => (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="relative my-6 text-white-dark">
                                                        <Field
                                                            id="subscription"
                                                            type="text"
                                                            placeholder="Choose plan"
                                                            component={WrappedSelect}
                                                            options={[
                                                                { value: 'premium', label: 'Premium' },
                                                                { value: 'basic', label: 'Basic' },
                                                                { value: 'noPlanTaken', label: 'Deactivate current plan' },
                                                            ]}
                                                            className="form-input  placeholder:text-white-dark"
                                                            name="subscription"
                                                        />
                                                    </div>

                                                    <button type="submit" className="btn mb-5 btn-primary w-full">
                                                        {loading ? <Spinner /> : 'Submit'}
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

export default SubscriptionManage;

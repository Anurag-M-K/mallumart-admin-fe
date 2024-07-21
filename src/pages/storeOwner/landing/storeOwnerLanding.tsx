import React, { useEffect, useState } from 'react';
import IconCalendar from '../../../components/Icon/IconCalendar';
import IconMapPin from '../../../components/Icon/IconMapPin';
import IconPhone from '../../../components/Icon/IconPhone';
import { Link } from 'react-router-dom';
import IconClock from '../../../components/Icon/IconClock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStore } from '../../../api/storeApi';
import { setstoreOwnerData } from '../../../store/storeOwnerSlice';
import IconCashBanknotes from '../../../components/Icon/IconCashBanknotes';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import IconEdit from '../../../components/Icon/IconEdit';
import ProductView from '../products/products-store';
import BookingList from '../bookings/BookingList';

function StoreOwnerLanding() {
    const { storeOwnerToken } = useSelector((state: any) => state?.storeOwner);
    const { storeOwnerData } = useSelector((state: any) => state?.storeOwner);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const fetchStoreData = async () => {
        try {
            setLoading(true);
            const res = await fetchStore(storeOwnerToken);
            dispatch(setstoreOwnerData(res?.data));
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchStoreData();
    }, [storeOwnerToken, dispatch]);

    const calculateDaysleftdaysleft = (expirationDate: any) => {
        const currentDate: any = new Date();
        const expiryDate: any = new Date(expirationDate);
        const timeDifference = expiryDate - currentDate;
        const daysleft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        return daysleft;
    };

    const daysleft = calculateDaysleftdaysleft(storeOwnerData?.subscription?.expiresAt);
    const whatsappNumber = import.meta.env.VITE_APP_ADMIN_PHONE_NUMBER;
    const message = 'Hi, I want to upgrade my store plan.';

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching store data</div>;
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <div className="panel p-2  sm:mb-0 shadow-sm">
                    <div className="flex justify-end items-center">
                        <div className="rounded-full flex items-center mx-2 justify-center h-8 border dark:border-gray-500">
                            <small className=" px-2 uppercase dark:text-white-light">{storeOwnerData?.subscription?.plan?.name}</small>
                            {storeOwnerData?.subscription?.plan?.name === 'premium' && (
                                <small className="flex items-center rounded-full bg-red-500 text-white dark:text-white-dark  dark:bg-dark py-1 px-1 mx-1 text-xs  font-semibold">
                                    <IconClock className="w-6 font-bold h-4 ltr:mr-1 text-white dark:text-white-dark rtl:ml-1" />
                                    {daysleft} Days Left
                                </small>
                            )}
                        </div>
                        <Link className="flex justify-end" to={`/store/${storeOwnerData?._id}`}>
                            <IconEdit className="cursor-pointer" />
                        </Link>
                    </div>

                    <div className="flex flex-row mb-2">
                        <div className="flex flex-col justify-center items-center">
                            <img src={`${import.meta.env.VITE_APP_S3_STORAGE_BASE_URL}/${storeOwnerData?.shopImgUrl}`} alt="img" className="w-24 h-24 rounded-full object-contain mb-5" />
                            <p className="font-semibold text-xl">{storeOwnerData?.storeName}</p>
                            <div className="flex gap-x-1">
                                <HiOutlineStatusOnline size={20} />
                                {storeOwnerData?.isActive ? 'Live' : 'Closed'}
                            </div>
                        </div>
                        <ul className=" justify-center flex flex-col max-w-[160px] m-auto space-y-4 font-semibold text-white-dark">
                            {/* <li className="flex items-center gap-2">
                                <HiOutlineStatusOnline size={20} />
                                {storeOwnerData?.isActive ? "Live" : "Closed"}
                            </li> */}
                            <li className="flex items-center gap-2">
                                <IconCashBanknotes className="shrink-0" />
                                {storeOwnerData?.category?.name}
                            </li>
                            <li className="flex items-center gap-2">
                                <IconCalendar className="shrink-0" />
                                {storeOwnerData?.storeOwnerName}
                            </li>
                            <li className="flex items-center gap-2">
                                <IconMapPin className="shrink-0" />
                                {storeOwnerData?.district}
                            </li>
                            {/* <li className="flex items-center gap-2" >
                                <IconMail className="w-5 h-5 " />
                                <p className=" ">{storeOwnerData?.email}</p>
                        </li> */}
                            <li className="flex items-center gap-2">
                                <IconPhone />
                                <span className="whitespace-nowrap" dir="ltr">
                                    {storeOwnerData?.phone}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                {(daysleft < 20 || storeOwnerData?.subscription?.plan?.name === 'basic') && (
                    <div className="shadow-sm p-2 mt-5 panel">
                        <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold uppercase text-lg  dark:text-white-light">{storeOwnerData?.subscription?.plan?.name} plan</h5>
                            {daysleft < 20 && (
                                <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`} className="btn btn-primary">
                                    Renew Now
                                </a>
                            )}
                            {storeOwnerData?.subscription?.plan?.name === 'basic' && (
                                <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`} className="btn btn-primary">
                                    Update Plan
                                </a>
                            )}
                        </div>
                        <div className="group">
                            {storeOwnerData?.subscription?.plan?.name === 'basic' && (
                                <div>
                                    <h1 className="list-inside list-disc text-white-dark font-semibold mb-2">Update to Premium plan to get :</h1>
                                    <ul className="list-inside list-disc text-white-dark font-semibold mb-7 space-y-2">
                                        <li>Add up to 4 images for each product</li>
                                        <li>Unlimited Reports</li>
                                        <li>One year time period</li>
                                    </ul>
                                </div>
                            )}
                            {storeOwnerData?.subscription?.plan?.name === 'premium' && (
                                <>
                                    {daysleft > 0 && (
                                        <div className="flex items-center justify-between mb-4 font-semibold">
                                            <p className="flex items-center rounded-full bg-dark px-2 py-1 text-xs text-white-light font-semibold">
                                                <IconClock className="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                                                {daysleft} Days Left
                                            </p>
                                        </div>
                                    )}
                                    <div className="rounded-full h-2.5 p-0.5 bg-dark-light overflow-hidden mb-5 dark:bg-dark-light/10">
                                        <div
                                            className="bg-gradient-to-r from-[#f67062] to-[#fc5296] w-full h-full rounded-full relative"
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
                                                        : daysleft < 236
                                                        ? '65%'
                                                        : daysleft < 273
                                                        ? '75%'
                                                        : daysleft < 309
                                                        ? '85%'
                                                        : daysleft < 356
                                                        ? '95%'
                                                        : '100%'
                                                }`,
                                            }}
                                        ></div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {storeOwnerData?.storeProviding === 'serviceBased' ? <BookingList /> : <ProductView />}
        </>
    );
}

export default StoreOwnerLanding;

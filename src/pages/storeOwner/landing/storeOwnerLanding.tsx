import React, { useEffect } from 'react';
import IconPencilPaper from '../../../components/Icon/IconPencilPaper';
import IconCoffee from '../../../components/Icon/IconCoffee';
import IconCalendar from '../../../components/Icon/IconCalendar';
import IconMapPin from '../../../components/Icon/IconMapPin';
import IconMail from '../../../components/Icon/IconMail';
import IconPhone from '../../../components/Icon/IconPhone';
import IconTwitter from '../../../components/Icon/IconTwitter';
import IconDribbble from '../../../components/Icon/IconDribbble';
import IconGithub from '../../../components/Icon/IconGithub';
import { Link, useNavigate } from 'react-router-dom';
import IconClock from '../../../components/Icon/IconClock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStore } from '../../../api/storeApi';
import { setstoreOwnerData } from '../../../store/storeOwnerSlice';
import IconCashBanknotes from '../../../components/Icon/IconCashBanknotes';
import { HiOutlineStatusOnline } from 'react-icons/hi';

function StoreOwnerLanding() {
    const { storeOwnerToken } = useSelector((state:any) => state.storeOwner);
    const { storeOwnerData } = useSelector((state:any) => state.storeOwner);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    console.log('storeowner data ', storeOwnerData);
    const fetchStoreData = async () => {
        const res = await fetchStore(storeOwnerToken);
        dispatch(setstoreOwnerData(res?.data));
    };
    useEffect(() => {
        fetchStoreData();
    }, []);

 

    const calculateDaysLeft = (expirationDate: any) => {
        console.log("Exiprationdat ",expirationDate)
        const currentDate: any = new Date();
        const expiryDate: any = new Date(expirationDate);
        const timeDifference = expiryDate - currentDate;
        const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        return daysLeft;
    };

    const daysleft = calculateDaysLeft(storeOwnerData?.subscriptionExpiresAt);

        const whatsappNumber = import.meta.env.VITE_APP_ADMIN_PHONE_NUMBER
        const message = "Hi, I want to upgrade my store plan.";
    return (
        <div className="grid grid-cols-1  md:grid-cols-3 gap-x-4">
            <div className="panel shadow-md">
                <div className="flex items-center justify-center    stify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Profile</h5>
                </div>
                <div className="mb-5">
                    <div className="flex flex-col justify-center items-center">
                        <img src={`${import.meta.env.VITE_APP_S3_STORAGE_BASE_URL}/${storeOwnerData?.shopImgUrl}`} alt="img" className="w-24 h-24 rounded-full object-cover  mb-5" />
                        <p className="font-semibold text-primary text-xl">{storeOwnerData?.storeName}</p>
                    </div>
                    <ul className="mt-5 flex flex-col max-w-[160px] m-auto space-y-4 font-semibold text-white-dark">
                        <li className="flex items-center gap-2">
                            <HiOutlineStatusOnline size={20} />
                            {storeOwnerData?.live}
                        </li>
                        <li className="flex items-center gap-2">
                            <IconCashBanknotes className="shrink-0" />
                            {storeOwnerData?.category?.name}
                        </li>
                        <li className="flex items-center gap-2 ">
                            <IconCalendar className="shrink-0" />
                            {storeOwnerData?.storeOwnerName}
                        </li>
                        <li className="flex items-center gap-2">
                            <IconMapPin className="shrink-0" />
                            {storeOwnerData?.district}
                        </li>
                        <li>
                            <button className="flex items-center gap-2">
                                <IconMail className="w-5 h-5 shrink-0" />
                                <span className="text-primary truncate">{storeOwnerData?.email}</span>
                            </button>
                        </li>
                        <li className="flex items-center gap-2">
                            <IconPhone />
                            <span className="whitespace-nowrap" dir="ltr">
                                {storeOwnerData?.phone}
                            </span>
                        </li>
                    </ul>
                    <ul className="mt-7 flex items-center justify-center gap-2">
                        <li>
                            <button className="btn btn-info flex items-center justify-center rounded-full w-10 h-10 p-0">
                                <IconTwitter className="w-5 h-5" />
                            </button>
                        </li>
                        <li>
                            <button className="btn btn-danger flex items-center justify-center rounded-full w-10 h-10 p-0">
                                <IconDribbble />
                            </button>
                        </li>
                        <li>
                            <button className="btn btn-dark flex items-center justify-center rounded-full w-10 h-10 p-0">
                                <IconGithub />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div>
                <div className="shadow-md p-5 panel">
                    <div className="flex items-center justify-between mb-10">
                        <h5 className="font-semibold text-lg dark:text-white-light">
                            {' '}
                            {storeOwnerData?.subscriptionPlan === 'basic' ? 'Basic plan' : storeOwnerData?.subscriptionPlan === 'premium' ? 'Premium Plan' : 'Free Plan'}
                        </h5>
                        {
                            daysleft < 420 && (
                                <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`} className="btn btn-primary">Renew Now</a>
                            )
                        }
                    </div>
                    <div className="group">
                        <ul className="list-inside list-disc text-white-dark font-semibold mb-7 space-y-2">
                            <li>Add upto 5 images for each product</li>
                            <li>Unlimited Reports</li>
                            <li>One year time period</li>
                        </ul>
                        {daysleft > 0 && (

                            <div className="flex items-center justify-between mb-4 font-semibold">
                            <p className="flex items-center rounded-full bg-dark px-2 py-1 text-xs text-white-light font-semibold">
                                <IconClock className="w-3 h-3 ltr:mr-1 rtl:ml-1" />{daysleft} Days Left
                            </p>
                        </div>
                        ) }
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoreOwnerLanding;

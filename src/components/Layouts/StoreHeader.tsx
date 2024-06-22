import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IRootState } from '../../store';
import { toggleTheme, toggleSidebar } from '../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import IconMenu from '../Icon/IconMenu';
import IconEdit from '../Icon/IconEdit';
import IconSun from '../Icon/IconSun';
import IconMoon from '../Icon/IconMoon';
import IconLaptop from '../Icon/IconLaptop';
import IconUser from '../Icon/IconUser';
import IconLogout from '../Icon/IconLogout';

import { fetchStore, updateStoreLiveStatus } from '../../api/storeApi';
import { setStoreData } from '../../store/storeSlice';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../Icon/IconX';
import { Field, Form } from 'react-final-form';
import { validation_required } from '../../utils/validation';
import WrappedInput from '../wrappedComponents/WrappedInputField';
import { Spinner } from 'flowbite-react';
import toast, { Toaster } from 'react-hot-toast';
import WrappedSelect from '../wrappedComponents/wrappedComponent';
import { setStoreOwnerLogout, setstoreOwnerData } from '../../store/storeOwnerSlice';
import { RiLockPasswordLine } from "react-icons/ri";
import { changePassword } from '../../api/commonApi';

const StoreHeader = () => {
    const location = useLocation();
    const [modal, setModal] = useState(false);
    const [passwordChangeModal, setPasswordChangeModal] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [res,setRes]=useState<any>(null)
    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [location]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    const [search, setSearch] = useState(false);

    const [flag, setFlag] = useState(themeConfig.locale);

    const { t } = useTranslation();

    const handleWhatsAppClick = () => {
        // Replace '1234567890' with the actual phone number you want to open in WhatsApp

        // Create the WhatsApp URL
        const whatsappUrl = `https://wa.me/${import.meta.env.VITE_APP_ADMIN_PHONE}`;

        // Open the WhatsApp URL in a new tab
        window.open(whatsappUrl, '_blank');
    };
    const storeOwnerData = useSelector((state: any) => state.storeOwner.storeOwnerData);
    const storeOwnerToken = useSelector((state: any) => state.storeOwner.storeOwnerToken);
    const storeData = useSelector((state: any) => state.stores.storeData);
    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response: any = await fetchStore(storeOwnerToken);
                if (response?.status === 200) {
                    dispatch(setStoreData(response?.data));
                }
            } catch (error) {
                console.error('Error fetching store data:', error);
            }
        };
        fetchStoreData();
    }, []);

    const expirationDate = new Date(storeData?.subscriptionExpiresAt);

    const daysLeft = Math.round((expirationDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    const timeLeft = Math.round(daysLeft / (1000 * 3600 * 24));

    const onSubmit = async (values: TStoreLiveStatus) => {
        try {
            setLoading(true);
            const res: any = await updateStoreLiveStatus(storeOwnerToken, values);
                const response = await fetchStore(storeOwnerToken);
                dispatch(setstoreOwnerData(response?.data));
           
            if (res.status === 200) {
                toast.success(res.data.message);
            } else {
                toast.error('Something went wrong! Please try again later');
            }
            setModal(false);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const options = [
        { value: 'temporarilyClosed', label: 'Temporarily Closed' },
        { value: 'permenantlyClosed', label: 'Permenantly Closed' },
        { value: 'open', label: 'Open' },
    ];

    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(setStoreOwnerLogout());
        localStorage.clear();
        navigate('/store/login');
        window.location.reload();
    };

    const passwordSubmit = async (values: any) => {
        try {
            setLoading(true)
            const response: any = await changePassword(storeOwnerToken, values, 'store');
            setRes(response);
            if (response?.status === 200) {
                toast.success(response?.data?.message);
                setPasswordChangeModal(false)
            } else {
                toast.error(response?.data?.message);
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    };
    return (
        <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
            <div className="shadow-sm">
                <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                        <Link to="/store" className="main-logo flex items-center shrink-0">
                            <img className="w-8 ltr:-ml-1 rtl:-mr-1 inline" src="/assets/images/logo.svg" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5  font-semibold  align-middle hidden md:inline dark:text-white-light transition-all duration-300">MALLU MART</span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
                            onClick={() => {
                                dispatch(toggleSidebar());
                            }}
                        >
                            <IconMenu className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="ltr:mr-2 rtl:ml-2 hidden sm:block"></div>
                    <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto"></div>
                        <div>
                            {themeConfig.theme === 'light' ? (
                                <button
                                    className={`${
                                        themeConfig.theme === 'light' &&
                                        'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('dark'));
                                    }}
                                >
                                    <IconSun />
                                </button>
                            ) : (
                                ''
                            )}
                            {themeConfig.theme === 'dark' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'dark' &&
                                        'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('system'));
                                    }}
                                >
                                    <IconMoon />
                                </button>
                            )}
                            {themeConfig.theme === 'system' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'system' &&
                                        'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('light'));
                                    }}
                                >
                                    <IconLaptop />
                                </button>
                            )}
                        </div>

                        <div className="dropdown shrink-0 flex">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group block"
                                button={<img className="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src="/assets/images/user-profile.jpeg" alt="userProfile" />}
                            >
                                <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                                    <li>
                                        <Link to="/store" className="dark:hover:text-white">
                                            <IconUser className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                            Profile
                                        </Link>
                                    </li>
                                    <li onClick={() => setModal(true)}>
                                        <Link to="" className="dark:hover:text-white">
                                            <IconEdit className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                            Update Store Status
                                        </Link>
                                    </li>
                                    <li className="cursor-pointer hover:bg-blue-100" onClick={() => setPasswordChangeModal(true)}>
                                        <div className="flex items-center px-4 py-4">
                                            {/* <img className="rounded-md w-10 h-10 object-cover" src="/assets/images/user-profile.jpeg" alt="userProfile" /> */}
                                            <RiLockPasswordLine className="w-5 h-5" />
                                            <div className="ltr:pl-4 rtl:pr-4 truncate">
                                                <h4 className="text-base">Change password</h4>
                                            </div>
                                        </div>
                                    </li>
                                    {/* <li>
                                        <Link to="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                            <IconLockDots className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                            Lock Screen
                                        </Link>
                                    </li> */}
                                    <li onClick={handleLogout} className="border-t border-white-light dark:border-white-light/10">
                                        {/* TODO: Handle logout from here */}
                                        <Link to="/store/login" className="text-danger !py-3">
                                            <IconLogout className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />
                                            Sign Out
                                        </Link>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Transition appear show={modal} as={Fragment}>
                    <Dialog as="div" open={modal} onClose={() => setModal(false)}>
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
                        <div id="login_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                            <div className="flex items-start justify-center min-h-screen px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-sm my-8 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-between p-5 font-semibold text-lg dark:text-white">
                                            <h5>Update Store Live Status</h5>
                                            <button type="button" onClick={() => setModal(false)} className="text-white-dark hover:text-dark">
                                                <IconX />
                                            </button>
                                        </div>
                                        <hr />
                                        <div className="p-5">
                                            <Form
                                                onSubmit={onSubmit}
                                                render={({ handleSubmit, values }) => (
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="my-4">
                                                            <label htmlFor="Password">Update Store Live Status</label>
                                                            <div className="relative text-white-dark">
                                                                <Field
                                                                    name="storeLiveStatus"
                                                                    id="storeLiveStatus"
                                                                    type="text"
                                                                    placeholder=""
                                                                    component={WrappedSelect}
                                                                    options={options}
                                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                                />
                                                            </div>
                                                        </div>

                                                        <button type="submit" className="btn btn-primary w-full my-5">
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
            <div>
                <Transition appear show={passwordChangeModal} as={Fragment}>
                    <Dialog as="div" open={passwordChangeModal  } onClose={() => setPasswordChangeModal(false)}>
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
                        <div id="login_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                            <div className="flex items-start justify-center min-h-screen px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-sm my-8 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-between p-5 font-semibold text-lg dark:text-white">
                                            <h5>Change your password</h5>
                                            <button type="button" onClick={() => setPasswordChangeModal(false)} className="text-white-dark hover:text-dark">
                                                <IconX />
                                            </button>
                                        </div>
                                        <hr />
                                        <div className="p-5">
                                            <Form
                                                onSubmit={passwordSubmit}
                                                render={({ handleSubmit, values }) => (
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="my-4">
                                                            <label htmlFor="Password">Current password</label>
                                                            <div className="relative text-white-dark">
                                                                <Field
                                                                    name="password"
                                                                    id="password"
                                                                    type="password"
                                                                    placeholder="Enter Current Password"
                                                                    validate={validation_required}
                                                                    component={WrappedInput}
                                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="my-4">
                                                            <label htmlFor="Password">New password</label>
                                                            <div className="relative text-white-dark">
                                                                <Field
                                                                    name="newPassword"
                                                                    id="newPassword"
                                                                    type="password"
                                                                    validate={validation_required}
                                                                    placeholder="Enter Password"
                                                                    component={WrappedInput}
                                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="my-4">
                                                            <label htmlFor="Password">Re enter new password</label>
                                                            <div className="relative text-white-dark">
                                                                <Field
                                                                    name="reEnterPassword"
                                                                    id="reEnterPassword"
                                                                    type="password"
                                                                    placeholder="Re Enter Password"
                                                                    component={WrappedInput}
                                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                                />
                                                            </div>
                                                            <div className='mt-4 text-center'>

                                                                {res?.response?.status != 200 && <span className="text-red-500 mt-5 text-center">{res?.response?.data?.message}</span>  } 
                                                            </div>
                                                        </div>
                                                        <button type="submit" className="btn btn-primary mb-3 w-full">
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
            <Toaster position="bottom-right" />
        </header>
    );
};

export default StoreHeader;

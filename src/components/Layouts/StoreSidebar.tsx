import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import { MdLocalGroceryStore } from 'react-icons/md';
import { fetchStore } from '../../api/storeApi';
import { setStoreData } from '../../store/storeSlice';
import { FaAdversal } from 'react-icons/fa';
import { WiTime8 } from 'react-icons/wi';
import { LuTicket } from 'react-icons/lu';
import { FaUserDoctor } from 'react-icons/fa6';

const StoreSidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const storeOwnerData: TStoreValues = useSelector((state: any) => state.storeOwner.storeOwnerData);
    const location = useLocation();
    const dispatch = useDispatch();
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response: any = await fetchStore(storeOwnerData.token);
                if (response?.status === 200) {
                    dispatch(setStoreData(response?.data));
                }
            } catch (error) {
                console.error('Error fetching store data:', error);
            }
        };
        fetchStoreData();
    }, []);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/store" className="main-logo flex items-center shrink-0">
                            <img className="w-10 ml-[5px] flex-none" src="/logo-mallumart.png" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">MALLU MART</span>
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            <li className="menu nav-item">
                                <NavLink to="/store" className="group" end>
                                    <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                                        <div className="flex items-center">
                                            <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    opacity="0.5"
                                                    d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M9 17.25C8.58579 17.25 8.25 17.5858 8.25 18C8.25 18.4142 8.58579 18.75 9 18.75H15C15.4142 18.75 15.75 18.4142 15.75 18C15.75 17.5858 15.4142 17.25 15 17.25H9Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Dashboard</span>
                                        </div>
                                    </button>
                                </NavLink>
                            </li>

                            {storeOwnerData?.storeProviding === 'serviceBased' && (
                                <li className="menu nav-item">
                                    <NavLink to={`${'/store/bookings'}`} className="group" onClick={() => toggleMenu(`${'Bookings'}`)}>
                                        <button type="button" className={`${currentMenu === 'stores' ? 'active' : ''} nav-link group w-full`}>
                                            <div className="flex items-center">
                                                <LuTicket className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Bookings</span>
                                            </div>
                                        </button>
                                    </NavLink>
                                </li>
                            )}
                            <li className="menu nav-item">
                                <NavLink to={'/store/products'} className="group" onClick={() => toggleMenu(`${'Products'}`)}>
                                    <button type="button" className={`${currentMenu === 'stores' ? 'active' : ''} nav-link group w-full`}>
                                        <div className="flex items-center">
                                            {<MdLocalGroceryStore className="group-hover:!text-primary shrink-0" />}
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{'Products'}</span>
                                        </div>
                                    </button>
                                </NavLink>
                            </li>

                            {storeOwnerData?.storeProviding === 'serviceBased' &&
                               ( storeOwnerData?.category?.name !== 'Hospital' &&
                                storeOwnerData?.category?.name !== 'Clinic' &&
                                storeOwnerData?.category?.name !== 'Clinic and lab') && (
                                    <li className="menu nav-item">
                                        <NavLink to={`/store/time-slots`} className="group" onClick={() => toggleMenu(`Time Slots`)}>
                                            <button type="button" className={`${currentMenu === 'stores' ? 'active' : ''} nav-link group w-full`}>
                                                <div className="flex items-center">
                                                    <WiTime8 className="group-hover:!text-primary shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Time Slots</span>
                                                </div>
                                            </button>
                                        </NavLink>
                                    </li>
                                )}
                            {(storeOwnerData?.category?.name === 'Hospital' ||
                                storeOwnerData?.category?.name === 'Clinic' ||
                                storeOwnerData?.category?.name === 'Clinic and lab') && (
                                <li className="menu nav-item">
                                    <NavLink to={`/store/doctors-list`} className="group" onClick={() => toggleMenu(`Doctors List`)}>
                                        <button type="button" className={`${currentMenu === 'stores' ? 'active' : ''} nav-link group w-full`}>
                                            <div className="flex items-center">
                                                <FaUserDoctor className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Doctors List</span>
                                            </div>
                                        </button>
                                    </NavLink>
                                </li>
                            )}

                            <li className="nav-item">
                                <ul>
                                    <li className="nav-item">
                                        <NavLink to="/store/advertisment" className="group" onClick={() => toggleMenu('advertisment')}>
                                            <div className="flex items-center">
                                                <FaAdversal />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Advertisement</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default StoreSidebar;

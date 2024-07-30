import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
import { IRootState } from '../../../store';
import IconShoppingCart from '../../../components/Icon/IconShoppingCart';
import IconUser from '../../../components/Icon/IconUser';
import IconArrowLeft from '../../../components/Icon/IconArrowLeft';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useQuery } from '@tanstack/react-query';
import { fetchMostSearchedProducts, fetchStoreCountByCategory, fetchUsersCount } from '../../../api/adminApi';
import Dropdown from '../../../components/Dropdown';
import IconHorizontalDots from '../../../components/Icon/IconHorizontalDots';
import IconEye from '../../../components/Icon/IconEye';
import { Link as ScrollLink } from 'react-scroll';
import { getCategory } from '../../../api/categoryApi';
import { setAdminDetails, setAdminLogout } from '../../../store/adminSlice';

function Dashboard({ role }: { role: string }) {
    const token = localStorage.getItem('adminToken');
    const adminDetails = useSelector((state: any) => state?.admin.adminDetails);
    const [loading] = useState(false);
    const isDark = useSelector((state: IRootState) => state?.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const [isScrolled, setIsScrolled] = useState(false);
    const dispatch = useDispatch()
    useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY >= 10) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
    const { isLoading, error, data } = useQuery({queryKey: ['total-count'],queryFn: () => fetchStoreCountByCategory(adminDetails?.token)});
    const { isLoading: isLoadingCategory, error: errorCategory, data: categoryData } = useQuery({queryKey: ['category'], queryFn:()=> getCategory()      });
    const {isLoading:fetchUsersCountLoading, data:fetchUsersCountData} = useQuery({queryKey:['users-count'],queryFn:()=> fetchUsersCount(adminDetails?.token)})
    const {isLoading:isLoadingMostSearchedProduct,error:mostSearchedErroe,data:mostSearchedProducts} = useQuery({queryKey:['most-searched-products'], queryFn:()=> fetchMostSearchedProducts(adminDetails.token)})

    if(data?.response?.data?.tokenExpired){
        localStorage.removeItem('adminToken');
        dispatch(setAdminLogout());
    }

    if (import.meta.env.VITE_APP_ADMIN_EMAIL !== adminDetails?.email && !token) {
        return (
            <div className="flex justify-center items-center   ">
                {' '}
                <h1 className="text-3xl font-bold ">You do not have the access to this page. </h1>{' '}
            </div>
        );
    }

    if (isLoading || isLoadingCategory || fetchUsersCountLoading || isLoadingMostSearchedProduct) return <div>Loading...</div>;
    if(error || errorCategory || mostSearchedErroe) return <div>Loading data...</div>
    
    if(!data){
        return null;
    }
    if (!Array.isArray(data)) {
        return  <div>Something went wrong. Please try again later</div>;
    }
    //Sales By Category
    const series = (data ?? [])?.map((item: { count: any }) => item?.count);
    const labels = (data ?? [])?.map((item: { category: any }) => item?.category);

    const totalStore = series?.reduce((a:any,b:any)=>{
      return a+b
    },0)

    const totalStores: any = {
        series: series,
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w?.globals?.seriesTotals?.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: labels,
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-white">
                <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Total Stores</div>
                        <div className="dropdown">
                            <Dropdown offset={[0, 5]} placement={`'bottom-end'}`} btnClassName="hover:opacity-80" button={<IconHorizontalDots className="hover:opacity-80 opacity-70" />}>
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="flex items-center mt-5">
                        <div className="text-3xl text-center font-bold ltr:mr-3 rtl:ml-3">{totalStore}</div>
                    </div>
                    <div  className="flex items-center font-semibold mt-5">
                        <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                       <Link to="/admin/stores"> See all stores</Link>
                    </div>
                </div>

                {/* Sessions */}
                <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Total Users</div>
                        <div className="dropdown">
                            <Dropdown offset={[0, 5]} placement={`'bottom-end'}`} btnClassName="hover:opacity-80" button={<IconHorizontalDots className="hover:opacity-80 opacity-70" />}>
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="flex items-center mt-5">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{fetchUsersCountData?.data}</div>
                    </div>
                    <div className="flex cursor-pointer items-center font-semibold mt-5">
                        <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                      <Link to="/admin/users">See all users</Link>  
                    </div>
                </div>

                {/*  Time On-Site */}
                <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Most Searched product</div>
                        <div className="dropdown">
                            <Dropdown offset={[0, 5]} placement={`'bottom-end'}`} btnClassName="hover:opacity-80" button={<IconHorizontalDots className="hover:opacity-80 opacity-70" />}>
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="flex items-center mt-5">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{mostSearchedProducts?.[0].productName}</div>
                    </div>
                    <div onClick={()=>'#most_searched_list'} className="flex cursor-pointer items-center font-semibold mt-5">
                        <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                        <ScrollLink to="most_searched_list" spy={true} smooth={true} offset={-80} duration={500}>Click to see list</ScrollLink>
                      
                    </div>
                </div>

                {/* Bounce Rate */}
                <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Total Categories</div>
                        <div className="dropdown">
                            <Dropdown offset={[0, 5]} placement={`'bottom-end'}`} btnClassName="hover:opacity-80" button={<IconHorizontalDots className="hover:opacity-80 opacity-70" />}>
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="flex items-center mt-5">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{categoryData?.length || 0}</div>
                        {/* <div className="badge bg-white/30">- 0.35% </div> */}
                    </div>
                    <div className="flex items-center font-semibold mt-5">
                        <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                        <Link to="/admin/categories">See all categories</Link>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-y-6  md:grid-cols-2 gap-x-6">
                <div className="panel h-full">
                    <div className="flex items-center mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Stores By Category</h5>
                    </div>
                    <div>
                        <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                            {loading ? (
                                <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                </div>
                            ) : (
                                <ReactApexChart series={totalStores?.series} options={totalStores?.options} type="donut" height={460} />
                            )}
                        </div>
                    </div>
                </div>
                <div id='most_searched_list' className="panel h-full sm:col-span-2 xl:col-span-1 pb-0">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-5">Most Searched top 10 Products</h5>
                    <PerfectScrollbar className="relative h-[290px] ltr:pr-3 rtl:pl-3 ltr:-mr-3 rtl:-ml-3 mb-4">
                        {mostSearchedProducts?.map((item:TSearchedProducts)=>(
                        <div className="text-sm cursor-pointer">
                            <div className="flex items-center py-1.5 relative group">
                                <div className="bg-primary mr-3 w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1.5"></div>
                                <div className="flex-1">{item?.productName}</div>
                        </div>
                        </div>
                        ))}
                    </PerfectScrollbar>
                
                </div>
            </div>
        </>
    );
}

export default Dashboard;

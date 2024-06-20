import React from 'react'
import Dropdown from '../../../components/Dropdown'
import IconEye from '../../../components/Icon/IconEye'
import { Link } from 'react-router-dom'
import IconHorizontalDots from '../../../components/Icon/IconHorizontalDots'
import { Link as ScrollLink } from 'react-scroll';
import { useSelector } from 'react-redux'
import { fetchAllStore, fetchStaffById } from '../../../api/staffApi'
import { useQuery } from '@tanstack/react-query'

function StaffDashboard() {
const staffDetails = useSelector((state:any)=>state.staff.staffDetails)

  const { isPending, error, data } = useQuery({
    queryKey:['stores'], 
    queryFn:()=> fetchAllStore(staffDetails?.token)
  });

  const { isLoading: isPending2, error: errors, data: staffData } = useQuery({
    queryKey: ['staff', staffDetails.token], // Adding token to the queryKey for unique identification
    queryFn: () => fetchStaffById(staffDetails.token),
  });

console.log("staffData  ",staffData)

  const todayAdded = data?.data?.filter((item:any) => {
    const today = new Date();
    const itemDate = new Date(item.createdAt);
  
    return (
      itemDate.getDate() === today.getDate() &&
      itemDate.getMonth() === today.getMonth() &&
      itemDate.getFullYear() === today.getFullYear()
    );
  });

  const thisMonthAdded = data?.data.filter((item:any) => {
    const today = new Date();
    const itemDate = new Date(item.createdAt)

    return itemDate.getMonth() === today.getMonth() && 
    itemDate.getFullYear() === today.getFullYear()
  })
  
  
  if(isPending) return <div>Loading</div>
  if(error)return null;
  console.log("Data ",data)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-white">
    <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
    <div className="flex justify-between">
        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Today added stores</div>
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
        <div className="text-3xl text-center font-bold ltr:mr-3 rtl:ml-3">Today added : {todayAdded.length}</div>
        {/* <div className="badge bg-white/30">+ 2.35% </div> */}
    </div>
    <div  className="flex items-center font-semibold mt-5">
        <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
       <Link to="/staff/stores"> See all stores</Link>
    </div>
</div>
         {/* Sessions */}
         <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Monthly added stores</div>
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
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">This month : {thisMonthAdded?.length} </div>
                        {/* <div className="badge bg-white/30">- 2.35% </div> */}
                    </div>
                    <div className="flex cursor-pointer items-center font-semibold mt-5">
                        <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                      <Link to="/staff/stores">See all stores</Link>  
                    </div>
                </div>

                {/*  Time On-Site */}
                <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Total stores added</div>
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
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">Total Added :{data?.data?.length}</div>
                        {/* <div className="badge bg-white/30">+ 1.35% </div> */}
                    </div>
                    <div onClick={()=>'#most_searched_list'} className="flex cursor-pointer items-center font-semibold mt-5">
                        <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                        <Link to="/staff/stores">See all stores</Link>  
                      
                    </div>
                </div>
                <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Your Target : {staffData?.target}</div>
                        {/* <div className="dropdown">
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
                        </div> */}
                    </div>
                    <div className="flex items-center mt-5">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">You added :{staffData.addedStoresCount}</div>
                        {/* <div className="badge bg-white/30">- 0.35% </div> */}
                    </div>
                    <div className="flex items-center font-semibold mt-5">
                        <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                        <Link to="/staff/stores">See your added details</Link>
                    </div>
                </div>

                {/* Bounce Rate */}
                {/* <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">See your report</div>
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
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"></div>
                    </div>
                    <div className="flex items-center font-semibold mt-5">
                        <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                        <Link to="/admin/categories">See all categories</Link>
                    </div>
                </div> */}
            </div>
  )
}

export default StaffDashboard
import React from 'react'
import { Link } from 'react-router-dom'
import IconPencilPaper from '../../../components/Icon/IconPencilPaper'
import IconCashBanknotes from '../../../components/Icon/IconCashBanknotes'
import IconCalendar from '../../../components/Icon/IconCalendar'
import IconMapPin from '../../../components/Icon/IconMapPin'
import IconMail from '../../../components/Icon/IconMail'
import IconPhone from '../../../components/Icon/IconPhone'
import IconTwitter from '../../../components/Icon/IconTwitter'
import IconGithub from '../../../components/Icon/IconGithub'
import IconDribbble from '../../../components/Icon/IconDribbble'
import { useSelector } from 'react-redux'
import { stat } from 'fs'
import { any } from 'zod'
import IconPencil from '../../../components/Icon/IconPencil'
import IconUser from '../../../components/Icon/IconUser'
import { Breadcrumb } from 'flowbite-react'
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs'

function Account() {
    const  { staffDetails } = useSelector((state:any)=>state.staff)
  return (

    <div>
                <div className="mb-5">
        <Breadcrumbs
        
        
        heading="Account"
                links={[{ name: 'Dashboard', href: '/staff' }, { name: 'Account' }]}  />
             {/* <div className="panel shadow-md w-1/3">
                <div className="flex items-center justify-center    stify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Profile</h5>
                    <Link to="/users/user-account-settings" className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
                        <IconPencil/>
                    </Link>
                </div>
                    <div className="flex flex-col justify-center items-center">
                  </div>
                    <ul className="mt-5 flex flex-col max-w-[160px] m-auto space-y-4 font-semibold text-white-dark">
                        <li className="flex items-center gap-2">
                            <IconUser className="shrink-0 w-14 h-14" />
                        </li>
                        <li className="flex items-center gap-2 ">
                           {staffDetails?.name}
              
                        </li>
                        <li className="flex items-center gap-2">
                            <IconMail className="shrink-0" />
                            {staffDetails?.email}
                        </li>
                     
                       
                    </ul>
                </div> */}
            </div>

    </div>
  )
}

export default Account
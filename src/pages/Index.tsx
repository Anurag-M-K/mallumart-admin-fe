import React from 'react'
import { useNavigate } from 'react-router-dom'

function Index() {
    const navigate = useNavigate()
  return (
    <div className='flex flex-col gap-y-5 justify-center items-center h-screen gap-x-4'>
          <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>
            <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
              
        <h1 className='text-2xl z-10'>Click here to login</h1>
        <div className='flex sm:gap-x-4 flex-col sm:flex-row gap-y-4 z-10 '>

        <button onClick={()=>navigate("/admin/login")} className='bg-blue-700 px-6 py-2 text-lg text-white rounded-md hover:scale-90 transition duration-300 font-bold '>ADMIN</button>
        <button onClick={()=>navigate("/staff/login")} className='bg-blue-700 px-6 py-2 text-lg text-white rounded-md hover:scale-90 transition duration-300 font-bold '>STAFF</button>
        <button onClick={()=>navigate("/store/login")} className='bg-blue-700 px-6 py-2 text-lg text-white rounded-md hover:scale-90 transition duration-300 font-bold '>STORE</button>
        </div>
    </div>
  )
}

export default Index
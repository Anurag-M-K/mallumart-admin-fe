import { lazy } from 'react';
import Dashboard from '../pages/Admin/dashboard/Dashboard';
import ProductView from '../pages/storeOwner/products/products-store';
import ProtectedRouteAdmin from '../components/protectedRoutes/ProtectedRoutesAdmin';
import ProtectedRouteStaff from '../components/protectedRoutes/ProtectedRoutesStaff';
import ProtectedRouteStore from '../components/protectedRoutes/ProtectedRoutesStore';
import ErrorPage from '../components/404/ErrorPage';
import Index from '../pages/Index';

// const Index = lazy(() => import('../pages/Index'));
const LoginBoxed = lazy(() => import('../pages/Admin/Authentication/LoginBoxed'));
const StaffManagement = lazy(() => import('../pages/Admin/staff-management/StaffManagement'));
const UsersManagement = lazy(() => import('../pages/Admin/users-management/UsersManagement'));
const StoreManagement = lazy(() => import('../pages/Admin/store-management/StoreManagement'));
const StoreViewEdit = lazy(() => import('../pages/Admin/store-management/store/store-view-edit'));
const CategoryManagement = lazy(() => import('../pages/Admin/category/CategoryManagement'));
const CategoryRequests = lazy(() => import('../pages/Admin/category/category-request'));
const StaffLogin = lazy(() => import('../pages/staff/Authentication/StaffLogin'));
const StaffDashboard = lazy(() => import('../pages/staff/Dashboard/StaffDashboard'));
const StaffStoreManagement = lazy(() => import('../pages/staff/store-management/StoreManagent'));
const StoreOwnerLogin = lazy(() => import('../pages/storeOwner/authentication/StoreOwnerLogin'));
const StoreOwnerLanding = lazy(() => import('../pages/storeOwner/landing/storeOwnerLanding'));
const UserRegister = lazy(() => import('../pages/user/authentication/Registration'));
const UserLogin = lazy(() => import('../pages/user/authentication/Login'));
const StoreAdding = lazy(() => import('../pages/staff/store-management/StoreAdding'));
const NewStore = lazy(() => import('../pages/staff/store-management/new-product/new-product'));
const ViewStoreFromAdmin = lazy(() => import('../pages/Admin/store-management/store/store-view-edit'));
const EditStore = lazy(() => import('../pages/staff/store-management/store/store-view-edit'));
const CategoryStaffSide = lazy(() => import('../pages/staff/category/CategoryManagement'));
const StaffAccount = lazy(()=>import('../pages/staff/account/Account'))
const Advertisment = lazy(()=>import("../pages/Admin/advertisement-management/AdvertisementManagement"))
const AdvertismentStoreSide = lazy(()=>import("../pages/storeOwner/advertisement-management/AdvertisementManagement"))
const Landing = lazy(()=>import("../pages/Index"))
const ForgotPasswordPhoneField = lazy(()=>import("../pages/staff/Authentication/ForgotPasswordPhoneFieldPage"))
const StoreForgotPasswordPhoneField = lazy(()=>import("../pages/storeOwner/authentication/ForgotPasswordPhoneFieldPage"))
const OtpVerifying = lazy(()=>import("../pages/staff/Authentication/OtpVerifyingStaff"))
const StoreOtpVerifying = lazy(()=>import("../pages/storeOwner/authentication/OtpVerifyingStore"))
const ChangePassword = lazy(()=>import("../pages/staff/Authentication/ChangePasswordPage"))
const StoreChangePassword = lazy(()=>import("../pages/storeOwner/authentication/ChangePasswordPage"))
const EditProfile = lazy(()=>import("../pages/storeOwner/profile/EditProfile"))
const BookingList = lazy(()=>import("../pages/storeOwner/bookings/BookingList"))
const routes = [

{
path:"/",
element:<Index/>,
layout:"blank"
},

    // ADMIN ROUTES
    {
        path: '/admin/login',
        element: <LoginBoxed role={'Admin'} />,
        layout: 'blank',
    },
    {
        path: '/admin',
        element: <ProtectedRouteAdmin><Dashboard role={'Admin'} /></ProtectedRouteAdmin>,
        layout: 'default',
    },
    {
        path: '/admin/stores',
        element: <ProtectedRouteAdmin><StoreManagement /></ProtectedRouteAdmin>,
        layout: 'default',
    },
    {
        path: '/admin/stores/:id',
        // element: <StoreViewEdit />,
        // element: <ViewStoreFromAdmin />,
        element:<ProtectedRouteAdmin> <EditStore admin={true} /></ProtectedRouteAdmin>,
        layout: 'default',
    },
    {
        path: '/admin/categories',
        element: <ProtectedRouteAdmin><CategoryManagement /></ProtectedRouteAdmin>,
        layout: 'default',
    },
    {
        path: '/admin/categories/requests',
        element:<ProtectedRouteAdmin> <CategoryRequests /></ProtectedRouteAdmin>,
        layout: 'default',
    },
    {
        path: '/admin/staffs',
        element:<ProtectedRouteAdmin>  <StaffManagement /></ProtectedRouteAdmin>,
        layout: 'default',
    },
    {
        path: '/admin/users',
        element:<ProtectedRouteAdmin>  <UsersManagement /></ProtectedRouteAdmin>,
        layout: 'default',
    },
    {
        path: '/admin/advertisment',
        element: <ProtectedRouteAdmin><Advertisment/></ProtectedRouteAdmin>,
        layout: 'default',
    },
    {
        path: '/admin/account',
        element: <ProtectedRouteAdmin><h1>Account Page</h1></ProtectedRouteAdmin>,
        layout: 'default',
    },
    // STAFFS ROUTES
    {
        path: '/staff/login',
        element: <StaffLogin role={'Staff'} />,
        layout: 'blank',
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPhoneField />,
        layout: 'blank',
    },
    {
        path: '/otp-verify/:id',
        element: <OtpVerifying  />,
        layout: 'blank',
    },
    {
        path: '/change-password',
        element: <ChangePassword  />,
        layout: 'blank',
    },
   
    {
        path: '/staff',
        element: <ProtectedRouteStaff><StaffDashboard /></ProtectedRouteStaff>,
        layout: 'stafflayout',
    },
    {
        path: '/staff/stores',
        element:<ProtectedRouteStaff> <StaffStoreManagement /></ProtectedRouteStaff>,
        layout: 'stafflayout',
    },
    {
        path: '/staff/stores/new',
        element: <ProtectedRouteStaff><StoreAdding /></ProtectedRouteStaff>,
        layout: 'stafflayout',
    },
    {
        path: '/staff/stores/:id',
        element:<ProtectedRouteStaff> <EditStore /></ProtectedRouteStaff>,
        layout: 'stafflayout',
    },
    {
        path: '/staff/categories',
        element:<ProtectedRouteStaff><CategoryStaffSide /></ProtectedRouteStaff>,
        layout: 'stafflayout',
    },
    {
        path: '/staff/categories/requests',
        element: <ProtectedRouteStaff><h1>category request for staff - is it needs</h1></ProtectedRouteStaff>,
        layout: 'stafflayout',
    },
    {
        path: '/staff/account',
        element: <ProtectedRouteStaff><StaffAccount/></ProtectedRouteStaff>,
        layout: 'stafflayout',
    },

    // STORES ROUTES
    {
        path: '/store/login',
        element: <StoreOwnerLogin />,
        layout: 'blank',
    },
    {
        path: '/store/forgot-password',
        element: <StoreForgotPasswordPhoneField />,
        layout: 'blank',
    },
    {
        path: '/store/otp-verify/:id',
        element: <StoreOtpVerifying  />,
        layout: 'blank',
    },
    {
        path: '/store/change-password',
        element: <StoreChangePassword  />,
        layout: 'blank',
    },
    {
        path: '/store/:id',
        element: <ProtectedRouteStore><EditProfile /></ProtectedRouteStore>,
        layout: 'storeLayout',
    },
    {
        path: '/store',
        element: <ProtectedRouteStore><StoreOwnerLanding /></ProtectedRouteStore>,
        layout: 'storeLayout',
    },
    {
        path: '/store/products',
        element:<ProtectedRouteStore> <ProductView /></ProtectedRouteStore>,
        layout: 'storeLayout',
    },
    {
        path: '/store/bookings',
        element:<ProtectedRouteStore> <BookingList /></ProtectedRouteStore>,
        layout: 'storeLayout',
    },
    {
        path: '/store/subscription',
        element: <ProtectedRouteStore><h1>Subscription page</h1></ProtectedRouteStore>,
        layout: 'storeLayout',
    },
    {
        path: '/store/advertisment',
        element: <ProtectedRouteStore><AdvertismentStoreSide/></ProtectedRouteStore>,
        layout: 'storeLayout',
    },
    {
        path: '/store/contact-us',
        element: <ProtectedRouteStore><h1>Contact us</h1></ProtectedRouteStore>,
        layout: 'storeLayout',
    },
    // common
  
    // 404 page
    {
        path: '/*',
        element: <ErrorPage/>,
        layout: 'blank',
    }
];

export { routes };

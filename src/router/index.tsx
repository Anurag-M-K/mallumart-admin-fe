import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { routes } from './routes';
import StaffLayout from '../components/Layouts/StaffLayout';
import StoreLayout from '../components/Layouts/StoreLayout';

const finalRoutes = routes.map((route) => {
    let layoutComponent;
    if (route.layout === 'blank') {
        layoutComponent = <BlankLayout>{route.element}</BlankLayout>;
    } else if (route.layout === 'stafflayout') {
        layoutComponent = <StaffLayout>{route.element}</StaffLayout>;
    }else if (route.layout === 'storeLayout') {
        layoutComponent = <StoreLayout>{route.element}</StoreLayout>;
    } else {
        layoutComponent = <DefaultLayout>{route.element}</DefaultLayout>;
    }

    return {
        ...route,
        element: layoutComponent,
    };
});

const router = createBrowserRouter(finalRoutes);

export default router;

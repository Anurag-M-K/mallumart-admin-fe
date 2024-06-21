import { Tab } from '@headlessui/react';
import { Breadcrumbs } from '../../../../components/breadcrumbs/breadcrumbs';
import IconHome from '../../../../components/Icon/IconHome';
import { useState } from 'react';
import IconUser from '../../../../components/Icon/IconUser';
import IconBox from '../../../../components/Icon/IconBox';
import { Toaster } from 'react-hot-toast';
import EditViewStoreForm from '../../../../components/shop-sections/edit-view-form';
import ProductView from '../../../../components/shop-sections/product-view';
import SubscriptionManage from '../../../../components/shop-sections/SubscriptionManage';

function StoreViewEdit({ admin = false }: { admin?: boolean }) {
    const [tabs, setTabs] = useState<string>('storeInfo');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    return (
        <div>
            <Breadcrumbs
                heading="Stores"
                links={[{ name: 'Dashboard', href: admin ? '/admin' : '/staff' }, { name: 'Stores', href: admin ? '/admin/stores' : '/staff/stores' }, { name: 'Store Name' }]}
            />

            <div>
                <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                    <li className="inline-block">
                        <button
                            onClick={() => toggleTabs('storeInfo')}
                            className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'storeInfo' ? '!border-primary text-primary' : ''}`}
                        >
                            <IconHome />
                            Store
                        </button>
                    </li>
                    <li className="inline-block">
                        <button
                            onClick={() => toggleTabs('products')}
                            className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'products' ? '!border-primary text-primary' : ''}`}
                        >
                            <IconUser className="w-5 h-5" />
                            Products
                        </button>
                    </li>
                    <li className="inline-block">
                        <button
                            onClick={() => toggleTabs('subscription')}
                            className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'subscription' ? '!border-primary text-primary' : ''}`}
                        >
                            <IconBox />
                            Subscription
                        </button>
                    </li>
                </ul>
            </div>
            {tabs === 'storeInfo' ? (
                <div className="p-2 md:p-10">
                    <EditViewStoreForm />
                </div>
            ) : tabs === 'products' ? (
                <ProductView />
            ) : (
                <SubscriptionManage/>
            )}
            <Toaster />
        </div>
    );
}

export default StoreViewEdit;
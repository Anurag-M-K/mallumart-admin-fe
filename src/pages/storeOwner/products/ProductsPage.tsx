import React from 'react';
import ProductView from './products-store';
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';

function ProductsPage() {
    return (
        <div>
            <Breadcrumbs heading="Products" links={[{ name: 'Dashboard', href: '/store' }, { name: 'Products' }]} />

            <ProductView />
        </div>
    );
}

export default ProductsPage;

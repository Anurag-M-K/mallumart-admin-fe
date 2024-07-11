import { useDispatch } from 'react-redux';

import { setPageTitle } from '../../../store/themeConfigSlice';
import { useEffect } from 'react';
import NewEditStoreForm from './store/store-view-edit-new';
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';

function StoreAdding() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('New Store'));
    }, []);

    return (
        <div>
            <Breadcrumbs heading="Stores" links={[{ name: 'Dashboard', href: '/staff' }, { name: 'Stores', href: '/staff/stores' }, { name: 'Add a New Store' }]} />
            <NewEditStoreForm />
        </div>
    );
}

export default StoreAdding;
import React from 'react';
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';
import DoctorsList from './DoctorsList';

function DoctorDetailsPage() {
    return (
        <div>
            <Breadcrumbs heading="Doctors List" links={[{ name: 'Dashboard', href: '/store' }, { name: 'Doctors List' }]} />
            <DoctorsList/>
        </div>
    );
}

export default DoctorDetailsPage;

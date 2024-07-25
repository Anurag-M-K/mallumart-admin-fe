import React from 'react';
import BookingList from './BookingList';
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';

function BookingPage() {
    return (
        <div>
            <Breadcrumbs heading="Bookings" links={[{ name: 'Dashboard', href: '/store' }, { name: 'Bookings' }]} />

            <BookingList />
        </div>
    );
}

export default BookingPage;

import React, { useState, Fragment } from 'react';
import StaffDetailsTable from './StaffsDetailsTable';
// import { Dialog, Transition } from '@mantine/core';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../../components/Icon/IconX';
import IconUser from '../../../components/Icon/IconUser';
import IconAt from '../../../components/Icon/IconAt';
import IconLock from '../../../components/Icon/IconLock';
import IconFacebook from '../../../components/Icon/IconFacebook';
import IconGithub from '../../../components/Icon/IconGithub';
import { Field, Form } from 'react-final-form';
import WrappedInput from '../../../components/wrappedComponents/WrappedInputField';
import IconMail from '../../../components/Icon/IconMail';
import { addStaff, getStaffs } from '../../../api/adminApi';
import { Spinner } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { setStaffDetails } from '../../../store/staffManagementSlice';
import { validation_email, validation_required } from '../../../utils/validation';
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';
import IconPlus from '../../../components/Icon/IconPlus';

function StaffManagement() {
    const [staffRegisterModal, setStaffRegisterModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const adminDetails = useSelector((state: any) => state.admin.adminDetails);
    const dispatch = useDispatch();
    if (import.meta.env.VITE_APP_ADMIN_EMAIL !== adminDetails?.email) {
        return (
            <div className="flex justify-center items-center   ">
                {' '}
                <h1 className="text-3xl font-bold ">You do not have the access to this page. </h1>{' '}
            </div>
        );
    }

    const onSubmit = async (values: any) => {
        try {
            setLoading(true);
            const response = await addStaff(values, adminDetails?.token);
            const staffData = await getStaffs(adminDetails?.token);
            dispatch(setStaffDetails(staffData));
            console.log('resopnbse ', response);
            setStaffRegisterModal(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <div>
                        <Breadcrumbs heading="Staff Management" links={[{ name: 'Dashboard', href: '/admin' }, { name: 'Staff Management' }]} />

            <div className="flex justify-end my-4">
            <button type="button"  onClick={() => setStaffRegisterModal(true)} className="btn btn-primary">
                            <IconPlus className="w-5 h-5 ltr:mr-1.5 rtl:ml-1.5 shrink-0" />
                            Register Staff
                        </button>
            </div>
           
            <StaffDetailsTable />

            <div>
                <Transition appear show={staffRegisterModal} as={Fragment}>
                    <Dialog
                        as="div"
                        open={staffRegisterModal}
                        onClose={() => {
                            setStaffRegisterModal(false);
                        }}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div id="register_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-start justify-center px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="panel my-8 w-full max-w-sm overflow-hidden rounded-lg border-0 py-1 px-4 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-between p-5 text-lg font-semibold dark:text-white">
                                            <h5>Add Staff</h5>
                                            <button type="button" onClick={() => setStaffRegisterModal(false)} className="text-white-dark hover:text-dark">
                                                x
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <Form
                                                onSubmit={onSubmit}
                                                render={({ handleSubmit, values }) => (
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="relative my-2 text-white-dark">
                                                            <Field
                                                                id="name"
                                                                type="name"
                                                                placeholder="Enter Staff Name"
                                                                component={WrappedInput}
                                                                className="form-input  placeholder:text-white-dark"
                                                                name="name"
                                                                validate={validation_required}

                                                            />
                                                        </div>
                                                        <div className="relative my-5 text-white-dark">
                                                            <Field
                                                                id="email"
                                                                type="email"
                                                                placeholder="Enter Staff Email"
                                                                component={WrappedInput}
                                                                className="form-input ps-10 placeholder:text-white-dark"
                                                                name="email"
                                                                validate={validation_email}

                                                            />
                                                        </div>
                                                        <div className="relative my-5 text-white-dark">
                                                            <Field
                                                                id="password"
                                                                type="password"
                                                                placeholder="Enter Staff Password"
                                                                component={WrappedInput}
                                                                className="form-input ps-10 placeholder:text-white-dark"
                                                                name="password"
                                                            />
                                                        </div>

                                                        <button type="submit" className="btn mb-5 btn-primary w-full">
                                                            Submit
                                                        </button>
                                                    </form>
                                                )}
                                            />
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
}

export default StaffManagement;

import { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTarget, deleteStaff, getStaffs, updateStaff } from '../../../api/adminApi';
import { setStaffDetails } from '../../../store/staffManagementSlice';
import { FaEdit } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';
import { Field, Form } from 'react-final-form';
import WrappedInput from '../../../components/wrappedComponents/WrappedInputField';
import WrappedSelect from '../../../components/wrappedComponents/wrappedComponent';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Swal from 'sweetalert2';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import toast, { Toaster } from 'react-hot-toast';
import { Spinner, Tooltip } from 'flowbite-react';
import { IoMdClose } from 'react-icons/io';

const StaffDetailsTable = () => {
    const adminDetails = useSelector((state: any) => state.admin.adminDetails);
    const dispatch = useDispatch();
    const staffDetails: any = useSelector((state: any) => state?.staffs?.staffDetails);
    const [updatingModal, setUpdatingModal] = useState(false);
    const [clickedStaffId, setClickedStaffId] = useState<string>('');
    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    const [staffReportModal, setStaffReportModal] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchStaff = async () => {
            const res = await getStaffs(adminDetails?.token);
            dispatch(setStaffDetails(res));
        };
        fetchStaff();
    }, []);

    console.log("sel;ected staff ",selectedStaff)
    // updating staff details
    const onSubmit = async (values: any) => {
        values.email = selectedStaff.email
        const res: any = await updateStaff(adminDetails?.token, values);
        setUpdatingModal(false);
        const staffData = await getStaffs(adminDetails?.token);
        dispatch(setStaffDetails(staffData));
        console.log("res ",res)
        if (res?.status === 200) {
            showAlert('success','Updated Successfully');
        } else {
            toast.error('Something went wrong');
        }
    };

    const handleEdit = async (id: any) => {
        setClickedStaffId(id);
        const Staff = staffDetails?.find((staff: any) => staff?._id === id);
        setUpdatingModal(true);
        if (Staff) {
            setSelectedStaff(Staff);
        }
    };
    const showDeleteAlert = async (id: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await deleteStaff(adminDetails?.token, id);
                const staffData = await getStaffs(adminDetails?.token);
                dispatch(setStaffDetails(staffData));
                Swal.fire('Deleted!', 'Your staff has been deleted.', 'success');
            }
        });
    };

    const showAlert = async (icon: any, title: string) => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
        });
        toast.fire({
            icon,
            title,
            padding: '10px 20px',
        });
    };

    const selectedStaffTarget: any = staffDetails?.filter((item: any) => {
        return item?._id == staffReportModal;
    });

    const targetSubmit = async (values: TTarget) => {
        try {
            setLoading(true);
            values.staffId = staffReportModal;
            const res = await addTarget(adminDetails.token, values);
            const staffResponise = await getStaffs(adminDetails?.token);
            dispatch(setStaffDetails(staffResponise));
            if (res?.status === 200) {
                showAlert('success', res?.data?.message);
            }
            setStaffReportModal('');
            setLoading(false);
        } catch (error) {
            showAlert('error', 'Something went wrong! please try again later');
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <div>
            <DataTable
                className="whitespace-nowrap table-hover"
                columns={[
                    {
                        title: 'Staff Name',
                        accessor: 'name',
                        render: (staff: any) => {
                            return (
                                <div onClick={() => setStaffReportModal(staff._id)} className="cursor-pointer text-blue-600">
                                    <Tooltip content="Click to see staff details"> {staff.name} </Tooltip>
                                </div>
                            );
                        },
                    },
                    {
                        title: 'Email',
                        accessor: 'email',
                    },
                    {
                        title: 'Phone',
                        accessor: 'phone',
                    },
                    {
                        title: 'Status',
                        accessor: 'status',
                    },
                    {
                        accessor: 'Actions',
                        title: 'Action',
                        render: (staff:any ) => {
                            return (
                                <div className="flex gap-x-3">
                                    <FaEdit className="cursor-pointer" size={20} onClick={() => handleEdit(staff?._id)} color="green" />
                                    <RiDeleteBin6Line className="cursor-pointer" size={20} onClick={() => showDeleteAlert(staff?._id)} color="red" />
                                </div>
                            );
                        },
                    },
                ]}
                records={staffDetails}
                // pagination
                // paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
            />

            {/* updating staff modal  */}
            <Transition appear show={updatingModal} as={Fragment}>
                <Dialog
                    as="div"
                    open={updatingModal}
                    onClose={() => {
                        setUpdatingModal(false);
                    }}
                >
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                                        <h5>Update Staff</h5>
                                        <button type="button" onClick={() => setUpdatingModal(false)} className="text-white-dark hover:text-dark">
                                        <IoMdClose />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <Form
                                            onSubmit={onSubmit}
                                            initialValues={{ name: selectedStaff?.name, email: selectedStaff?.email, status: selectedStaff?.status }}
                                            render={({ handleSubmit, values }) => (
                                                <form onSubmit={handleSubmit}>
                                                    {/* <div className="relative mb-5 text-white-dark">
                                                        <div className="border py-2 rounded-md ps-5">{selectedStaff?.email}</div>
                                                    </div> */}
                                                    <div className="relative my-2 text-white-dark">
                                                        <Field
                                                            initialValue={selectedStaff?.name}
                                                            id="name"
                                                            type="name"
                                                            placeholder="Enter Staff Name"
                                                            component={WrappedInput}
                                                            className="form-input  placeholder:text-white-dark"
                                                            name="name"
                                                        />
                                                    </div>

                                                    <div className="relative my-5 text-white-dark">
                                                        <Field
                                                            id="status"
                                                            type="status"
                                                            component={WrappedSelect}
                                                            className="form-input ps-10 placeholder:text-white-dark"
                                                            name="status"
                                                            options={[
                                                                { value: 'active', label: 'Active' },
                                                                { value: 'inactive', label: 'Inactive' },
                                                            ]}
                                                        />
                                                    </div>

                                                    <button type="submit" className="btn mb-5 btn-primary w-full">
                                                        Update
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

            {/* staff report modal  */}
            <Transition appear show={staffReportModal !== ''} as={Fragment}>
                <Dialog
                    as="div"
                    open={staffReportModal !== ''}
                    onClose={() => {
                        setStaffReportModal('');
                    }}
                >
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                                <Dialog.Panel className="panel  my-8 w-full max-w-sm overflow-hidden rounded-lg border-0 py-1 px-4 text-black dark:text-white-dark">
                                    <div className="flex p-5 items-center justify-between  text-lg font-semibold dark:text-white">
                                        <h2>Staff target</h2>

                                        <button type="button" onClick={() => setStaffReportModal('')} className="text-white-dark hover:text-dark">
                                            <IoMdClose />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        {/* <h1 className="text-xl font-medium">Added Stores</h1>
                                        {selectedStaffTarget && selectedStaffTarget[0]?.target > 0 && <h1>Current Target : <span className="text-xl my-3 font-bold"> {selectedStaffTarget[0]?.target}</span> </h1>}
                                        <h4>Current count of added stores : <span className="text-xl my-3 font-bold">{selectedStaffTarget[0]?.addedStoresCount}</span></h4> */}
                                        <h1 className="text-xl font-medium">Added Stores</h1>
                                        {selectedStaffTarget && selectedStaffTarget[0]?.target > 0 && (
                                            <h1>
                                                Current Target : <span className="text-xl my-3 font-bold"> {selectedStaffTarget[0]?.target}</span>{' '}
                                            </h1>
                                        )}
                                        <h4>
                                            Current count of added stores : <span className="text-xl my-3 font-bold">{selectedStaffTarget && selectedStaffTarget[0]?.addedStoresCount}</span>
                                        </h4>
                                    </div>
                                    <div className="px-5">
                                        <Form
                                            onSubmit={targetSubmit}
                                            initialValues={{ name: selectedStaff?.name, email: selectedStaff?.email, status: selectedStaff?.status }}
                                            render={({ handleSubmit, values }) => (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="relative my-2 text-white-dark">
                                                        <Field
                                                            initialValue={selectedStaff?.name}
                                                            id="target"
                                                            label={selectedStaffTarget[0]?.target > 0 && 'Update Target'}
                                                            type="number"
                                                            placeholder="Enter target"
                                                            component={WrappedInput}
                                                            className="form-input text-2xl placeholder:text-white-dark"
                                                            name="target"
                                                        />
                                                    </div>

                                                    <button type="submit" className="btn mb-5 btn-primary w-full">
                                                        {loading ? <Spinner /> : 'Save'}
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
            <Toaster />
        </div>
    );
};

export default StaffDetailsTable;

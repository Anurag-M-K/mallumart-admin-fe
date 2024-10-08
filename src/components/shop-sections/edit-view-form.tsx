import { Field, Form } from 'react-final-form';
import { getCategory } from '../../api/categoryApi';
import { useQuery } from '@tanstack/react-query';
import { updateStore } from '../../api/staffApi';
// import { fetchAllStore } from '../../api/staffApi';
import { setStoreData } from '../../store/storeSlice';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WrappedInput from '../wrappedComponents/WrappedInputField';
import WrappedSelect, { WrappedCheckbox, WrappedInputForUniqueName, WrappedLocation, wrapidQuill } from '../wrappedComponents/wrappedComponent';
import { districts } from '../../constants/store';
import { Spinner } from 'flowbite-react';
import { fetchAllStore } from '../../api/commonApi';

export default function EditViewStoreForm({ admin }: { admin: boolean }) {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const storeData = useSelector((state: any) => state?.stores?.storeData);
    const storeId: string | undefined = window.location.pathname.split('/').pop();
    const singleStore = storeData?.filter((item: any) => item?._id === storeId);
    const [isFormEdited, setIsFormEdited] = useState(false);
    const adminDetails = useSelector((state: any) => state?.admin?.adminDetails);
    const navigate = useNavigate();
    const staffData = useSelector((state: any) => state?.staff);

    const onSubmit = async (values: TStoreValues) => {
        const changedFields: Partial<TStoreValues> = {};
        Object.keys(values).forEach((key) => {
            if (values[key] !== singleStore[0][key]) {
                changedFields[key] = values[key];
            }
        });
        changedFields.storeId = storeId;
        try {
            setLoading(true);
            const response: any = await updateStore(admin ? adminDetails?.token : staffData?.staffToken /*, changedFields,admin ? "admin":"staff" */);
            if (!admin) {
                const res: any = await fetchAllStore(staffData?.staffToken, 'staff');
                dispatch(setStoreData(res?.data));
            } else {
                const res: any = await fetchAllStore(adminDetails?.token, 'admin');
                dispatch(setStoreData(res?.data));
            }

            toast.success('Store updated');
            // navigate('/staff/stores');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    // Fetching category data
    const { isPending, error, data } = useQuery({
        queryKey: ['category'],
        queryFn: () => getCategory(),
    });
    const categoryOptions: ICategorySchema[] = (data ?? []).map((category) => ({
        label: category?.name,
        value: category?._id,
    }));
    console.log('single store ', singleStore);

    return (
        <Form
            initialValues={
                singleStore
                    ? {
                          shopImgUrl: singleStore[0]?.shopImgUrl,
                          storeName: singleStore[0]?.storeName,
                          uniqueName: singleStore[0]?.uniqueName,
                          district: singleStore[0]?.district,
                          location: singleStore[0]?.location,
                          email: singleStore[0]?.email,
                          wholeSale: singleStore[0]?.wholeSale ?? false,
                          retail: singleStore[0]?.retail ?? false,
                          category: singleStore[0]?.category,
                          address: singleStore[0]?.address,
                          phone: singleStore[0]?.phone,
                          storeOwnerName: singleStore[0]?.storeOwnerName,
                          bio: singleStore[0]?.bio,
                          status: singleStore[0].status,
                      }
                    : {}
            }
            reloadOnSubmit={false}
            onSubmit={(values: TStoreValues) => onSubmit(values)}
            render={({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit} className="md:grid md:grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <div className="flex flex-col gap-4">
                            <Field
                                id="storeName"
                                // validate={validation_required}
                                type="text"
                                label="Shop Name"
                                placeholder="Enter store name"
                                component={WrappedInput}
                                className="form-input ps-10 placeholder:text-white-dark"
                                name="storeName"
                            />
                            <Field
                                id="uniqueName"
                                // validate={validation_required}
                                type="text"
                                action="updating"
                                label="Unique name"
                                placeholder="Enter a name for your shop"
                                component={WrappedInputForUniqueName}
                                className="form-input ps-10 placeholder:text-white-dark"
                                name="uniqueName"
                            />
                            <Field
                                id="district"
                                // validate={validation_required}
                                type="text"
                                label="District"
                                placeholder="Enter store district"
                                component={WrappedSelect}
                                options={districts}
                                className="form-input ps-10 placeholder:text-white-dark"
                                name="district"
                            />
                            <Field
                                id="location"
                                type="text"
                                label="Location"
                                placeholder="Enter store location"
                                component={WrappedLocation}
                                className="form-input ps-10 placeholder:text-white-dark"
                                name="location"
                            />
                            <Field
                                id="email"
                                type="text"
                                label="Email"
                                placeholder="Enter store email"
                                component={WrappedInput}
                                className="form-input ps-10 placeholder:text-white-dark"
                                name="email"
                            />
                            <div className="flex border-none text-white-dark">
                                <Field
                                    initialValue={singleStore[0]?.wholeSale ?? false}
                                    id="wholeSale"
                                    type="checkbox"
                                    className="placeholder:text-white-dark"
                                    name="wholeSale"
                                    label="Whole sale"
                                    component={WrappedCheckbox}
                                    value={singleStore[0]?.wholeSale ?? false}
                                />
                                <Field
                                    initialValue={singleStore[0]?.retail ?? false}
                                    id="retail"
                                    type="checkbox"
                                    label="Retail"
                                    component={WrappedCheckbox}
                                    className="placeholder:text-white-dark"
                                    name="retail"
                                    value={singleStore[0]?.retail ?? false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-6">
                        <div className="flex flex-col gap-4">
                            <Field
                                initialValue={singleStore?.[0]?.category}
                                id="category"
                                // validate={validation_required}
                                type="text"
                                label={'Category'}
                                placeholder={singleStore?.[0]?.category ?? 'Category'}
                                options={categoryOptions}
                                component={WrappedSelect}
                                className="form-input ps-10 placeholder:text-white-dark"
                                name="category"
                            />
                            <Field
                                id="address"
                                // validate={validation_required}
                                type="text"
                                label="Address"
                                placeholder="Enter store address"
                                component={WrappedInput}
                                className="form-input ps-10 placeholder:text-white-dark"
                                name="address"
                            />
                            <Field
                                id="phone"
                                // validate={validation_required}
                                type="text"
                                label="Phone"
                                placeholder="Enter store phone number"
                                component={WrappedInput}
                                className="form-input ps-10 placeholder:text-white-dark"
                                name="phone"
                            />
                            <Field
                                id="storeOwnerName"
                                // validate={validation_required}
                                type="text"
                                label="Shop Owner Name"
                                placeholder="Enter store owner name"
                                component={WrappedInput}
                                className="form-input ps-10 placeholder:text-white-dark"
                                name="storeOwnerName"
                            />
                            <Field id="bio" type="text" label="Bio" placeholder="Enter store bio" component={wrapidQuill} className="placeholder:text-white-dark" name="bio" />
                        </div>
                    </div>
                    <div className="col-span-12 flex justify-end">
                        <button type="submit" className="btn bg-green-600 text-white md:w-full   hover:bg-green-500">
                            {loading ? <Spinner color={'info'} /> : 'Save'}
                        </button>
                    </div>
                    <Toaster position="bottom-right" />
                </form>
            )}
        />
    );
}

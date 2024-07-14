import * as z from 'zod';
import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ImageUploading from 'react-images-uploading';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import IconX from '../../../../components/Icon/IconX';
import RHFTextField from '../../../../components/hook-form/rhf-text-field';
import FormProvider from '../../../../components/hook-form/form-provider';
import IconLoader from '../../../../components/Icon/IconLoader';
import RHFCheckbox from '../../../../components/hook-form/rhf-checkbox';
import OtpInput from '../../../../components/otp/otp';

import { districts } from '../../../../constants/store';

import { IStore } from '../../../../types/store';

import { getCategory } from '../../../../api/categoryApi';
import { addStore, updateStore, checkPhoneAndUniquenameAndSendOtp, searchUniqueNameExist } from '../../../../api/staffApi';
import { uploadImage } from '../../../../api/utilsApi';
import { getSubsciptionPlans } from '../../../../api/subscriptionApi';

import { compressImage, isValidImage } from '../../../../utils/image-upload';

const URL_REGEX = /^[a-z0-9-_]+$/;
const numericRegex = /^\d+$/;

function NewEditStoreForm({ editDefaultValues }: { editDefaultValues?: IStore }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [isSendOtp, setIsSendOtp] = useState(false);
    const [storeData, setStoreData] = useState<IStoreSchema>();

    const { data, isPending } = useQuery({
        queryKey: ['category'],
        queryFn: () => getCategory({ isActive: true }),
        enabled: !editDefaultValues,
    });

    const isPendingCategories = isPending && !editDefaultValues;

    const { data: subscriptionPlans, isPending: isPendingSubscriptionPlans } = useQuery({
        queryKey: ['subscriptions'],
        queryFn: () => getSubsciptionPlans(),
    });

    const storeSchema = useMemo(
        () =>
            z.object({
                storeName: z.string().trim().min(1, "shop name can't be empty"),
                uniqueName: z
                    .string()
                    .trim()
                    .min(3, 'atleast 3 character')
                    .max(30, "can't be longer than 30 characters")
                    .regex(URL_REGEX, 'only contain lowercase letters, numbers, hyphens, and underscores')
                    .refine((val) => {
                        if (editDefaultValues) return true;
                        return debouncedSearch(val);
                    }),
                category: z.object(
                    {
                        value: z.string(),
                        label: z.string(),
                    },
                    { message: 'category cannot be empty' }
                ),
                retail: z.boolean().default(false),
                wholesale: z.boolean().default(false),
                longitude: z.number(),
                latitude: z.number(),
                district: z.object(
                    {
                        value: z.string(),
                        label: z.string(),
                    },
                    { message: 'district cannot be empty' }
                ),
                city: z.string().trim().min(1, 'city cannot be empty'),
                address: z.string().optional(),
                storeOwnerName: z.string().trim().min(1, 'shop owner name cannot be empty'),
                phone: z.string().trim().min(10, 'enter a valid phone number').max(10, 'enter a valid phone number').regex(numericRegex, 'enter a valid phone number'),
                whatsapp: z.string().trim().min(10, 'enter a valid whatsapp number').max(10, 'enter a valid whatsapp number').regex(numericRegex, 'enter a valid whatsapp number'),
                email: z.string().optional(),
                subscriptionPlan: z.object(
                    {
                        value: z.string(),
                        label: z.string(),
                    },
                    { message: 'subcription plan cannot be empty' }
                ), //enum set here
                bio: z.string().optional(),
                image: z.array(z.any()).min(1, 'image is required').max(1, 'maximum 1 image only'),
            }),
        []
    );

    type IStoreSchema = z.infer<typeof storeSchema>;

    const defaultValues = useMemo(
        () => ({
            storeName: editDefaultValues?.storeName || '',
            uniqueName: editDefaultValues?.uniqueName || '',
            category: editDefaultValues?.category ? { label: editDefaultValues.category.name, value: editDefaultValues.category._id } : '',
            retail: editDefaultValues?.retail || false,
            wholesale: editDefaultValues?.wholesale || false,
            longitude: editDefaultValues?.location?.coordinates ? editDefaultValues?.location?.coordinates[0] : 0,
            latitude: editDefaultValues?.location?.coordinates ? editDefaultValues?.location?.coordinates[1] : 0,
            district: editDefaultValues?.district ? { label: editDefaultValues?.district, value: editDefaultValues?.district } : '',
            city: editDefaultValues?.city || '',
            address: editDefaultValues?.address || '',
            storeOwnerName: editDefaultValues?.storeOwnerName || '',
            phone: editDefaultValues?.phone || '',
            whatsapp: editDefaultValues?.whatsapp || '',
            email: editDefaultValues?.email || '',
            subscriptionPlan: editDefaultValues?.subscription ? { value: editDefaultValues?.subscription.plan._id, label: editDefaultValues?.subscription.plan.name } : '',
            bio: editDefaultValues?.bio || '',
            image: editDefaultValues?.shopImgUrl ? [editDefaultValues?.shopImgUrl] : [],
        }),
        [editDefaultValues]
    );

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    if (latitude && longitude) {
                        setValue('longitude', longitude);
                        setValue('latitude', latitude);
                        const data = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
                            method: 'get',
                        });
                        const { address } = await data.json();
                        setValue('city', address.county, { shouldValidate: true });
                    }
                },
                (error) => {
                    console.error(error);
                    showAlert('error', 'Error obtaining location');
                }
            );
        } else {
            showAlert('error', 'Geolocation is not supported by this browser');
            console.error('Geolocation is not supported by this browser.');
        }
    };

    const methods = useForm<IStoreSchema>({
        defaultValues: defaultValues as any,
        resolver: zodResolver(storeSchema),
    });

    // const methodsOtp = useForm<IOtpSchema>({
    //     defaultValues: '',
    //     resolver: zodResolver(otpSchema),
    // });

    const {
        handleSubmit,
        formState: { isDirty, isSubmitting, errors },
        watch,
        setValue,
        setError,
        clearErrors,
        control,
        reset,
    } = methods;

    const uniqueNameFieldVal = watch('uniqueName');

    const debouncedSearch = debounce(async (val) => {
        if (editDefaultValues) return true;
        if (URL_REGEX.test(val)) {
            const response: any = await searchUniqueNameExist(val);
            if (!response.data?.isUnique) {
                setError('uniqueName', { message: 'this name is already taken' });
                return false;
            } else {
                clearErrors('uniqueName');
                return true;
            }
        } else {
            if (val) {
                setError('uniqueName', { message: 'only contain lowercase letters, numbers, hyphens, and underscores without spaces' });
                return false;
            } else {
                clearErrors('uniqueName');
                return true;
            }
        }
    }, 300);

    useEffect(() => {
        if (!editDefaultValues) {
            debouncedSearch(uniqueNameFieldVal);
        }
        return () => {
            debouncedSearch.cancel(); // Cancel the debounce when component unmounts
        };
    }, [uniqueNameFieldVal]);

    const onSubmit = handleSubmit(async ({ phone, uniqueName, ...rest }) => {
        try {
            if (!editDefaultValues) {
                const response: any = await checkPhoneAndUniquenameAndSendOtp({ phone, uniqueName });
                //showing error messge if there is conflict in phone number and the unique url
                if (response?.response?.status === 409) {
                    showAlert('error', response?.response?.data?.message);
                } else {
                    setIsSendOtp(true);
                    setStoreData({ phone, uniqueName, ...rest });
                }
            } else {
                setStoreData((prevData) => {
                    const newStoreData = { phone, uniqueName, ...rest };
                    return newStoreData;
                });

                // Give time for state to update, then call handleOtp
                // setStoreData({ phone, uniqueName, ...rest });
                await handleOtp({ payload: { phone, uniqueName, ...rest } });
            }
        } catch (error) {
            showAlert('error', error as any);
        }
    });

    const handleOtp = async ({ otp, payload }: { otp?: string; payload?: IStoreSchema }) => {
        const { image, category, subscriptionPlan, district, ...rest } = !editDefaultValues ? (storeData as IStoreSchema) : payload!;
        try {
            let shopImgUrl = image?.[0];
            const isNewImgUrl = editDefaultValues ? !editDefaultValues?.shopImgUrl?.includes(shopImgUrl) : true;
            if (isNewImgUrl) {
                const { file } = shopImgUrl;
                // Validate image size anhjd type
                const isValid = isValidImage(file);
                if (!isValid) throw new Error('image not matching with criteria');
                // Compress image
                const compressedDataURL = await compressImage(file, 0.6, 1920, 1080);
                const formData = new FormData();
                formData.append('file', compressedDataURL, file.name);

                // Upload the image
                const uploadImageResponse = await uploadImage(formData);
                shopImgUrl = uploadImageResponse?.data?.filename;
            }
            const final = { ...(otp && { otp }), shopImgUrl, category: category.value, district: district.value, subscriptionPlan: subscriptionPlan.value, ...rest };
            if (editDefaultValues) {
                const result = await updateStore({ id: editDefaultValues._id, payload: final });
            } else {
                const result: any = await addStore(final);
                if (result?.response?.status === 403) {
                    return showAlert('error', result?.response?.data?.message);
                }
            }
            queryClient.invalidateQueries({ queryKey: ['store'] });
            showAlert('success', editDefaultValues ? 'Store Updated' : 'Store Created');
            navigate('/staff/stores');
        } catch (error: any) {
            const errorMsg = error?.message ?? 'something error occured';
            showAlert('error', errorMsg);
        }
    };

    const showAlert = async (icon: SweetAlertIcon, title: string) => {
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

    return (
        <div>

            {!isSendOtp ? (
                <FormProvider methods={methods} onSubmit={onSubmit} className="panel">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 py-3 md:py-8">
                        <div className="space-y-8 col-span-full xl:col-span-3">
                            <div className="flex justify-center items-center gap-2 pt-3">
                                <h3 className="text-lg font-semibold w-full max-w-fit">Basic info</h3>
                                <hr className="w-full border-dashed" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <RHFTextField name="storeName" label="Name*" placeholder="Enter Shop Name" />
                                <RHFTextField
                                    name="uniqueName"
                                    label="Unique name*"
                                    helperText="only contain '_', '-', small letter, min 3, max 30"
                                    placeholder="Enter Shop Unique Name"
                                    className="col-span-full"
                                    disabled={!!editDefaultValues}
                                />
                                <div className="col-span-full">
                                    <label htmlFor="">Category*</label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Select
                                                    isDisabled={!!editDefaultValues}
                                                    {...(field as any)}
                                                    classNames={{
                                                        input: () => 'dark:text-white-dark text-[#999]',
                                                        control: () => 'font-semibold',
                                                    }}
                                                    styles={{
                                                        input: (base) => ({
                                                            ...base,
                                                            'input:focus': {
                                                                boxShadow: 'none',
                                                            },
                                                        }),
                                                        control: (base, state) => ({
                                                            ...base,
                                                            height: '24px',
                                                            fontSize: '1rem',
                                                        }),
                                                    }}
                                                    isLoading={isPendingCategories}
                                                    options={(data ?? []).map(({ _id, name }) => ({ value: _id, label: name }))}
                                                    placeholder="Select Category"
                                                />
                                                <span className={`text-xs text-white-dark ${error?.message && '!text-danger'}`}>{error?.message || 'choose a category'}</span>
                                            </>
                                        )}
                                    />
                                </div>
                                <div className="col-span-full">
                                    <div className="custom-select">
                                        <label htmlFor="">Type of Shop</label>
                                        <div className="flex gap-3">
                                            <RHFCheckbox name="retail" label="Retail" />
                                            <RHFCheckbox name="wholesale" label="Wholesale" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-full">
                                    <label htmlFor="">Shop Bio</label>
                                    <Controller
                                        control={control}
                                        name="bio"
                                        render={({ field, fieldState: { error } }) => <textarea {...field} rows={3} wrap="soft" placeholder="About Shop" className="form-textarea resize-none" />}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center items-center gap-2 pt-3">
                                <h3 className="text-lg font-semibold w-full max-w-fit">Location info</h3>
                                <hr className="w-full border-dashed" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="">Geolocation*</label>
                                    <div className="flex h-10">
                                        <RHFTextField
                                            name="longitude"
                                            type="number"
                                            placeholder="Longitude"
                                            className="form-input h-full border ltr:rounded-r-none focus:!border-r flex-1 ltr:border-r-0 rtl:border-l-0"
                                        />
                                        <RHFTextField name="latitude" type="number" placeholder="Latitude" className="form-input rounded-none flex-1 h-full" />
                                        <button
                                            type="button"
                                            onClick={handleCurrentLocation}
                                            className="bg-[#eee] flex justify-center items-center rounded-r-md px-3 whitespace-nowrap font-semibold border h-full  border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]"
                                        >
                                            Get Data
                                        </button>
                                    </div>
                                </div>
                                <RHFTextField name="city" label="City*" placeholder="" className="" />
                                <div className="col-span-full">
                                    <Controller
                                        name="district"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <div>
                                                <label>District*</label>
                                                <Select
                                                    {...(field as any)}
                                                    classNames={{
                                                        input: () => 'dark:text-white-dark text-[#999]',
                                                        control: () => 'font-semibold',
                                                    }}
                                                    styles={{
                                                        input: (base) => ({
                                                            ...base,
                                                            'input:focus': {
                                                                boxShadow: 'none',
                                                            },
                                                        }),
                                                        control: (base, state) => ({
                                                            ...base,
                                                            height: '24px',
                                                            fontSize: '1rem',
                                                        }),
                                                    }}
                                                    options={districts}
                                                    placeholder="Select Category"
                                                />
                                                <span className={`text-xs text-white-dark ${error?.message && '!text-danger'}`}>{error?.message || 'choose a district'}</span>
                                            </div>
                                        )}
                                    />
                                </div>
                                <RHFTextField name="address" label="Address" placeholder="" className="col-span-full" />
                            </div>

                            <div className="flex justify-center items-center gap-2 pt-3">
                                <h3 className="text-lg font-semibold w-full max-w-fit">Contact info</h3>
                                <hr className="w-full border-dashed" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <RHFTextField name="storeOwnerName" label="Owner Name*" placeholder="Enter Owner Name" />
                                <RHFTextField disabled={!!editDefaultValues} name="phone" label="Phone*" placeholder="Enter Owner Phone" />
                                <RHFTextField name="whatsapp" label="Whatsapp no*" helperText="used to take orders from customers" placeholder="Enter Shop Whatsapp" />
                                <RHFTextField name="email" type="email" label="email" placeholder="Enter Shop email" className="col-span-full" />
                                <div className="col-span-full z-10">
                                    <Controller
                                        name="subscriptionPlan"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <div>
                                                <label>Subscription Plan*</label>
                                                <Select
                                                    {...(field as any)}
                                                    classNames={{
                                                        input: () => 'dark:text-white-dark text-[#999] capi',
                                                        control: () => 'font-semibold',
                                                    }}
                                                    styles={{
                                                        input: (base) => ({
                                                            ...base,
                                                            'input:focus': {
                                                                boxShadow: 'none',
                                                            },
                                                        }),
                                                        control: (base, state) => ({
                                                            ...base,
                                                            textTransform: 'capitalize',
                                                            height: '24px',
                                                            fontSize: '1rem',
                                                        }),
                                                        menuList: (base) => ({
                                                            ...base,
                                                            textTransform: 'capitalize',
                                                        }),
                                                    }}
                                                    isLoading={isPendingSubscriptionPlans}
                                                    options={(subscriptionPlans ?? []).map(({ _id, name }: any) => ({ value: _id, label: name }))}
                                                    placeholder="Select Subscription"
                                                />
                                                <span className={`text-xs text-white-dark ${error?.message && '!text-danger'}`}>{error?.message}</span>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-full xl:col-span-2">
                            <div className="custom-file-container" data-upload-id="mySecondImage">
                                <div className="label-container">
                                    <label htmlFor="">Shop Image*</label>
                                </div>
                                <label className="custom-file-container__custom-file"></label>
                                <Controller
                                    name="image"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => {
                                        return (
                                            <ImageUploading
                                                {...field}
                                                maxNumber={1}
                                                maxFileSize={10485760} // 10MB in bytes
                                            >
                                                {({ imageList, onImageUpload, onImageRemove, errors }) => (
                                                    <div className="upload__image-wrapper">
                                                        <button
                                                            className="custom-file-container__custom-file__custom-file-control"
                                                            type="button"
                                                            disabled={field.value.length === 1}
                                                            onClick={onImageUpload}
                                                        >
                                                            Choose Images
                                                        </button>
                                                        {imageList.map((image, index) => (
                                                            <div key={index} className="custom-file-container__image-preview relative">
                                                                <img
                                                                    src={image.dataURL ? (image.dataURL as any) : `${import.meta.env.VITE_APP_S3_STORAGE_BASE_URL}/${image}`}
                                                                    alt="img"
                                                                    className="m-auto"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="custom-file-container__image-clear bg-dark-light dark:bg-dark dark:text-white-dark rounded-full block w-fit p-0.5 absolute top-0 left-0"
                                                                    title="Clear Image"
                                                                    onClick={() => onImageRemove(index)}
                                                                >
                                                                    <IconX className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {field.value.length === 0 ? <img src="/assets/images/file-preview.svg" className="max-w-md w-full m-auto" alt="" /> : ''}
                                                        <span
                                                            className={`text-xs text-white-dark ${
                                                                (errors?.maxFileSize || errors?.acceptType || errors?.maxNumber || error?.message) && '!text-danger'
                                                            }`}
                                                        >
                                                            {errors?.maxFileSize
                                                                ? 'image should be less than 10 MB'
                                                                : errors?.acceptType
                                                                ? 'the choosen file should only be images'
                                                                : errors?.maxNumber
                                                                ? 'maximum 1 image only'
                                                                : error?.message || 'product images should be 1 and image should be less than 10 MB.'}
                                                        </span>
                                                    </div>
                                                )}
                                            </ImageUploading>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex justify-end gap-3 border-t md:border-0 border-[#ebe9f1] py-5 dark:border-white/10">
                            <button
                                type="button"
                                className="btn btn-cancel"
                                onClick={() => {
                                    if (!isSubmitting) {
                                        reset();
                                    }
                                }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button type="submit" disabled={!isDirty || isSubmitting} className="btn btn-success shrink-0">
                                {isSubmitting ? (
                                    <>
                                        <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                        {editDefaultValues ? 'Updating' : 'Creating'}
                                    </>
                                ) : editDefaultValues ? (
                                    'Update'
                                ) : (
                                    'Create'
                                )}
                            </button>
                        </div>
                    </div>
                </FormProvider>
            ) : (
                <OtpInput onSubmitClicks={handleOtp} setIsSendOtp={setIsSendOtp} phone={storeData?.phone || 0} />
            )}
        </div>
    );
}

export default NewEditStoreForm;

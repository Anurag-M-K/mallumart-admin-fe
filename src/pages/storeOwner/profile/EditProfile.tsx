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
import { getCategory } from '../../../api/categoryApi';
import { getSubsciptionPlans } from '../../../api/subscriptionApi';
import { IStore } from '../../../types/store';
import { checkPhoneAndUniquenameAndSendOtp, searchUniqueNameExist } from '../../../api/staffApi';
import { compressImage, imageValidation, isValidImage } from '../../../utils/image-upload';
import { uploadImage } from '../../../api/utilsApi';
import FormProvider from '../../../components/hook-form/form-provider';
import RHFTextField from '../../../components/hook-form/rhf-text-field';
import RHFCheckbox from '../../../components/hook-form/rhf-checkbox';
import { districts } from '../../../constants/store';
import IconX from '../../../components/Icon/IconX';
import IconLoader from '../../../components/Icon/IconLoader';
import OtpInput from '../../../components/otp/otp';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStore, updateStore } from '../../../api/storeApi';
import { setstoreOwnerData } from '../../../store/storeOwnerSlice';

const URL_REGEX = /^[a-z0-9-_]+$/;
const numericRegex = /^\d+$/;

function EditProfile() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [isSendOtp, setIsSendOtp] = useState(false);
    const [storeData, setStoreData] = useState<IStoreSchema>();
    const { storeOwnerToken } = useSelector((state: any) => state.storeOwner);
    const { storeOwnerData } = useSelector((state: any) => state.storeOwner);
    const dispatch = useDispatch();
    const { data, isPending } = useQuery({
        queryKey: ['category'],
        queryFn: () => getCategory({ isActive: true }),
        enabled: !storeOwnerData,
    });

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
                    .regex(URL_REGEX, 'only contain lowercase letters, numbers, hyphens, and underscores'),
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
            storeName: storeOwnerData?.storeName || '',
            uniqueName: storeOwnerData?.uniqueName || '',
            category: storeOwnerData?.category ? { label: storeOwnerData.category.name, value: storeOwnerData.category._id } : '',
            retail: storeOwnerData?.retail || false,
            wholesale: storeOwnerData?.wholesale || false,
            longitude: storeOwnerData?.location?.coordinates ? storeOwnerData?.location?.coordinates[0] : 0,
            latitude: storeOwnerData?.location?.coordinates ? storeOwnerData?.location?.coordinates[1] : 0,
            district: storeOwnerData?.district ? { label: storeOwnerData?.district, value: storeOwnerData?.district } : '',
            city: storeOwnerData?.city || '',
            address: storeOwnerData?.address || '',
            storeOwnerName: storeOwnerData?.storeOwnerName || '',
            phone: storeOwnerData?.phone || '',
            whatsapp: storeOwnerData?.whatsapp || '',
            email: storeOwnerData?.email || '',
            subscriptionPlan: storeOwnerData?.subscription ? { value: storeOwnerData?.subscription.plan._id, label: storeOwnerData?.subscription.plan.name } : '',
            bio: storeOwnerData?.bio || '',
            image: storeOwnerData?.shopImgUrl ? [storeOwnerData?.shopImgUrl] : [],
        }),
        [storeOwnerData]
    );

    const methods = useForm<IStoreSchema>({
        defaultValues: defaultValues as any,
        resolver: zodResolver(storeSchema),
    });

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

    const onSubmit = handleSubmit(async (values: any) => {
        const { image, storeName, retail, wholesale, bio, storeOwnerName, email } = values;
        let shopImgUrl = image?.[0];

        if (image[0] !== storeOwnerData?.shopImgUrl) {
            const { file } = shopImgUrl;
            const isValid: any = imageValidation(file);
            if (!isValid?.status) {
                showAlert('error', isValid?.message);
                throw new Error('image not matching with criteria');
            }

            const compressedDataURL = await compressImage(file, 0.6, 1920, 1080);
            const formData = new FormData();
            formData.append('file', compressedDataURL, file.name);

            const uploadImageResponse = await uploadImage(formData);
            shopImgUrl = uploadImageResponse?.data?.filename;
        }

        const updatedField: any = {};

        if (shopImgUrl) updatedField.shopImgUrl = shopImgUrl;
        if (storeName !== storeOwnerData?.storeName) updatedField.storeName = storeName;
        if (retail !== storeOwnerData?.retail) updatedField.retail = retail;
        if (wholesale !== storeOwnerData?.Wholesale) updatedField.wholesale = wholesale;
        if (bio !== storeOwnerData?.bio) updatedField.bio = bio;
        if (storeOwnerName !== storeOwnerData?.storeName) updatedField.storeOwnerName = storeOwnerName;
        if (email !== storeOwnerData?.email) updatedField.email = email;

        const result: any = await updateStore(storeOwnerToken, updatedField);
        console.log('Result ', result);
        if (result?.status === 200) {
            showAlert('success', 'Shop updated successfully');
            navigate('/store');
        } else {
            showAlert('error', 'Somethnig went wrong');
        }
    });

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

    console.log('errors ', errors);
    return (
        <div>
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
                                // helperText="only contain '_', '-', small letter, min 3, max 30"
                                placeholder="Enter Shop Unique Name"
                                className="col-span-full"
                                disabled
                            />
                            <div className="col-span-full">
                                <label htmlFor="">Category*</label>

                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <Select
                                                isDisabled={!!storeOwnerData}
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
                                                // isLoading={isPendingCategories}
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
                                        disabled
                                        placeholder="Longitude"
                                        className="form-input h-full border ltr:rounded-r-none focus:!border-r flex-1 ltr:border-r-0 rtl:border-l-0"
                                    />
                                    <RHFTextField disabled name="latitude" type="number" placeholder="Latitude" className="form-input rounded-none flex-1 h-full" />
                                </div>
                            </div>
                            <RHFTextField name="city" disabled label="City*" placeholder="" className="" />
                            <div className="col-span-full">
                                <Controller
                                    name="district"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <div>
                                            <label>District*</label>
                                            <Select
                                                isDisabled
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
                            <RHFTextField name="address" disabled label="Address" placeholder="" className="col-span-full" />
                        </div>

                        <div className="flex justify-center items-center gap-2 pt-3">
                            <h3 className="text-lg font-semibold w-full max-w-fit">Contact info</h3>
                            <hr className="w-full border-dashed" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <RHFTextField name="storeOwnerName" label="Owner Name*" placeholder="Enter Owner Name" />
                            <RHFTextField disabled name="phone" label="Phone*" placeholder="Enter Owner Phone" />
                            <RHFTextField disabled name="whatsapp" label="Whatsapp no*" helperText="used to take orders from customers" placeholder="Enter Shop Whatsapp" />
                            <RHFTextField name="email" type="email" label="email" placeholder="Enter Shop email" className="col-span-full" />
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
                                                    <span className={`text-xs text-white-dark ${(errors?.maxFileSize || errors?.acceptType || errors?.maxNumber || error?.message) && '!text-danger'}`}>
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
                                    Updating
                                </>
                            ) : (
                                'Update'
                            )}
                        </button>
                    </div>
                </div>
            </FormProvider>
        </div>
    );
}

export default EditProfile;

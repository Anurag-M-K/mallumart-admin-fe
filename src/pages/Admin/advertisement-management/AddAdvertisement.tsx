import * as z from 'zod';
import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ImageUploading from 'react-images-uploading';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import axios from 'axios';

import { setPageTitle } from '../../../store/themeConfigSlice';
import { compressImage, isValidImage } from '../../../utils/util-functions';
import { addProduct, updateProduct } from '../../../api/product.api';
import { getSubCategoriesForProduct } from '../../../api/categoryApi';

import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';
import IconX from '../../../components/Icon/IconX';
import RHFTextField from '../../../components/hook-form/rhf-text-field';
import FormProvider from '../../../components/hook-form/form-provider';
import RHFSwitch from '../../../components/hook-form/rhf-switch';
import IconLoader from '../../../components/Icon/IconLoader';
import { addAdvertisement, fetchAllAdvertisement } from '../../../api/adminApi';
import { setAdvertisementDetails } from '../../../store/advertisementSlice';

function AddAdvertisement({ handleCancel, id, editDefaultValues }: { handleCancel: () => void; id: string; editDefaultValues: any }) {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const adminDetails = useSelector((state: any) => state.admin.adminDetails);
    useEffect(() => {
        dispatch(setPageTitle('New Product'));
    }, [dispatch]);

    const { data, isPending, error } = useQuery({
        queryKey: ['category', 'subcategory'],
        queryFn: () => getSubCategoriesForProduct(id),
    });

    const advertisementSchema = useMemo(
        () =>
            z.object({
                image: z.array(z.any()).min(1, 'Minimum 1 image is required').max(3, 'Maximum 3 images only'),
                isMainAdvertisementShow: z.boolean(),
                isSecondAdvertisementShow: z.boolean(),
            }),
        [data]
    );

    type TAdvertisementSchema = z.infer<typeof advertisementSchema>;

    const methods = useForm<TAdvertisementSchema>({
        resolver: zodResolver(advertisementSchema),
        defaultValues: editDefaultValues || {
            image: [],
            isMainAdvertisementShow: false,
            isSecondAdvertisementShow: false,
        },
    });

    const {
        handleSubmit,
        formState: { isDirty, isSubmitting },
        control,
        reset,
    } = methods;

    const onSubmit = handleSubmit(async (values: any) => {
        try {
            const data = new FormData();
            values.image.forEach((img: any) => {
                data.append('file', img.file);
            });
            data.append('upload_preset', import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET);
            data.append('cloud_name', import.meta.env.VITE_CLOUDINARY_UPLOAD_NAME);

            const res = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_UPLOAD_NAME}/image/upload`, data);
            const url = res.data.secure_url;
            values.image = url;

            console.log(values);
            const payload = {
                values,
            };

            const response: any = await addAdvertisement(adminDetails?.token, values);
            const advertisementData:any = await fetchAllAdvertisement(adminDetails.token)
            dispatch(setAdvertisementDetails(advertisementData))
            console.log('responsed ', response);
            if (response.status === 201) {
                showAlert('success', response?.data?.message);
            }

            queryClient.invalidateQueries({ queryKey: ['products', id] });
            handleCancel();
        } catch (error: any) {
            console.error('Error:', error);
            showAlert('error', error?.message ?? 'Something went wrong');
        }
    });

    const showAlert = (icon: SweetAlertIcon, title: string) => {
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
            <FormProvider methods={methods} onSubmit={onSubmit} className="panel">
                <div className="gap-8 py-3 md:py-8">
                    <div>
                        <div className="custom-file-container" data-upload-id="mySecondImage">
                            <div className="label-container">
                                <label htmlFor="image">Advertisement Image*</label>
                            </div>
                            <Controller
                                name="image"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <ImageUploading
                                        value={field.value}
                                        onChange={field.onChange}
                                        maxNumber={3}
                                        maxFileSize={10485760} // 10MB in bytes
                                    >
                                        {({ imageList, onImageUpload, onImageRemove, errors }) => (
                                            <div className="upload__image-wrapper">
                                                <button type="button" className="custom-file-container__custom-file__custom-file-control" onClick={onImageUpload} disabled={field.value.length === 3}>
                                                    Choose Image
                                                </button>
                                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                                                    {imageList.map((image, index) => (
                                                        <div key={index} className="custom-file-container__image-preview relative">
                                                            <button
                                                                type="button"
                                                                className="custom-file-container__image-clear bg-dark-light dark:bg-dark dark:text-white-dark rounded-full block w-fit p-0.5 absolute top-0 left-0"
                                                                title="Clear Image"
                                                                onClick={() => onImageRemove(index)}
                                                            >
                                                                <IconX className="w-3 h-3" />
                                                            </button>
                                                            <img src={image.dataURL ?? (image as any)} alt="img" className="object-cover shadow rounded w-full !max-h-48" />
                                                        </div>
                                                    ))}
                                                </div>
                                                {field.value.length === 0 && <img src="/assets/images/file-preview.svg" className="max-w-md w-full m-auto" alt="preview" />}
                                                <span className={`text-xs text-white-dark ${(errors?.maxFileSize || errors?.acceptType || errors?.maxNumber || error?.message) && '!text-danger'}`}>
                                                    {errors?.maxFileSize
                                                        ? 'Image should be less than 10 MB'
                                                        : errors?.acceptType
                                                        ? 'The chosen file should only be images'
                                                        : errors?.maxNumber
                                                        ? 'Maximum 3 images'
                                                        : error?.message ||
                                                          'Product images should be a minimum of 1 and a maximum of 3, each image should be less than 10 MB, preferred square images.'}
                                                </span>
                                            </div>
                                        )}
                                    </ImageUploading>
                                )}
                            />
                        </div>
                    </div>
                    <div className="my-12 grid grid-cols-2">
                        <RHFSwitch name="isMainAdvertisementShow" label="Activate to show image on main carousel" className="peer-checked:bg-success" />
                        <RHFSwitch name="isSecondAdvertisementShow" label="Activate to show image on second carousel" className="peer-checked:bg-success" />
                    </div>
                    <div className="w-full">
                        <div className="flex justify-end gap-3 border-t md:border-0 border-[#ebe9f1] py-5 dark:border-white/10">
                            <button
                                type="button"
                                className="btn btn-cancel"
                                onClick={() => {
                                    if (!isSubmitting) {
                                        reset();
                                        handleCancel();
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
                </div>
            </FormProvider>
        </div>
    );
}

export default AddAdvertisement;

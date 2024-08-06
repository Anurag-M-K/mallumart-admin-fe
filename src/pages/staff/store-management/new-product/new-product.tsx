import * as z from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ImageUploading from 'react-images-uploading';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CreatableSelect from 'react-select/creatable';
import Swal, { SweetAlertIcon } from 'sweetalert2';

import { setPageTitle } from '../../../../store/themeConfigSlice';

import { IProduct } from '../../../../types/product';

import { addProduct, updateProduct } from '../../../../api/product.api';
import { getSubCategoriesForProduct } from '../../../../api/categoryApi';

import IconX from '../../../../components/Icon/IconX';
import RHFTextField from '../../../../components/hook-form/rhf-text-field';
import FormProvider from '../../../../components/hook-form/form-provider';
import RHFSwitch from '../../../../components/hook-form/rhf-switch';
import IconLoader from '../../../../components/Icon/IconLoader';

import { handleMultipleImage } from '../../../../utils/image-upload';

function NewProduct({ handleCancel, id, editDefaultValues }: { handleCancel: () => void; id: string; editDefaultValues: any }) {
    const queryClient = useQueryClient();

    const store: any = useSelector((state: any) => state.storeOwner);
    const [maxProductImage, setMaxProductImage] = useState(store?.storeOwnerData?.subscription?.plan?.maxProductImages ?? 4);

    useEffect(() => {
        setMaxProductImage(store?.storeOwnerData?.subscription?.plan?.maxProductImages ?? 4);
    }, [store?.storeOwnerData?.subscription?.plan?.maxProductImages]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('New Product'));
    });

    const { data, isPending } = useQuery({
        queryKey: ['category', 'subcategory'],
        queryFn: () => getSubCategoriesForProduct(id),
    });

    const productSchema = useMemo(
        () =>
            z
                .object({
                    name: z.string().trim().min(1, 'product name cannot be empty'),
                    category: z.object(
                        {
                            value: z.string(),
                            label: z.string(),
                            __isNew__: z.boolean().optional(),
                        },
                        { message: 'category cannot be empty' }
                    ),
                    price: z.number().gte(0, { message: 'price cannot be a negative value' }),
                    offerPrice: z.optional(z.number()),
                    description: z.string().optional(),
                    images: z.array(z.any()).min(1, 'minimum 1 image is required').max(maxProductImage, `maximum ${maxProductImage} images only`),
                    isActive: z.boolean(),
                })
                .superRefine((data, ctx) => {
                    if (data.offerPrice && data.offerPrice >= data?.price) {
                        ctx.addIssue({
                            type: 'number',
                            code: 'too_big',
                            maximum: data.price ?? 0 - 1,
                            inclusive: false,
                            path: ['offerPrice'],
                            message: 'The offer price should be less than the actual price.',
                        });
                    }
                }),
        [data, maxProductImage]
    );

    type IProductSchema = z.infer<typeof productSchema>;

    const defaultValues = useMemo(
        () => ({
            name: '',
            category: '' as any,
            price: 0,
            offerPrice: 0,
            description: '',
            images: [],
            isActive: false,
        }),
        []
    );

    useEffect(() => {
        if (editDefaultValues) {
            reset({ ...editDefaultValues, category: { label: editDefaultValues.category.name, value: editDefaultValues.category._id } });
        }
    }, [editDefaultValues]);

    const methods = useForm<IProductSchema>({
        defaultValues,
        resolver: zodResolver(productSchema),
    });

    const {
        handleSubmit,
        formState: { isDirty, isSubmitting },
        control,
        reset,
    } = methods;

    const onSubmit = handleSubmit(async ({ images, category, ...rest }) => {
        try {
            const imageUrls = await handleMultipleImage(images, editDefaultValues);

            const isNewCategory = category.__isNew__ ?? false;
            const categoryVal = category.value;

            const final: IProduct = { images: imageUrls, category: categoryVal, isPending: isNewCategory, ...rest };

            if (editDefaultValues) {
                await updateProduct({ id, productId: editDefaultValues._id, payload: final });
            } else {
                await addProduct({ id, payload: final });
            }
            queryClient.invalidateQueries({ queryKey: ['products', id] });
            handleCancel();
        } catch (error: any) {
            const errorMsg = error?.message ?? 'something error occured';
            showAlert('error', errorMsg);
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

    return (
        <div>
            {/* <Breadcrumbs heading="Product" links={[{ name: 'Dashboard', href: '/staff' }, { name: 'Stores', href: '/staff/stores' }, { name: 'Add a New Product' }]} /> */}

            <FormProvider methods={methods} onSubmit={onSubmit} className="panel">
                <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8 py-3 md:py-8">
                    <div className="space-y-8">
                        <RHFTextField name="name" label="Product name*" placeholder="Enter Product Name" className="form-input-lg" />
                        <div>
                            <div className="space-y-4 custom-select">
                                <div>
                                    <label htmlFor="">Category*</label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <CreatableSelect
                                                    {...(field as any)}
                                                    classNames={{
                                                        input: () => 'dark:text-white-dark placeholder:text-blue-500 text-[#999]',
                                                        control: () => 'font-semibold  placeholder:text-blue-500',
                                                    }}
                                                    styles={{
                                                        input: (base) => ({
                                                            ...base,
                                                            //  color: '#999',
                                                            'input:focus': {
                                                                boxShadow: 'none',
                                                            },
                                                        }),
                                                        control: (base, state) => ({
                                                            ...base,
                                                            height: '44px',
                                                            'min-height': '44px',
                                                            padding: '0 8px',
                                                            fontSize: '1rem',
                                                        }),
                                                        menu: (base) => ({
                                                            ...base,
                                                            zIndex: 100, // Ensure menu is on top
                                                        }),
                                                        option: (base, state) => ({
                                                            ...base,
                                                            backgroundColor: state.isFocused || state.isSelected ? '#3b82f6' : base.backgroundColor,
                                                            color: state.isFocused || state.isSelected ? '#ffffff' : base.color,
                                                            cursor: 'pointer',
                                                        }),
                                                    }}
                                                    isLoading={isPending}
                                                    options={(data ?? []).map(({ _id, name }) => ({ value: _id, label: name }))}
                                                    placeholder="Select Category or Type New Category"
                                                    formatCreateLabel={(userInput) => `Request '${userInput}'`}
                                                />
                                                <span className={`text-xs  text-white-dark  ${error?.message && '!text-danger'}`}>
                                                    {error?.message || 'choose a category. not have appropriate category ? no issues, request new!'}
                                                </span>
                                            </>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <label htmlFor="">Price</label>
                            <div className="flex flex-col sm:flex-row gap-8">
                                <div className="flex flex-1 max-h-[38px]">
                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        &#x20B9;
                                    </div>
                                    <RHFTextField name="price" type="number" placeholder="Actual Price" className="form-input rounded-none" />
                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        .00
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col">
                                    <div className="flex max-h-[38px]">
                                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            &#x20B9;
                                        </div>
                                        <RHFTextField name="offerPrice" type="number" placeholder="Offer Price" className="form-input rounded-none" />
                                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            .00
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="">Product Descirption</label>
                            <Controller
                                control={control}
                                name="description"
                                render={({ field, fieldState: { error } }) => <textarea {...field} rows={3} wrap="soft" placeholder="Add Product Description" className="form-textarea resize-none" />}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="custom-file-container" data-upload-id="mySecondImage">
                            <div className="label-container">
                                <label htmlFor="">Product Images*</label>
                            </div>
                            <label className="custom-file-container__custom-file"></label>
                            <Controller
                                name="images"
                                control={control}
                                render={({ field, fieldState: { error } }) => {
                                    return (
                                        <ImageUploading
                                            multiple
                                            {...field}
                                            maxNumber={maxProductImage}
                                            maxFileSize={10485760} // 10MB in bytes
                                        >
                                            {({ imageList, onImageUpload, onImageRemove, errors }) => (
                                                <div className="upload__image-wrapper">
                                                    <button
                                                        className="custom-file-container__custom-file__custom-file-control"
                                                        type="button"
                                                        disabled={field.value.length === maxProductImage}
                                                        onClick={onImageUpload}
                                                    >
                                                        Choose Images
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
                                                                <img src={image.dataURL ? (image.dataURL as any) : `${import.meta.env.VITE_APP_S3_STORAGE_BASE_URL}/${image}`} alt="img" className="object-cover shadow rounded w-full !max-h-48" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {field.value.length === 0 ? <img src="/assets/images/file-preview.svg" className="max-w-md w-full m-auto" alt="" /> : ''}
                                                    <span className={`text-xs text-white-dark ${(errors?.maxFileSize || errors?.acceptType || errors?.maxNumber || error?.message) && '!text-danger'}`}>
                                                        {errors?.maxFileSize
                                                            ? 'image should be less than 10 MB'
                                                            : errors?.acceptType
                                                            ? 'the choosen file should only be images'
                                                            : errors?.maxNumber
                                                            ? `maximum ${maxProductImage} images`
                                                            : error?.message ||
                                                              `Product images should ${
                                                                  maxProductImage === 1 ? 'be one image and it' : 'be at least 1 image and at most ' + maxProductImage + ' images. Each image'
                                                              } should be less than 10 MB.`}
                                                    </span>
                                                </div>
                                            )}
                                        </ImageUploading>
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <RHFSwitch name="isActive" label="Publish" className="peer-checked:bg-success" />
                    </div>
                    <div className="w-full">
                        <div className=" flex justify-end gap-3 border-t md:border-0 border-[#ebe9f1] py-5 dark:border-white/10">
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

export default NewProduct;

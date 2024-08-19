import * as z from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ImageUploading from 'react-images-uploading';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CreatableSelect from 'react-select/creatable';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { getSubCategoriesForProduct } from '../../../api/categoryApi';
import { compressImage, handleMultipleImage, isValidImage } from '../../../utils/image-upload';
import { IProduct } from '../../../types/product';
import { addProduct, updateProduct } from '../../../api/product.api';
import FormProvider from '../../../components/hook-form/form-provider';
import RHFTextField from '../../../components/hook-form/rhf-text-field';
import IconX from '../../../components/Icon/IconX';
import IconLoader from '../../../components/Icon/IconLoader';
import { addDoctor, fetchSpecialisations } from '../../../api/storeApi';
import { uploadImage } from '../../../api/utilsApi';
import { showAlert } from '../../../utils/util-functions';

const offDays = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednsday', value: 'wednsday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'sunday', value: 'sunday' },
];

function AddDoctor({ token, handleCancel, id, editDefaultValues ,refetch}: { token: string; handleCancel: any; id: string; editDefaultValues: any ,refetch:any}) {
    const queryClient = useQueryClient();

    // const store: any = useSelector((state: any) => state.storeOwner);

    const { data, isPending, error } = useQuery({
        queryKey: ['specialisation'],
        queryFn: () => fetchSpecialisations(token),
    });


    const doctorSchema = useMemo(
        () =>
            z
                .object({
                    name: z.string().trim().min(1, 'product name cannot be empty'),
                    offDays: z.array(z.string()).optional(),
                    specialisation: z.object(
                        {
                            value: z.string(),
                            label: z.string(),
                            __isNew__: z.boolean().optional(),
                        },
                        { message: 'Specialisation cannot be empty' }
                    ),
                    startingTime: z.string().trim().min(1, 'Time Required'),
                    endingTime: z.string().trim().min(1, 'Time Required'),
                    noOfToken: z.string().trim().min(1, 'Total token required'),
                    image: z.array(z.any()).min(1, 'image is required').max(1, 'maximum 1 image only'),
                })
                .superRefine((data, ctx) => {}),
        [data]
    );

    type IdoctorSchema = z.infer<typeof doctorSchema>;

    const defaultValues = useMemo(
        () => ({
            name: '',
            specialisation: { value: '', label: '' },
            startingTime: '',
            endingTime: '',
            image: [] as any[],
            noOfToken: '',
            offDays: [],
        }),
        []
    );

    const methods = useForm<IdoctorSchema>({
        defaultValues,
        resolver: zodResolver(doctorSchema),
    });

    const {
        handleSubmit,
        formState: { isDirty, isSubmitting, errors },
        control,
        reset,
    } = methods;


    const onSubmit = handleSubmit(async ({ image, specialisation, startingTime, endingTime, ...rest }) => {
    

        let doctorImageUrl = image?.[0];

        const { file } = doctorImageUrl;

        const isValid = isValidImage(file);
        if (!isValid) throw new Error('Image not matching with criteria');
        const compressedDataURL = await compressImage(file, 0.6, 1920, 1080);
        const formData = new FormData();
        formData.append('file', compressedDataURL, file.name);

        //upload image
        const uploadImageResponse = await uploadImage(formData);
        doctorImageUrl = uploadImageResponse?.data?.filename;
        // const imageUrls = await handleMultipleImage(image, editDefaultValues);

        const isNewSpecialisation = specialisation.__isNew__ ?? false;
        const specialisationValue = specialisation.value;

        const final: TDoctor = {
            image: doctorImageUrl,
            specialisation: specialisationValue,
            isNewSpecialisation: isNewSpecialisation,
            startingTime: String(startingTime),
            endingTime: String(endingTime),
            ...rest,
        };

        if (editDefaultValues.length > 0) {
            // await updateProduct({ id, productId: editDefaultValues._id, payload: final });
        } else {
            const res:any = await addDoctor(token, final);
            console.log("Res ",res)
            if(res.success){
                showAlert("success",res.message)
                refetch()
                handleCancel(false)
            }else{
                showAlert("error","Something went wrong , please try again later.")
            }
        }
    });

    console.log('Data ', data);
    return (
        <div>
            <FormProvider methods={methods} onSubmit={onSubmit} className="panel">
                <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8 py-3 md:py-8">
                    <div className="space-y-8">
                        <RHFTextField name="name" label="Dr. Name*" placeholder="Enter Doctor Name" className="form-input-lg" />
                        <div>
                            <div className="space-y-4 custom-select">
                                <div>
                                    <label htmlFor="">Specialisation*</label>
                                    <Controller
                                        name="specialisation"
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
                                                            //  coor: '#999',
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
                                                    options={(data ?? []).map(({ _id, name }: { _id: any; name: any }) => ({ value: _id, label: name }))}
                                                    placeholder="Select specialisation or Type New specialisation"
                                                    formatCreateLabel={(userInput) => `Request '${userInput}'`}
                                                />
                                                <span className={`text-xs  text-white-dark  ${error?.message && '!text-danger'}`}>
                                                    {error?.message || 'choose a specialisation. not have appropriate specialisation ? no issues, add new!'}
                                                </span>
                                            </>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="space-y-4 custom-select">
                                <div>
                                    <label htmlFor="">Off Days*</label>
                                    <Controller
                                        name="offDays"
                                        control={control}
                                        render={({ field }: { field: any }) => (
                                            <div className="grid sm:grid-cols-3 gap-2">
                                                {offDays.map((day: any) => (
                                                    <div key={day.value}>
                                                        <label>
                                                            <input
                                                                className="mx-2"
                                                                type="checkbox"
                                                                value={day.value}
                                                                checked={field.value.includes(day.value)}
                                                                onChange={(e) => {
                                                                    const checked = e.target.checked;
                                                                    if (checked) {
                                                                        field.onChange([...field.value, day.value]);
                                                                    } else {
                                                                        field.onChange(field.value.filter((d: any) => d !== day.value));
                                                                    }
                                                                }}
                                                            />
                                                            {day.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <RHFTextField name="startingTime" label="From Time*" type="time" className=" my-2 form-input-lg" />
                            <RHFTextField name="endingTime" label="To Time*" type="time" className="form-input-lg" />
                            <div className="my-4">
                                <RHFTextField name="noOfToken" label="Total No. of tokens per day*" type="text" className="form-input-lg " />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="custom-file-container" data-upload-id="mySecondImage">
                            <div className="label-container">
                                <label htmlFor="">Doctor Images*</label>
                            </div>
                            <label className="custom-file-container__custom-file"></label>
                            <Controller
                                name="image"
                                control={control}
                                render={({ field, fieldState: { error } }) => {
                                    return (
                                        <ImageUploading
                                            // multiple
                                            {...field}
                                            maxNumber={1}
                                            maxFileSize={10485760} // 10MB in bytes
                                        >
                                            {({ imageList, onImageUpload, onImageRemove, errors }) => (
                                                <div className="upload__image-wrapper">
                                                    <button
                                                        className="custom-file-container__custom-file__custom-file-control"
                                                        type="button"
                                                        // disabled={field.value.length === maxProductImage}
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
                                                                <img
                                                                    src={image.dataURL ? (image.dataURL as any) : `${import.meta.env.VITE_APP_S3_STORAGE_BASE_URL}/${image}`}
                                                                    alt="img"
                                                                    className="object-cover shadow rounded w-full !max-h-48"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {field?.value?.length === 0 ? <img src="/assets/images/file-preview.svg" className="max-w-md w-full m-auto" alt="" /> : ''}
                                                    <span className={`text-xs text-white-dark ${(errors?.maxFileSize || errors?.acceptType || errors?.maxNumber || error?.message) && '!text-danger'}`}>
                                                        {errors?.maxFileSize ? 'image should be less than 10 MB' : errors?.acceptType ? 'the choosen file should only be images' : errors?.maxNumber}
                                                    </span>
                                                </div>
                                            )}
                                        </ImageUploading>
                                    );
                                }}
                            />
                        </div>
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
                                        {editDefaultValues.length > 0 ? 'Updating' : 'Creating'}
                                    </>
                                ) : editDefaultValues.length > 0 ? (
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

export default AddDoctor;

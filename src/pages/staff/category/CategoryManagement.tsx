import React, { useState, Fragment, useEffect, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import * as z from 'zod';
import Swal, { SweetAlertIcon } from 'sweetalert2';

import { setPageTitle } from '../../../store/themeConfigSlice';

import IconX from '../../../components/Icon/IconX';
import IconPlus from '../../../components/Icon/IconPlus';
import IconCaretDown from '../../../components/Icon/IconCaretDown';
import IconEdit from '../../../components/Icon/IconEdit';
import IconLoader from '../../../components/Icon/IconLoader';
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';
import DynamicIconPicker from '../../../components/DynamicIconPicker';

import { addCategory, editCategory, getCategory } from '../../../api/staffApi';

function CategoryManagement() {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const staffData = useSelector((state: any) => state.staff);

    // Fetching category data
    const { isPending, error, data } = useQuery({
        queryKey: ['category'],
        queryFn: () => getCategory(staffData?.staffToken),
    });

    useEffect(() => {
        dispatch(setPageTitle('Category'));
    }, [dispatch]);

    // Component State
    const [editCategoryId, setEditCategoryId] = useState('');
    const [modal, setModal] = useState(false);
    const [subcategoryView, setSubcategoryView] = useState<string[]>([]);

    const defaultValues = useMemo(
        () => ({
            name: '',
            parentId: '',
            isActive: false,
            icon:''
        }),
        []
    );

    const categorySchema = useMemo(
        () =>
            z
                .object({
                    name: z.string().trim().min(1, 'Category name field cannot be empty'),
                    parentId: z
                        .string()
                        .optional()
                        .refine(
                            (val) => {
                                if (!val) return true;
                                if (!data?.length) return false;
                                const isMatched = data.some((data) => data._id === val);
                                if (isMatched) return true;
                                else return false;
                            },
                            { message: 'Invalid parent category' }
                        ),
                    icon: z.string(),
                    isActive: z.boolean(),
                })
                .refine(
                    (val) => {
                        if (!val.parentId && !val.icon) {
                            return false;
                        }
                        return true;
                    },
                    {
                        message: "Icon shouldn't be empty for Main category",
                        path: ['icon'],
                    }
                ),
        [data]
    );

    type ICategorySchema = z.infer<typeof categorySchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<ICategorySchema>({
        defaultValues,
        resolver: zodResolver(categorySchema),
    });

    const [watchParent, watchIcon] = watch(['parentId', 'icon']);

    useEffect(() => {
        if (watchParent) {
            setValue('icon', '');
        }
    }, [watchParent]);

    const {
        mutateAsync,
        isError,
        isPending: isSubmittingForm,
    } = useMutation({
        mutationFn: (newTodo: ICategorySchema) => {
            if (editCategoryId) {
                return editCategory(editCategoryId, newTodo, staffData?.staffToken);
            } else {
                return addCategory(newTodo, staffData?.staffToken);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category'] });
            showAlert('success', editCategoryId ? 'updated success' : 'created success');
            setEditCategoryId('');
            setModal(false);
            reset();
        },
        onError: (data: any) => {
            const errorMsg = data?.response?.data ?? data.message;
            showAlert('error', errorMsg ?? 'Something went wrong!. Please check again');
        },
    });

    const handleSelectIcon = (val: string) => {
        if (!val) return;
        setValue('icon', val, { shouldValidate: true });
    };887892


    const onSubmit: SubmitHandler<ICategorySchema> = async (data: ICategorySchema) => {
        if (!data.parentId) delete data.parentId;
        await mutateAsync(data);
    };

    const toggleSubcategory = (name: any) => {
        setSubcategoryView((prev) => (prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]));
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

    const toggleStatus = async (message: string, confirmButtonText: string, id: string, field: any) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: message,
            showCancelButton: true,
            confirmButtonText,
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then(async (result) => {
            if (result.value) {
                setEditCategoryId(id);
                await mutateAsync(field);
                if (isError) {
                    showAlert('error', 'status update fail');
                } else {
                    showAlert('success', 'status updated');
                }
            }
        });
    };

    return (
        <>
            {/* BREADCRUMBS PART */}
            <Breadcrumbs
                heading="Category"
                links={[{ name: 'Dashboard', href: '/admin' }, { name: 'Category' }]}
                action={
                    <>
                        <button type="button" onClick={() => setModal(true)} className="btn btn-primary">
                            <IconPlus className="w-5 h-5 ltr:mr-1.5 rtl:ml-1.5 shrink-0" />
                            Add Category
                        </button>
                        <Transition appear show={modal} as={Fragment}>
                            <Dialog
                                as="div"
                                open={modal}
                                onClose={() => {
                                    setEditCategoryId('');
                                    setModal(false);
                                    reset();
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
                                <div id="login_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                                    <div className="flex min-h-screen items-center justify-center px-4">
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
                                                <div className="flex items-center justify-between m-5 text-lg font-semibold dark:text-white">
                                                <h5 className="font-bold">{editCategoryId ? 'Update' : 'New' } Category</h5>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setModal(false);
                                                            setEditCategoryId('');
                                                            reset();
                                                        }}
                                                        className="text-white-dark hover:text-dark"
                                                    >
                                                        <IconX className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="m-5">
                                                    <div className="">
                                                        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                                                            <div>
                                                                <label htmlFor="disInput" className="text-sm font-bold">
                                                                    Category
                                                                </label>
                                                                <input
                                                                    id="disInput"
                                                                    type="text"
                                                                    placeholder="Enter Category Name"
                                                                    className="form-input disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]"
                                                                    aria-invalid={errors.name ? 'true' : 'false'}
                                                                    {...register('name')}
                                                                />
                                                                {errors.name && <span className="text-danger text-xs">{errors.name.message}</span>}
                                                            </div>

                                                            <div>
                                                                <label htmlFor="disSelect" className="text-sm font-bold">
                                                                    Parent Category
                                                                </label>
                                                                <div className="flex">
                                                                    {isPending ? (
                                                                        <>
                                                                            <input
                                                                                id="spiRight"
                                                                                type="text"
                                                                                placeholder="Loading"
                                                                                disabled
                                                                                className="form-input ltr:rounded-r-none rtl:rounded-l-none border-r-0"
                                                                            />
                                                                            <div className="flex justify-center items-center border border-white-light bg-white border-l-0 ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold dark:border-[#17263c] dark:bg-[#121e32]">
                                                                                <IconLoader className="text-white-dark animate-spin" />
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <select
                                                                                id="disSelect"
                                                                                disabled={editCategoryId.length > 0}
                                                                                {...register('parentId')}
                                                                                className={`form-select !appearance-none disabled:pointer-events-none ${
                                                                                    !watchParent && 'rgb(14 23 38 / var(--tw-text-opacity))'
                                                                                } disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] appearance-none empty:text-white`}
                                                                            >
                                                                                <option className="" value="">
                                                                                    None
                                                                                </option>
                                                                                {data?.map((category) => (
                                                                                    <option key={category._id} value={category._id} className="text-dark">
                                                                                        {category.name}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        </>
                                                                    )}
                                                                </div>
                                                                <span className={`text-xs ${errors.parentId ? 'text-danger' : 'text-white-dark '}`}>
                                                                    {errors.parentId ? errors.parentId?.message : 'If this category is a subcategory, select its parent category'}
                                                                </span>
                                                            </div>

                                                            <DynamicIconPicker onIconSelect={handleSelectIcon} disabled={Boolean(watchParent)} selectedIcon={watchIcon} />
                                                            {errors.icon && <span className="text-danger text-xs">{errors.icon.message}</span>}

                                                            <div>
                                                                <label className="flex w-fit items-center gap-2">
                                                                    <div className="w-9 h-5 relative shrink-0">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                                            id="custom_switch_checkbox1"
                                                                            {...register('isActive')}
                                                                        />
                                                                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-3 before:h-3 before:rounded-full peer-checked:before:left-5 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                                        {errors.isActive && <span>{errors.isActive.message}</span>}
                                                                    </div>
                                                                    <span className="font-light">Active</span>
                                                                </label>
                                                            </div>
                                                            <div className=" flex justify-end gap-3 border-t border-[#ebe9f1] py-5 dark:border-white/10">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-cancel"
                                                                    onClick={() => {
                                                                        if (!isSubmittingForm) {
                                                                            setEditCategoryId('');
                                                                            setModal(false);
                                                                            reset();
                                                                        }
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button type="submit" disabled={isSubmittingForm} className="btn btn-success shrink-0">
                                                                    {isSubmittingForm ? (
                                                                        <>
                                                                            <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                            {editCategoryId ? 'Updating' : 'Creating'}
                                                                        </>
                                                                    ) : editCategoryId ? (
                                                                        'Update'
                                                                    ) : (
                                                                        'Create'
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition>
                    </>
                }
            />
            <div className="mb-5">
                <ul className="font-semibold">
                    <div className="w-full table-responsive mb-5">
                        <table className="">
                            <colgroup>
                                <col className="w-[10%]" />
                                <col className="min-w-[150px] w-[30%]" />
                                <col className="min-w-[150px] w-[30%]" />
                                <col className="w-[10%]" />
                                <col className="w-[10%]" />
                                <col className="w-[10%]" />
                            </colgroup>
                            <thead className="">
                                <tr className="w-full">
                                    <th></th>
                                    <th>Name</th>
                                    <th>Parent Category</th>
                                    <th>Active</th>
                                    <th>Main</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((category) => {
                                    return (
                                        <React.Fragment key={category._id}>
                                            <tr className="">
                                                <td>
                                                    <button
                                                        type="button"
                                                        disabled={category.subcategories.length < 1}
                                                        className={`${subcategoryView.includes(category._id) ? 'active' : ''} disabled:text-gray-500 text-primary flex items-center justify-center`}
                                                        onClick={() => toggleSubcategory(category._id)}
                                                    >
                                                        <IconCaretDown className={`w-5 h-5 inline ltr:mr-2 rtl:ml-2 ${subcategoryView.includes(category._id) && 'rotate-180'}`} />
                                                    </button>
                                                </td>
                                                <td className="truncate">{category.name}</td>
                                                <td></td>
                                                <td>
                                                    <div className="w-9 h-5 relative shrink-0">
                                                        <input
                                                            type="checkbox"
                                                            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                            id={`custom_switch_checkbox_${category._id}`}
                                                            onChange={() => {
                                                                toggleStatus(
                                                                    `All Product associated with this category will ${category.isActive ? 'hidden' : 'shown'}`,
                                                                    `Yes, ${category.isActive ? 'Disable' : 'Enable'}`,
                                                                    category._id,
                                                                    { isActive: !category.isActive }
                                                                );
                                                            }}
                                                            checked={category.isActive}
                                                        />
                                                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-3 before:h-3 before:rounded-full peer-checked:before:left-5 peer-checked:bg-success before:transition-all before:duration-300"></span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="w-9 h-5 relative shrink-0">
                                                        <input
                                                            type="checkbox"
                                                            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                            id={`custom_switch_checkbox_${category._id}`}
                                                            onChange={() => {
                                                                toggleStatus(
                                                                    `This category will ${category.isShowOnHomePage ? 'hidden' : 'shown'} on the home screen`,
                                                                    `Yes, ${category.isShowOnHomePage ? 'Hide' : 'Show'}`,
                                                                    category._id,
                                                                    { isShowOnHomePage: !category.isShowOnHomePage }
                                                                );
                                                            }}
                                                            checked={category.isShowOnHomePage}
                                                        />
                                                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-3 before:h-3 before:rounded-full peer-checked:before:left-5 peer-checked:bg-success before:transition-all before:duration-300"></span>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditCategoryId(category._id);
                                                            reset(
                                                                {
                                                                    name: category.name,
                                                                    isActive: category.isActive,
                                                                    icon: category.icon,
                                                                },
                                                                { keepDefaultValues: true }
                                                            );
                                                            setModal(true);
                                                        }}
                                                    >
                                                        <IconEdit className="m-auto" />
                                                    </button>
                                                </td>
                                            </tr>
                                            {category?.subcategories.map((subCategory: any) => (
                                                <tr
                                                    key={subCategory._id}
                                                    className={`${subcategoryView.includes(category._id) ? '' : 'hidden'} duration-300 transition-transform sub-category overflow-hidden`}
                                                >
                                                    <td></td>
                                                    <td className="truncate">{subCategory.name}</td>
                                                    <td className="truncate">{category.name}</td>
                                                    <td>
                                                        <div className="w-9 h-5 relative shrink-0">
                                                            <input
                                                                type="checkbox"
                                                                className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                                id={`custom_switch_checkbox_${subCategory._id}`}
                                                                onChange={(e) => {
                                                                    toggleStatus(
                                                                        `All Product associated with this category will ${subCategory.isActive ? 'hidden' : 'shown'}`,
                                                                        `Yes, ${subCategory.isActive ? 'Inactive' : 'active'}`,
                                                                        subCategory._id,
                                                                        { isActive: !subCategory.isActive }
                                                                    );
                                                                }}
                                                                checked={subCategory.isActive}
                                                            />
                                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-3 before:h-3 before:rounded-full peer-checked:before:left-5 peer-checked:bg-success before:transition-all before:duration-300"></span>
                                                        </div>
                                                    </td>
                                                    <td></td>
                                                    <td className="text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditCategoryId(subCategory._id);
                                                                reset(
                                                                    {
                                                                        name: subCategory.name,
                                                                        isActive: subCategory.isActive,
                                                                        parentId: category._id,
                                                                    },
                                                                    { keepDefaultValues: true }
                                                                );
                                                                setModal(true);
                                                            }}
                                                        >
                                                            <IconEdit className="m-auto" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </ul>
            </div>
        </>
    );
}

export default CategoryManagement;

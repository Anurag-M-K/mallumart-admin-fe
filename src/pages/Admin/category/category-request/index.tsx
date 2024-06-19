import React, { useState, Fragment, useEffect, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import * as z from 'zod';
import Swal, { SweetAlertIcon } from 'sweetalert2';

import { setPageTitle } from '../../../../store/themeConfigSlice';

import { editCategory, getPendingCategories } from '../../../../api/categoryApi';

import { Breadcrumbs } from '../../../../components/breadcrumbs/breadcrumbs';

export default function CategoryRequests() {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    // Fetching category data
    const { isPending, error, data } = useQuery({
        queryKey: ['category', 'pending'],
        queryFn: () => getPendingCategories(),
    });

    useEffect(() => {
        dispatch(setPageTitle('Treeview'));
    }, [dispatch]);

    // Component State
    const {
        mutateAsync,
        isError,
        isPending: isSubmittingForm,
    } = useMutation({
        mutationFn: (_id: string) => {
            return editCategory(_id, { isPending: false });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category'] });
            showAlert('success', 'succesfully added');
        },
        onError: (data: any) => {
            const errorMsg = data?.response?.data?.message ?? data.message;
            showAlert('error', errorMsg);
        },
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

    const toggleStatus = async (message: string, confirmButtonText: string, _id: string) => {
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
                await mutateAsync(_id);
            }
        });
    };

    return (
        <>
            {/* BREADCRUMBS PART */}
            <Breadcrumbs heading="Category" links={[{ name: 'Dashboard', href: '/admin' }, { name: 'Category', href: '/admin/categories' }, { name: 'Requests' }]} />
            <div className="mb-5">
                <ul className="font-semibold">
                    <div className="w-full table-responsive mb-5">
                        <table className="">
                            <colgroup>
                                <col className="min-w-[150px] w-[30%]" />
                                <col className="min-w-[150px] w-[30%]" />
                                <col className="w-[10%]" />
                            </colgroup>
                            <thead className="">
                                <tr className="w-full">
                                    <th>Requesetd Category</th>
                                    <th>Parent Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((category) => (
                                    <tr key={category._id} className={`sub-category`}>
                                        <td className="truncate">{category.name}</td>
                                        <td className="truncate">{category.parentId.name}</td>
                                        <td className="text-center">
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm"
                                                onClick={() => {
                                                    toggleStatus('Are you sure want to accept this category', 'Yes, Accept', category._id);
                                                }}
                                            >
                                                Accept
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </ul>
            </div>
        </>
    );
}

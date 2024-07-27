import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { convertTo12HourFormat, showAlert } from '../../../utils/util-functions';
import { addTimeSlot, deleteTimeSlots, fetchTimeSlots } from '../../../api/storeApi';
import { Button, Spinner } from 'flowbite-react';
import { DataTable } from 'mantine-datatable';
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';
import { RiDeleteBinLine } from "react-icons/ri";
import Swal from 'sweetalert2';

export default function TimeSlot() {
    const storeToken = useSelector((state: any) => state?.storeOwner?.storeOwnerToken);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);

    const { data, error, isLoading } = useQuery({
        queryKey: ['time-slots', storeToken],
        queryFn: () => fetchTimeSlots(storeToken),
        enabled: !!storeToken, // Only fetch if storeToken is available
    });

    const mutation = useMutation({
        mutationFn: (newSlot: any) => addTimeSlot(storeToken, newSlot),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['time-slots'] });
            setIsAddOrUpdate(false);
            showAlert('success', 'Time slot added successfully');
            setLoading(false);
        },
        onError: () => {
            showAlert('error', 'Something went wrong');
            setLoading(false);
        },
    });



    const { control, handleSubmit, register, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            slots: [{ date: new Date(), startTime: '', endTime: '', slotCount: 1 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'slots',
    });

    useEffect(() => {
        if (data && data.slots) {
            const formattedSlots = data.slots.map((slot: { date: string | number | Date }) => ({
                ...slot,
                date: new Date(slot.date),
            }));
            reset({ slots: formattedSlots });
        }
    }, [data, reset]);

    const onSubmit = async (data: any) => {
        console.log("onsubmit values  ",data)
        setLoading(true);
        mutation.mutate(data);
    };

    const addSlot = () => {
        append({ date: new Date(), startTime: '', endTime: '', slotCount: 1 });
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    const removeTimeSlots = async () => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: "You want to delele all Timeslots",
            showCancelButton: true,
            confirmButtonText:"confirm",
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then(async (result) => {
            if (result.value) {
                try {
                    await deleteTimeSlots(storeToken);
                    queryClient.invalidateQueries({ queryKey: ['time-slots'] });
                    showAlert('success', 'All time slots deleted successfully');
                } catch (error) {
                    showAlert('error', 'Failed to delete time slots');
                }
            }
        });
    }


    return (
        <div className="container mx-auto p-4">
            <Breadcrumbs heading="Stores" links={[{ name: 'Dashboard', href: '/staff' }, { name: 'Time Slot' }]} />

            <div className="datatables">
                <div className='flex gap-x-2  justify-end items-center my-2'>

                    <RiDeleteBinLine  className='cursor-pointer' onClick={()=>removeTimeSlots()} color='red' size={20} />
                        <button
                        type="button"
                        onClick={() => setIsAddOrUpdate(!isAddOrUpdate)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {data.length > 0 ? "Update Slots" : "Add Slots"}
                    </button>
                </div>
                <DataTable
                    className="whitespace-nowrap table-hover"
                    records={data?.[0]?.slots || []}
                    columns={[
                        // {
                        //     accessor: 'date',
                        //     title: 'Date',
                        //     sortable: true,
                        //     render: (date: any) => {
                        //         try {
                        //             return date.date.substring(0, 10);
                        //         } catch (error) {
                        //             console.error('Error formatting date:', error);
                        //             return 'Invalid date'; // Return raw date if formatting fails
                        //         }
                        //     },
                        // },
                        {
                            accessor: 'startTime',
                            title: 'Start Time',
                            render: (slot: any) => convertTo12HourFormat(slot.startTime),
                        },
                        {
                            accessor: 'endTime',
                            title: 'End Time',
                            render: (slot: any) => convertTo12HourFormat(slot.endTime),
                        },
                        {
                            accessor: 'slotCount',
                            title: 'Total Workers',
                        },
                    ]}
                    totalRecords={data?.length || 0}
                    minHeight={200}
                />
            </div>

            {isAddOrUpdate && (
                <>
                    <h2 className="text-2xl font-bold mb-4">{data.length > 0 ? "Update Time Slots" : "Add Time Slots"}</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="dark:bg-gray-900 grid bg-gray-100 shadow-md px-3 py-4 rounded-md sm:grid-cols-8 gap-4 items-center">
                                {/* <div className="col-span-2">
                                    <label htmlFor={`slots[${index}].date`} className="dark:text-gray-500 block text-sm font-medium text-gray-700">
                                        Date
                                    </label>
                                    <Controller
                                        name={`slots.${index}.date` as const}
                                        control={control}
                                        render={({ field: { onChange, onBlur, value, ref } }) => (
                                            <DatePicker
                                                selected={value}
                                                onChange={(date: Date | null) => onChange(date)}
                                                onBlur={onBlur}
                                                ref={ref}
                                                className="mt-1 block dark:bg-black w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                dateFormat="yyyy-MM-dd"
                                            />
                                        )}
                                    />
                                    {errors.slots?.[index]?.date && <span className="text-red-600 text-sm">{errors.slots[index].date.message}</span>}
                                </div> */}
                                <div className="col-span-2">
                                    <label htmlFor={`slots[${index}].startTime`} className="dark:text-gray-500 block text-sm font-medium text-gray-700">
                                        Start Time
                                    </label>
                                    <Controller
                                        name={`slots.${index}.startTime`}
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="time"
                                                className="mt-1 dark:bg-black block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                step={300} // 5 min
                                            />
                                        )}
                                    />
                                    {errors.slots?.[index]?.startTime && <span className="text-red-600 text-sm">{errors.slots[index].startTime.message}</span>}
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor={`slots[${index}].endTime`} className="dark:text-gray-500 block text-sm font-medium text-gray-700">
                                        End Time
                                    </label>
                                    <Controller
                                        name={`slots.${index}.endTime`}
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="time"
                                                className="mt-1 dark:bg-black block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                step={300} // 5 min
                                            />
                                        )}
                                    />
                                    {errors?.slots?.[index]?.endTime && <span className="text-red-600 text-sm">{errors.slots[index].endTime.message}</span>}
                                </div>
                                <div className="col-span-1">
                                    <label htmlFor={`slots[${index}].slotCount`} className="dark:text-gray-500 block text-sm font-medium text-gray-700">
                                        Total Workers
                                    </label>
                                    <input
                                        {...register(`slots.${index}.slotCount`)}
                                        type="number"
                                        className="mt-1 dark:bg-black block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="inline-flex items-center px-2 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between">
                            <Button type="button" onClick={addSlot}>
                                Add Slot
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? <Spinner size="sm" /> : "Submit"}
                            </Button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}

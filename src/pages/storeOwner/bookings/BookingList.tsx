import { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import orderBy from 'lodash/orderBy';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { deleteProduct, fetchAllProductsOfAStore, fetchOneProductDetails } from '../../../api/product.api';
import { useSelector } from 'react-redux';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEdit from '../../../components/Icon/IconEdit';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import NewStore from '../../staff/store-management/new-product/new-product';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { showAlert } from '../../../utils/util-functions';
import { addTimeSlot } from '../../../api/storeApi';
import { Spinner } from 'flowbite-react';

const PAGE_SIZES = [10, 20, 30, 50, 100];

export default function BookingList() {
    const storeOwnerData = useSelector((state: any) => state?.storeOwner?.storeOwnerData);
    const storeToken = useSelector((state:any)=>state?.storeOwner?.storeOwnerToken)
    const [loading,setLoading] = useState(false);  
    const { control, handleSubmit, register, watch, formState: { errors } } = useForm({
        defaultValues: {
          slots: [{ date: new Date(), startTime: '', endTime: '', token: 1 }]
        }
      });
    
      const { fields, append, remove } = useFieldArray({
        control,
        name: 'slots'
      });
    
      const onSubmit = async (data:TSlot) => {
        console.log("data ",data)
        try {
          setLoading(true)
          const res:any = await addTimeSlot(storeToken,data)
          console.log("Res ",res)
          if(res.status === 201){
            setLoading(false)
            showAlert("success",res?.data?.message)
          }else{
            showAlert("error",res?.response?.data?.message)
            setLoading(false)
          }
        } catch (error) {
          setLoading(false)
          console.log(error)
          showAlert('error',"Something went wrong")
        }
      };
    
      // Watch all slots to generate tokens dynamically
      const slots = watch('slots');
    
      const getNextToken = (slots:any) => {
        console.log("slot ",slots)
        const weekDay = new Date(slots[slots.length - 1].date).getDay();
        console.log(":Weekday ",weekDay)
        const isMonday = weekDay === 1;
    
        let lastToken = 2;
        if (!isMonday && slots.length > 1) {
          lastToken = slots[slots.length - 1].token + 1;
          console.log("lasttoken",lastToken)
        }
    
        return isMonday ? 1 : lastToken;
      };
    
      const addSlot = () => {
        append({ date: new Date(), startTime: '', endTime: '', token: getNextToken(slots) });
      };
    
      
    return (
   
        <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Add Time Slots</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid bg-gray-200 p-2 rounded-md sm:grid-cols-8 gap-4 items-center">
              <div className="col-span-2">
                <label htmlFor={`slots[${index}].date`} className="block text-sm font-medium text-gray-700">Date</label>
                <Controller
              name={`slots.${index}.date` as const}
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <DatePicker
                  selected={value}
                  onChange={(date: Date | null) => onChange(date)}
                  onBlur={onBlur}
                  ref={ref}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  dateFormat="yyyy-MM-dd"
                />
              )}
            />
                {errors.slots?.[index]?.date && (
                  <span className="text-red-600 text-sm">{errors.slots[index].date.message}</span>
                )}
              </div>
              <div className="col-span-2">
                <label htmlFor={`slots[${index}].startTime`} className="block text-sm font-medium text-gray-700">Start Time</label>
                <Controller
                  name={`slots.${index}.startTime`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="time"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      step={300} // 5 min
                    />
                  )}
                />
                {errors.slots?.[index]?.startTime && (
                  <span className="text-red-600 text-sm">{errors.slots[index].startTime.message}</span>
                )}
              </div>
              <div className="col-span-2">
                <label htmlFor={`slots[${index}].endTime`} className="block text-sm font-medium text-gray-700">End Time</label>
                <Controller
                  name={`slots.${index}.endTime`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="time"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      step={300} // 5 min
                    />
                  )}
                />
                {errors.slots?.[index]?.endTime && (
                  <span className="text-red-600 text-sm">{errors.slots[index].endTime.message}</span>
                )}
              </div>
              <div className="col-span-1">
                <label htmlFor={`slots[${index}].token`} className="block text-sm font-medium text-gray-700">Token</label>
                <input
                  {...register(`slots.${index}.token`)}
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                //   readOnly
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={addSlot}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Time Slot
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
             {loading ? <Spinner/> :  "Save Time Slots"}
            </button>
          </div>
        </form>
      </div>
    );
}

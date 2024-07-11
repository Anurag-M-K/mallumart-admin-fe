import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import FormProvider from '../hook-form/form-provider';
import RHFTextField from '../hook-form/rhf-text-field';

import IconLoader from '../Icon/IconLoader';
import IconArrowBackward from '../Icon/IconArrowBackward';

const OtpInput = ({ onSubmitClicks, phone, setIsSendOtp }: {onSubmitClicks: any , phone: number | string, setIsSendOtp: Dispatch<SetStateAction<boolean>>}) => {
    const otpSchema = useMemo(
        () =>
            z.object({
                otp: z
                    .string()
                    .trim()
                    .max(6, { message: 'OTP must be 6 digits' })
                    .min(6, { message: 'OTP must be 6 digits' })
                    .regex(/^\d{6}$/, { message: 'OTP must be 6 digits' }),
            }),
        []
    );

    type IOtpSchema = z.infer<typeof otpSchema>;

    const methods = useForm<IOtpSchema>({
        defaultValues: {
            otp: '',
        },
        resolver: zodResolver(otpSchema),
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        } = methods;

    const onSubmit = handleSubmit(async (data) => {
        await onSubmitClicks(data);
    });

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="bg-white dark:bg-[#1b2e4b] p-8 rounded-lg shadow-md w-full max-w-md">
                <button type='button' className='mb-6 flex items-center hover:underline' onClick={() => setIsSendOtp(false)}><IconArrowBackward className="inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />Back to edit</button>
                <p className="text-gray-600 mb-6">
                    <i>OTP sent to: {phone}</i>
                </p>
                <FormProvider methods={methods} onSubmit={onSubmit} className="panel">
                    <div className="mb-4">
                        <RHFTextField name="otp" label="OTP" placeholder="Enter OTP" />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                            {isSubmitting ? (
                                <>
                                    <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0" />
                                    Verifying
                                </>
                            ) : (
                                'Verify'
                            )}
                        </button>
                    </div>
                </FormProvider>
            </div>
        </div>
    );
};

export default OtpInput;

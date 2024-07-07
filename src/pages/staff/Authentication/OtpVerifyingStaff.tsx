import React, { useState } from 'react';
import OtpVerifying from '../../common/OtpVerifying';
import { useLocation, useNavigate } from 'react-router-dom';
import { veriFyOtp } from '../../../api/commonApi';

function OtpVerifyingStaff() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = location.pathname.split('/')[2];
    const [error,setError] = useState<any>(null)
    
    const onSubmit = async (values:TOtp) => {
        setLoading(true);
        setError(null)
        try {
            const res:any = await veriFyOtp('staff', values?.otp, token);
            console.log('res from verifyf ',res)
            if (res?.status === 200) {
                navigate("/change-password")
            } else {
                setLoading(false);
                setError(res?.response?.data?.message)
                // perform some error messages
            }
        } catch (error:any) {
            console.log("error otp verifying",error);
            setError(error?.response?.data?.message)
            setLoading(false);
        }
    };

    return (
        <OtpVerifying onSubmit={onSubmit} loading={loading} error={error} />
    );
}

export default OtpVerifyingStaff;
 
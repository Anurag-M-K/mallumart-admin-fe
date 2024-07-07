import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../../store/themeConfigSlice';

import ForgotPasswordPhoneField from '../../common/ForgotPasswordPhoneField';
import { otpSendingForForgotPassword } from '../../../api/commonApi';

const LoginBoxed = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [error,setError] = useState<any>(null)
    useEffect(() => {
        dispatch(setPageTitle('Login Boxed'));
    });

    const navigate = useNavigate();

    const onSubmit = async (values: TForgotPasswordPhoneField) => {
        try {
            setLoading(true);
            setError(null)
            const res: any = await otpSendingForForgotPassword('staff', values?.phone);
            if (res?.status === 201) {
                localStorage.setItem("staff-password-change-token",res?.data?.token)
                setLoading(false);
                navigate(`/otp-verify/${res?.data?.token}`);
            }else{
                setLoading(false);
                setError(res?.response?.data?.message)
            }

            // toast.error(login.response.data.message);
        } catch (err:any) {
            // setError(err?.response?.data)
            setLoading(false);
        }
    };

    return <ForgotPasswordPhoneField onSubmit={onSubmit} loading={loading} error={error} />;
};

export default LoginBoxed;

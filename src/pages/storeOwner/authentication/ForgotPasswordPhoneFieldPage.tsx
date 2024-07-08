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
        dispatch(setPageTitle('Forgot Password'));
    });

    const navigate = useNavigate();

    const onSubmit = async (values: TForgotPasswordPhoneField) => {
        try {
            setLoading(true);
            setError(null)
            const res: any = await otpSendingForForgotPassword('store', values?.phone);
            console.log("res ",res)
            if (res?.status === 201) {
                localStorage.setItem("store-password-change-token",res?.data?.token)
                setLoading(false);
                navigate(`/store/otp-verify/${res?.data?.token}`);
            }else{
                setLoading(false);
                setError(res?.response?.data?.message)
            }

            // toast.error(login.response.data.message);
        } catch (err:any) {
            console.log("erro while submiting ",error)
            // setError(err?.response?.data)
            setLoading(false);
        }
    };

    return <ForgotPasswordPhoneField onSubmit={onSubmit} loading={loading} error={error} />;
};

export default LoginBoxed;

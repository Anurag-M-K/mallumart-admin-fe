import React, { useState } from 'react';
import ChangePassword from '../../common/ChangePassword';
import { UpdatePassword } from '../../../api/commonApi';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function ChangePasswordPage() {
    const [loading, setLoading] = useState(false);
    const token: string | null = localStorage.getItem('store-password-change-token');
    const [error, setError] = useState<any>('');
    const navigate = useNavigate();
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


    const onSubmit = async (values: TConfirmPassword) => {
        if (values.newPassword !== values.confirmPassword) {
            setError('Password is not match');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res: any = await UpdatePassword('store', values.confirmPassword, token);
            if (res?.status === 201) {
                localStorage.clear()
                showAlert('success', 'Password updated successfully');
                navigate('/store/login');
            } else {
                setLoading(false);
                showAlert('error', 'Something went wrong');
            }

            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            setError(error?.message == 'jwt expired' ? 'Token expired' : 'Something went wrong. Please try again later');
            console.log(error);
        }
    };

    return <ChangePassword loading={loading} onSubmit={onSubmit} error={error} />;
}

export default ChangePasswordPage;

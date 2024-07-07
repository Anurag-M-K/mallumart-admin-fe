import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import { Form, Field } from 'react-final-form';
import toast, { Toaster } from 'react-hot-toast';
import { Spinner } from 'flowbite-react';
import { setPageTitle } from '../../store/themeConfigSlice';
import WrappedInput from '../../components/wrappedComponents/WrappedInputField';
import { validation_phone } from '../../utils/validation';

const ChangePassword = ({ onSubmit,loading,error }: { onSubmit: any,loading:boolean,error:string }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Login Boxed'));
    });

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full    max-w-[500px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[200px] py-20">
                        <div className="mx-auto w-full max-w-[400px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl ">New Password</h1>
                            </div>
                            <Form
                                onSubmit={onSubmit}
                                render={({ handleSubmit, values }) => (
                                    <form className="space-y-5 dark:text-white" onSubmit={handleSubmit}>
                                        <div>
                                            <label htmlFor="Email">New Password</label>
                                            <div className="relative text-white-dark">
                                                <Field
                                                    id="newPassword"
                                                    type="password"
                                                    placeholder="Enter New Password"
                                                    component={WrappedInput}
                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                    name="newPassword"
                                                    // validate={validation_password}
                                                />
                                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <IconMail fill={true} />
                                                </span> */}
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="Email">Confirm New Password</label>
                                            <div className="relative text-white-dark">
                                                <Field
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="Confirm New Password"
                                                    component={WrappedInput}
                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                    name="confirmPassword"
                                                    // validate={validation_password}
                                                />
                                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <IconMail fill={true} />
                                                </span> */}
                                            </div>
                                        </div>
                                        {error && <p className="text-red-500">{error}</p>}

                                        <button type="submit" className="btn btn-gradient  !mt-6 w-full border py-3 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                            {loading ? <Spinner /> : 'Update'}
                                        </button>
                                    </form>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
};

export default ChangePassword;

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { Form, Field } from 'react-final-form';
import WrappedInput from '../../../components/wrappedComponents/WrappedInputField';
import { userLogin, userRegister } from '../../../api/userApi';
import { setuserDetails } from '../../../store/userSlice';
import { Button } from 'flowbite-react';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('User registration'));
    });

    const navigate = useNavigate();

    const onSubmit = async (values: any) => {
        try {
            const res = await userLogin(values);
            console.log("res .===> ",res)
            localStorage.setItem('userToken', res?.data?.token);
            dispatch(setuserDetails(res?.data));
            if (res?.status === 200) {
                toast.success("Login successful")
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div
                className="relative flex min-h-screen items-center justify-center 
             bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16"
            >
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                {/* <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" /> */}
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl ">SIGN IN </h1>
                            </div>
                            <Form
                                onSubmit={onSubmit}
                                render={({ handleSubmit, values }) => (
                                    <form className="space-y-5 dark:text-white" onSubmit={handleSubmit}>
                                        {/* <div>
                                            <label htmlFor="username">Name</label>
                                            <div className="relative text-white-dark">
                                                <Field
                                                    id="username"
                                                    type="text"
                                                    placeholder="Enter your name"
                                                    component={WrappedInput}
                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                    name="username"
                                                />
                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <IconMail fill={true} />
                                                </span>
                                            </div>
                                        </div> */}
                                        <div>
                                            <label htmlFor="Email">Email</label>
                                            <div className="relative text-white-dark">
                                                <Field id="email" type="email" placeholder="Enter Email" component={WrappedInput} className="form-input  placeholder:text-white-dark" name="email" />
                                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <IconMail fill={true} />
                                                </span> */}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="Password">Password</label>
                                            <div className="relative text-white-dark">
                                                <Field
                                                    name="password"
                                                    id="password"
                                                    type="password"
                                                    placeholder="Enter Password"
                                                    component={WrappedInput}
                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                />
                                                {/* <span className="absolute start-4  top-1/2 -translate-y-1/2">
                                                    <IconLockDots fill={true} />
                                                </span> */}
                                            </div>
                                        </div>

                                        <button type="submit" className="btn btn-gradient  !mt-6 w-full border py-3 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                            Sign IN
                                        </button>
                                    </form>
                                )}
                            />
                            <div className="text-end my-5">
                                <a onClick={() => navigate('/user/signup')} className="text-blue-600 cursor-pointer hover:text-blue-400 ">
                                    Dont have an account ? signup here
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster/>
        </div>
    );
};

export default Register;

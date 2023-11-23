import Loader from "../../Loader/Loader.jsx";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {PROFILE, SIGNIN} from "../../../util/routes.js";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {
    useRegisterCandidateMutation,
    setCredentials,
    useRegisterRecruiterMutation
} from "../../../redux/slices/authSlice.js";
import Input from "../../Input/Input.jsx";

const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { search } = useLocation();
    const isCandidate = new URLSearchParams(search).get('candidate');
    const [registerCandidate, { isLoadingCandidate }] = useRegisterCandidateMutation()
    const [registerRecruiter, { isLoadingRecruiter }] = useRegisterRecruiterMutation()
    const token = useSelector(state => state.auth.accessToken);
    const searchParams = new URLSearchParams(search);
    const redirect = searchParams.get("redirect") || PROFILE;

    useEffect(() => {
        if(token) {
            navigate(redirect);
        }
    }, [token, redirect, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const performRegistration = isCandidate ? registerCandidate : registerRecruiter;
            const data = {
                "user" : {
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password
                }
            }
            const res = await performRegistration(data).unwrap();
            dispatch(setCredentials(res));
            navigate(redirect);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-10 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign up your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSignUp}>
                    <Input label="First name" value={firstName} setValue={setFirstName} type="text" name="firstName" />

                    <Input label="Last name" value={lastName} setValue={setLastName} type="text" name="lastName" />

                    <Input label="Email" value={email} setValue={setEmail} type="email" name="email" />

                    <Input label="Password" value={password} setValue={setPassword} type="password" name="password" />

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                {(isLoadingCandidate || isLoadingRecruiter) && <Loader />}

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to={SIGNIN} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;

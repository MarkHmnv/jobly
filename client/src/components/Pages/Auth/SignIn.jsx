import {Link, useLocation, useNavigate} from "react-router-dom";
import {HOME, SIGNUP} from "../../../util/routes.js";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {resetCredentials, useSignInMutation} from "../../../redux/slices/authSlice.js";
import Loader from "../../Loader/Loader.jsx";
import Input from "./Input.jsx";

const SignIn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signIn, {isLoading}] = useSignInMutation();
    const token = useSelector(state => state.auth.accessToken);
    const {search} = useLocation();
    const searchParams = new URLSearchParams(search);
    const redirect = searchParams.get("redirect") || HOME;

    useEffect(() => {
        if(token) {
            navigate(redirect);
        }
    }, [token, redirect, navigate]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const res = await signIn({email, password}).unwrap();
            dispatch(resetCredentials(res));
            navigate(redirect);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSignIn}>
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

                {isLoading && <Loader />}

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <Link to={SIGNUP} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;

import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline/index.js";
import {Dialog} from "@headlessui/react";
import {useState} from "react";
import {Link, NavLink} from "react-router-dom";
import {
    CANDIDATES,
    CREATE_VACANCY,
    HOME,
    PROFILE,
    RECOMMENDATIONS,
    SIGNIN,
    SIGNUP,
    VACANCIES
} from "../../../util/routes.js";
import {useDispatch, useSelector} from "react-redux";
import {Fragment} from 'react'
import {Menu, Transition} from '@headlessui/react'
import {ChevronDownIcon} from '@heroicons/react/20/solid'
import {removeCredentials} from "../../../redux/slices/authSlice.js";
import {isRecruiter} from "../../../util/jwt.js";
import {classNames} from "../../../util/util.js";

const navigation = [
    {name: 'Recommendations', href: RECOMMENDATIONS},
    {name: 'Vacancies', href: VACANCIES},
    {name: 'Candidates', href: CANDIDATES},
]

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const username = useSelector(state => state.auth.username);
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.accessToken);
    const isUserRecruiter = isRecruiter(token);

    const logout = () => {
        dispatch(removeCredentials());
    }

    return (
        <header className="inset-x-0 top-0 z-50 pb-10">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link to={HOME} className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt=""
                        />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <NavLink key={item.name} to={item.href}
                                 className="text-sm font-semibold leading-6 text-gray-900">
                            {item.name}
                        </NavLink>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {
                        username
                            ? <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button
                                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                        {username}
                                        <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true"/>
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items
                                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({active}) => (
                                                    <Link
                                                        to={PROFILE}
                                                        className={classNames(
                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                    >
                                                        Profile
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            {isUserRecruiter &&
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <Link
                                                            to={CREATE_VACANCY}
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >
                                                            Post vacancy
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            }
                                        </div>
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({active}) => (
                                                    <Link
                                                        to=""
                                                        onClick={logout}
                                                        className={classNames(
                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                    >
                                                        Sign out
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                            : (
                                <>
                                    <Link to={`${SIGNUP}?candidate=true`}
                                          className="text-sm font-semibold leading-6 text-gray-900">
                                        Sign up as Candidate
                                    </Link>
                                    <span>&nbsp;|&nbsp;</span>
                                    <Link to={SIGNUP} className="text-sm font-semibold leading-6 text-gray-900">
                                        Sign up as Recruiter
                                    </Link>
                                </>
                            )
                    }
                </div>
            </nav>
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-50"/>
                <Dialog.Panel
                    className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                alt=""
                            />
                        </a>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                            <div className="py-6">
                                {
                                    username
                                        ? <Link to={PROFILE} className="text-sm font-semibold leading-6 text-gray-900">
                                            {username}
                                        </Link>
                                        : (
                                            <Link to={SIGNIN}
                                                  className="text-sm font-semibold leading-6 text-gray-900">
                                                Sign in
                                            </Link>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    );
};

export default Header;

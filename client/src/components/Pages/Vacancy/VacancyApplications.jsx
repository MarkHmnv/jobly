import {Link, useParams, useSearchParams} from 'react-router-dom';
import {useGetVacancyApplicationsQuery} from '../../../redux/slices/vacancySlice.js';
import Loader from '../../shared/Loader/Loader.jsx';
import {CANDIDATES} from "../../../util/routes.js";
import {Menu, Transition} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/20/solid/index.js";
import {Fragment, useState} from "react";
import {classNames} from "../../../util/util.js";
import Card from "./Card.jsx";
import Pagination from "../../shared/Pagination/Pagination.jsx";

const VacancyApplications = () => {
    const {id} = useParams();
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) > 0 ? Number(searchParams.get('page')) : 1;
    const [sortOptions] = useState([
        {key: 'quality', label: 'Quality'},
        {key: 'created_at', label: 'Date'},
    ]);
    const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
    const [reverse, setReverse] = useState(true);

    const {data, isLoading} = useGetVacancyApplicationsQuery({
        id,
        sort_by: selectedSort.key,
        reverse,
        page
    });

    const sortBy = (option, reverse) => {
        setSelectedSort(option);
        setReverse(reverse);
    };

    return (
        isLoading ? <Loader/> :
            data.results.length === 0 ? <p>No applications yet</p> :
                <div className="flex justify-between w-full pl-20 pr-20">
                    <div className="w-2/3 space-y-6">
                        {data.results.map((application, index) => (
                            <Link to={`${CANDIDATES}/${application.candidate.id}`} key={index}>
                                <Card
                                    title={`${application.candidate.user.first_name} ${application.candidate.user.last_name}`}
                                    city={application.candidate.city}
                                    country={application.candidate.country}
                                    experience={application.candidate.experience}
                                    salary={application.candidate.salary}
                                    description={application.cover_letter}
                                    createdAt={application.created_at}
                                    quality={application.quality}
                                    skills={application.candidate.skills}
                                />
                            </Link>
                        ))}
                        <Pagination count={data.count}/>
                    </div>
                    <div className="w-1/3 pl-40">
                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <Menu.Button
                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    <svg className="w-4 h-4 text-gray-800" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M4 6v13m0 0 3-3m-3 3-3-3m11-2V1m0 0L9 4m3-3 3 3"/>
                                    </svg>
                                    Sort by
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
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                >
                                    <div className="py-1">
                                        {sortOptions.map((option) => (
                                            <Fragment key={option.key}>
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <button
                                                            onClick={() => sortBy(option, true)}
                                                            className={classNames(
                                                                'block w-full text-left focus:outline-none',
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'px-4 py-2 text-sm transition duration-300 ease-in-out hover:bg-gray-200'
                                                            )}
                                                        >
                                                            {option.label}: High to Low
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <button
                                                            onClick={() => sortBy(option, false)}
                                                            className={classNames(
                                                                'block w-full text-left focus:outline-none',
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'px-4 py-2 text-sm transition duration-300 ease-in-out hover:bg-gray-200'
                                                            )}
                                                        >
                                                            {option.label}: Low to High
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </Fragment>
                                        ))}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
    );
};

export default VacancyApplications;

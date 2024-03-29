import {useGetAllCandidatesQuery} from "../../../redux/slices/userSlice.js";
import Loader from "../../shared/Loader/Loader.jsx";
import {Link, useSearchParams} from "react-router-dom";
import {CANDIDATES} from "../../../util/routes.js";
import Pagination from "../../shared/Pagination/Pagination.jsx";
import {UserCircleIcon} from "@heroicons/react/24/solid/index.js";

const UserCard = ({candidate}) => {
    return (
        <div className="w-80 h-120 bg-white shadow-lg rounded-lg overflow-hidden my-4">
            {candidate.user.image ?
                <img src={candidate.user.image} className="w-full h-56 object-cover object-center" alt="image"/> :
                <UserCircleIcon className="w-full h-56 object-cover object-center text-gray-300" aria-hidden="true"/>}
            <div className="py-4 px-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {candidate.user.first_name + " " + candidate.user.last_name}
                </h1>
                <p className="py-2 text-lg text-gray-700">
                    {candidate.position && candidate.position}
                </p>

                <div className="flex items-center mt-4 text-gray-700">
                    {(candidate.country && candidate.city) &&
                        <>
                            <svg className="h-6 w-6 fill-current" viewBox="0 0 512 512">
                                <path
                                    d="M256 32c-88.004 0-160 70.557-160 156.801C96 306.4 256 480 256 480s160-173.6 160-291.199C416 102.557 344.004 32 256 32zm0 212.801c-31.996 0-57.144-24.645-57.144-56 0-31.357 25.147-56 57.144-56s57.144 24.643 57.144 56c0 31.355-25.148 56-57.144 56z"/>
                            </svg>
                            <h1 className="px-2 text-sm">
                                {candidate.country + ", " + candidate.city}
                            </h1>
                        </>

                    }
                </div>

                <div className="flex items-center mt-4 text-green-700">
                    {candidate.salary &&
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                 className="h-6 w-6 text-green-700"
                                 viewBox="0 0 31 31">
                                <path d="M24.26,20.34c0,3.42-2.423,6.342-6.845,7.111v3.92h-3.768v-3.648c-2.578-0.117-5.076-0.811-6.537-1.654l1.154-4.5
		c1.615,0.886,3.883,1.693,6.383,1.693c2.191,0,3.691-0.848,3.691-2.385c0-1.461-1.23-2.389-4.077-3.348
		c-4.112-1.385-6.921-3.306-6.921-7.033c0-3.386,2.385-6.035,6.499-6.845V0h3.767v3.383c2.576,0.115,4.309,0.652,5.576,1.268
		l-1.115,4.348C21.07,8.575,19.3,7.688,16.531,7.688c-2.5,0-3.307,1.076-3.307,2.154c0,1.268,1.346,2.074,4.613,3.307
		C22.416,14.762,24.26,16.877,24.26,20.34z"/>
                            </svg>
                            <h1 className="px-2 text-sm">{candidate.salary}</h1>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

const CandidateList = () => {
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) > 0 ? Number(searchParams.get('page')) : 1;
    const {data, isLoading} = useGetAllCandidatesQuery({page});

    return (
        isLoading ? <Loader/> :
            <div className="w-full pl-20 pr-20">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    justifyItems: 'center'
                }}>

                    {data.results.map((candidate, index) => (
                        <Link to={`${CANDIDATES}/${candidate.id}`} key={index}>
                            <UserCard candidate={candidate}/>
                        </Link>
                    ))}
                </div>
                <Pagination count={data.count}/>
            </div>

    );
};

export default CandidateList;

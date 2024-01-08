import {useParams} from "react-router-dom";
import {useGetVacancyApplicationsQuery} from "../../../redux/slices/vacancySlice.js";
import Loader from "../../Loader/Loader.jsx";

const VacancyApplications = () => {
    const {id} = useParams()
    const {data: applications, isLoading} = useGetVacancyApplicationsQuery(id)

    return (
        isLoading ? <Loader/> :
            applications.length === 0 ? <p>No applications yet</p> :
                <div className="border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-black">Applications</h2>
                    </div>
                    <div className="p-4 text-black">
                        <ul className="space-y-4">
                            {applications.map((application) => (
                                <li key={application.id} className="flex items-center space-x-4">
                                    <img
                                        alt="Avatar"
                                        className="w-10 h-10 rounded-full"
                                        height="40"
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Placeholder_no_text.svg/1200px-Placeholder_no_text.svg.png"
                                        style={{
                                            aspectRatio: "40/40",
                                            objectFit: "cover",
                                        }}
                                        width="40"
                                    />
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-bold">
                                            {application.candidate.user.first_name}{' '}
                                            {application.candidate.user.last_name}
                                        </h3>
                                        <span
                                            className="mt-2 px-2 py-1 text-sm text-white bg-green-500 rounded">
                                                    {application.candidate.position}
                                        </span>
                                        <span className="text-sm">
                                                    <strong>Skills:</strong>{' '}
                                            {application.candidate.skills
                                                .map((skill) => skill.name)
                                                .join(', ')}
                                                </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
    )
};

export default VacancyApplications;

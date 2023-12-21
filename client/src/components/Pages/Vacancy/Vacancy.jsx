import {useEffect, useState} from "react";
import {useApplyForVacancyMutation, useGetVacancyQuery} from "../../../redux/slices/vacancySlice.js";
import {useParams} from "react-router-dom";
import Loader from "../../Loader/Loader.jsx";
import {isCandidate} from "../../../util/jwt.js";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {toastError} from "../../../util/toastUtil.jsx";

const Vacancy = () => {
    const {id} = useParams()
    const {data: vacancy, isLoading} = useGetVacancyQuery(id)

    const token = useSelector(state => state.auth.accessToken);
    const isUserCandidate = isCandidate(token);
    const [applyForVacancy, {isLoading: isApplying}] = useApplyForVacancyMutation();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState(0);
    const [salary, setSalary] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [description, setDescription] = useState("");

    const [coverLetter, setCoverLetter] = useState("");
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        if (vacancy) {
            setTitle(vacancy.title)
            setCategory(vacancy.category.name)
            setSkills(vacancy.skills.map(skill => skill.name).join(", "))
            setExperience(vacancy.experience)
            setSalary(vacancy.salary)
            setCountry(vacancy.country)
            setCity(vacancy.city)
            setDescription(vacancy.description)
            setApplications(vacancy.applications)
        }
    }, [vacancy, isLoading]);

    const handleApply = () => {
        try {
            applyForVacancy({
                coverLetter: {
                    "cover_letter": coverLetter
                }, id: id
            });
            toast.success("Successfully applied");
        } catch (error) {
            console.log(error)
            toastError(error);
        }
    }

    return (
        isLoading ? <Loader/> :
            <main className="p-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                        <div className="bg-white border border-gray-200 shadow-lg">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-black">{title}</h2>
                            </div>
                            <div className="p-4 space-y-4 text-black">
                                <h3 className="text-xl font-semibold">Category</h3>
                                <p className="text-base">{category}</p>
                                <h3 className="text-xl font-semibold">Skills</h3>
                                <p className="text-base">{skills}</p>
                                <h3 className="text-xl font-semibold">Experience (in years)</h3>
                                <p className="text-base">{experience}</p>
                                <h3 className="text-xl font-semibold">Salary</h3>
                                <p className="text-base">{salary ? `$${salary}` : "Negotiable"}</p>
                                <h3 className="text-xl font-semibold">Location</h3>
                                <p className="text-base">{country}, {city}</p>
                                <h3 className="text-xl font-semibold">Description</h3>
                                <p className="text-base">{description}</p>
                            </div>
                        </div>
                    </div>
                    {isUserCandidate &&
                        <div>
                            <div className="bg-white border border-gray-200 shadow-lg">
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-black">Apply for this Job</h2>
                                </div>
                                <div className="p-4 space-y-4 text-black">
                                    <div className="space-y-2">
                                        <label className="text-lg font-bold text-gray-700" htmlFor="cover-letter">
                                            Cover Letter
                                        </label>
                                        <input className="w-full p-2 border border-gray-300 rounded" id="cover-letter"
                                               value={coverLetter}
                                               onChange={e => setCoverLetter(e.target.value)}
                                               required/>
                                    </div>
                                    <button
                                        className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
                                        onClick={handleApply}
                                    >
                                        Apply Now
                                    </button>
                                    {isApplying && <Loader/>}
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {applications && applications.length > 0 && (
                    <div className="hidden lg:block mt-10">
                        <div className="bg-white border border-gray-200 shadow-lg">
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
                                                src="/placeholder.svg"
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
                                                    {application.candidate.position || 'Position not specified'}
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
                    </div>
                )}

            </main>
    );
};

export default Vacancy;
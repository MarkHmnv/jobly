import {useEffect, useState} from "react";
import {
    useApplyForVacancyMutation,
    useDeleteVacancyMutation,
    useGetVacancyQuery
} from "../../../redux/slices/vacancySlice.js";
import {Link, useNavigate, useParams} from "react-router-dom";
import Loader from "../../shared/Loader/Loader.jsx";
import {isCandidate} from "../../../util/jwt.js";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {toastError} from "../../../util/toastUtil.jsx";
import {VACANCIES} from "../../../util/routes.js";
import ReactMarkdown from "react-markdown";
import gfm from 'remark-gfm';
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/20/solid/index.js";
import ConfirmationDialog from "../../shared/ConfirmationDialog/ConfirmationDialog.jsx";

const Vacancy = () => {
    const {id} = useParams()
    const {data: vacancy, isLoading} = useGetVacancyQuery(id)

    const token = useSelector(state => state.auth.accessToken);
    const isUserCandidate = isCandidate(token);
    const [applyForVacancy, {isLoading: isApplying}] = useApplyForVacancyMutation();
    const [deleteVacancy] = useDeleteVacancyMutation(id);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState(0);
    const [salary, setSalary] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [description, setDescription] = useState("");

    const [coverLetter, setCoverLetter] = useState("");
    const [owner, setOwner] = useState(false);

    const [showConfirmation, setShowConfirmation] = useState(false);

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
            setOwner(vacancy.owner)
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

    const handleDelete = () => {
        try {
            deleteVacancy(id);
            toast.success("The vacancy was successfully deleted");
            navigate(VACANCIES);
        } catch (error) {
            toastError(error);
        }
    }

    return (
        isLoading ? <Loader/> :
            <main className="pl-10 pr-10">
                <div className="bg-white border border-gray-200 shadow-lg p-4">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-black">{title}</h2>
                        {owner && (
                            <div className="flex items-center space-x-2">
                                <Link to={`${VACANCIES}/${id}/applications`} className="text-blue-500 hover:underline">
                                    View Applications
                                </Link>
                                <Link to={`${VACANCIES}/${id}/edit`}><PencilSquareIcon
                                    className="h-6 w-6 text-blue-500"/></Link>
                                <button onClick={() => setShowConfirmation(true)}><TrashIcon
                                    className="h-6 w-6 text-red-500"/></button>
                                <ConfirmationDialog show={showConfirmation} setShow={setShowConfirmation}
                                                    onConfirm={handleDelete}
                                                    message={"Are you sure you want to delete this vacancy?"}/>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 text-black mt-4 pl-5 pr-10">
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
                        <ReactMarkdown remarkPlugins={[gfm]}>{description}</ReactMarkdown>
                    </div>
                </div>
                {isUserCandidate &&
                    <div className="mt-6 bg-white border border-gray-200 shadow-lg p-4">
                        <h2 className="text-2xl font-bold text-black">Apply for this Job</h2>
                        <div className="space-y-4 text-black mt-4">
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
                }
            </main>
    );
};

export default Vacancy;

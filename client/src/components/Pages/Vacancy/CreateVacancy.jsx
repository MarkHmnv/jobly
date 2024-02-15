import {useCreateVacancyMutation} from "../../../redux/slices/vacancySlice.js";
import Input from "../../shared/Input/Input.jsx";
import CountrySelect from "../../shared/Select/CountrySelect.jsx";
import CategorySelect from "../../shared/Select/CategorySelect.jsx";
import TextArea from "../../shared/TextArea/TextArea.jsx";
import Loader from "../../shared/Loader/Loader.jsx";
import {useState} from "react";
import {VACANCIES} from "../../../util/routes.js";
import {useNavigate} from "react-router-dom";
import {toastError} from "../../../util/toastUtil.jsx";
import {toast} from "react-toastify";

const CreateVacancy = () => {
    const [createVacancy, isLoading] = useCreateVacancyMutation()
    const navigate = useNavigate()

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState(0);
    const [salary, setSalary] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [description, setDescription] = useState("");

    const submitCreate = async (e) => {
        e.preventDefault()

        let skillsArray = skills.split(",").map(skill => ({name: skill.trim()}))

        try {
            const res = await createVacancy({
                title,
                "category": {
                    "name": category
                },
                skills: skillsArray,
                experience,
                salary,
                country,
                city,
                description
            }).unwrap()

            navigate(`${VACANCIES}/${res.id}`)

            toast.success("Vacancy created successfully")
        } catch (error) {
            toastError(error)
        }
    }

    return (
        <form className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8" onSubmit={submitCreate}>
            <div className="space-y-12">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Vacancy</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Create new vacancy
                    </p>

                    <div className="border-b border-gray-900/10 pb-12">

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <Input label="Title" value={title} setValue={setTitle} type="text"/>
                            <CountrySelect currentCountry={country} setCountry={setCountry}/>
                            <Input label="City" value={city} setValue={setCity} type="text"/>
                        </div>
                    </div>
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <CategorySelect value={category} setValue={setCategory}/>

                            <Input label="Expirience" value={experience} setValue={setExperience} type="number"/>
                            <Input label="Salary" value={salary} setValue={setSalary} type="text"/>
                        </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                        <TextArea label="About" value={description} setValue={setDescription}/>
                    </div>
                    <div className="border-b border-gray-900/10 pb-12">
                        <TextArea label="Skills" value={skills} setValue={setSkills}/>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6 pb-12">
                {isLoading && <Loader/>}
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Create
                </button>
            </div>
        </form>
    );
};

export default CreateVacancy;

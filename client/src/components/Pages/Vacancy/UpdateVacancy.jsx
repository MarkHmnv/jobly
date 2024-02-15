import {useEffect, useState} from "react";
import {useGetVacancyQuery, useUpdateVacancyMutation} from "../../../redux/slices/vacancySlice.js";
import {useParams} from "react-router-dom";
import Input from "../../shared/Input/Input.jsx";
import CountrySelect from "../../shared/Select/CountrySelect.jsx";
import CategorySelect from "../../shared/Select/CategorySelect.jsx";
import TextArea from "../../shared/TextArea/TextArea.jsx";
import Loader from "../../shared/Loader/Loader.jsx";
import {toastError} from "../../../util/toastUtil.jsx";
import {toast} from "react-toastify";

const UpdateVacancy = () => {
    const [updateVacancy, {isLoading: isUpdating}] = useUpdateVacancyMutation()
    const {id} = useParams()
    const {data: vacancy, isLoading} = useGetVacancyQuery(id)

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState(0);
    const [salary, setSalary] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [description, setDescription] = useState("");

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
        }
    }, [vacancy, isLoading]);

    const submitUpdate = async (e) => {
        e.preventDefault()

        let skillsArray = skills.split(",").map(skill => ({name: skill.trim()}))

        try {
            await updateVacancy({
                vacancy: {
                    title,
                    "category": {"name": category},
                    skills: skillsArray,
                    experience,
                    salary,
                    country,
                    city,
                    description,
                },
                id: id
            })
            toast.success("Vacancy updated")
        } catch (error) {
            toastError(error)
        }
    }

    return (
        isLoading ? <Loader/> :
            <form className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8" onSubmit={submitUpdate}>
                <div className="space-y-12">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Vacancy</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Update the vacancy
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
                    {isUpdating && <Loader/>}
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Update
                    </button>
                </div>
            </form>
    );
};

export default UpdateVacancy;

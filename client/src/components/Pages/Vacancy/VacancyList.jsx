import {useGetAllVacanciesQuery} from "../../../redux/slices/vacancySlice.js";
import Loader from "../../Loader/Loader.jsx";
import {Link} from "react-router-dom";
import {VACANCIES} from "../../../util/routes.js";
import Card from "./Card.jsx";
import {useEffect, useState} from "react";
import _debounce from 'lodash/debounce';
import CategorySelect from "../../Select/CategorySelect.jsx";

const VacancyList = () => {
    const [skills, setSkills] = useState(null);
    const [category, setCategory] = useState(null);
    const [salary, setSalary] = useState(null);
    const {data: vacancies, isLoading} = useGetAllVacanciesQuery({skills, category, salary});

    const debouncedSetSkills = _debounce((value) => setSkills(value), 600);
    const debouncedSetSalary = _debounce((value) => setSalary(value), 600);

    useEffect(() => {
        debouncedSetSkills(skills);
        debouncedSetSalary(salary);

        return () => {
            debouncedSetSkills.cancel();
            debouncedSetSalary.cancel();
        };
    }, [skills, salary, debouncedSetSkills, debouncedSetSalary]);

    return (
        isLoading ? <Loader/> :
            <div className="flex justify-between w-full pl-20 pr-20">
                <div className="w-2/3 space-y-6">
                    {vacancies.map((vacancy, index) => (
                        <Link to={`${VACANCIES}/${vacancy.id}`} key={index}>
                            <Card
                                title={vacancy.title}
                                city={vacancy.city}
                                country={vacancy.country}
                                experience={vacancy.experience}
                                salary={vacancy.salary}
                                description={vacancy.description}
                                createdAt={vacancy.created_at}
                                skills={vacancy.skills}
                            />
                        </Link>
                    ))}
                </div>
                <div className="w-1/3 ml-10">
                    <div className="border rounded-lg shadow-sm bg-white p-4 md:p-6">
                        <h2 className="text-xl font-bold mb-4">Filter by:</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Skills
                            </label>
                            <input type="text" placeholder="Enter Skills"
                                   onChange={(e) => debouncedSetSkills(e.target.value)}
                                   className="w-full p-2 border border-gray-300 rounded"/>
                        </div>
                        <div className="mb-4">
                            <CategorySelect value={category} setValue={setCategory}/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Salary
                            </label>
                            <input type="number" placeholder="Enter Salary"
                                   onChange={(e) => debouncedSetSalary(e.target.value)}
                                   className="w-full p-2 border border-gray-300 rounded"/>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default VacancyList;

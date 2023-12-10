import {useGetAllVacanciesQuery} from "../../../redux/slices/vacancySlice.js";
import Loader from "../../Loader/Loader.jsx";
import VacancyFilter from "./VacancyFilter.jsx";
import {Link} from "react-router-dom";
import {VACANCIES} from "../../../util/routes.js";

const VacancyCard = ({ vacancy }) => {
    return (
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
            <div className="space-y-2">
                <div className="text-2xl leading-6 font-medium space-y-1">
                    <h2>{vacancy.title}</h2>
                </div>
                <div className="text-gray-700">
                    <p>{vacancy.city}, {vacancy.country}{' · '}{vacancy.experience} years of experience</p>
                    { vacancy.salary && <p className="text-green-700">${vacancy.salary}</p>}
                    <p className="text-gray-500">{vacancy.description}</p>
                </div>
            </div>
        </div>
    );
}


const VacancyList = () => {
    const {data: vacancies, isLoading} = useGetAllVacanciesQuery();

    return (
        isLoading ? <Loader/> :
            <div className="flex justify-between">
                <div className="w-2/3">
                    {vacancies.map((vacancy, index) => (
                        <Link to={`${VACANCIES}/${vacancy.id}`} key={index}>
                            <VacancyCard vacancy={vacancy}/>
                        </Link>
                    ))}
                </div>
                <div className="w-1/3">
                    <VacancyFilter />
                </div>
            </div>
    );
};

export default VacancyList;

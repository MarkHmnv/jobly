import {useGetRecommendationsQuery} from "../../../redux/slices/vacancySlice.js";
import Loader from "../../Loader/Loader.jsx";
import {Link} from "react-router-dom";
import {VACANCIES} from "../../../util/routes.js";
import Card from "./Card.jsx";

const Recommendations = () => {
    const {data: vacancies, isLoading} = useGetRecommendationsQuery();

    return (
        isLoading ? <Loader/> :
            <div className="w-full pl-20 pr-20">
                <div className="space-y-6">
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
            </div>
    );
};

export default Recommendations;

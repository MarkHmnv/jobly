import {useGetRecommendationsQuery} from "../../../redux/slices/vacancySlice.js";
import Loader from "../../shared/Loader/Loader.jsx";
import {Link, useSearchParams} from "react-router-dom";
import {VACANCIES} from "../../../util/routes.js";
import Card from "./Card.jsx";
import Pagination from "../../shared/Pagination/Pagination.jsx";

const Recommendations = () => {
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) > 0 ? Number(searchParams.get('page')) : 1;
    const {data, isLoading} = useGetRecommendationsQuery({page});

    return (
        isLoading ? <Loader/> :
            <div className="w-full pl-20 pr-20">
                <div className="space-y-6">
                    {data.results.map((vacancy, index) => (
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
                <Pagination count={data.count}/>
            </div>
    );
};

export default Recommendations;

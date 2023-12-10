import {useEffect, useState} from "react";
import Loader from "../../Loader/Loader.jsx";
import {useParams} from "react-router-dom";
import {useGetCandidateByIdQuery} from "../../../redux/slices/userSlice.js";

const CandidateProfile = () => {
    const {id} = useParams()
    const {data: profile, isLoading} = useGetCandidateByIdQuery(id)

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [position, setPosition] = useState("");
    const [category, setCategory] = useState("");
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState(0);
    const [salary, setSalary] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [github, setGithub] = useState("");
    const [about, setAbout] = useState("");

    useEffect(() => {
        if (profile) {
            setFirstName(profile.user.first_name);
            setLastName(profile.user.last_name);
            setPosition(profile.position);
            setCategory(profile.category.name);
            setSkills(profile.skills.map(skill => skill.name).join(", "));
            setExperience(profile.experience);
            setSalary(profile.salary);
            setCountry(profile.country);
            setCity(profile.city);
            setPhone(profile.phone);
            setLinkedin(profile.linkedin);
            setGithub(profile.github);
            setAbout(profile.about);
        }
    }, [profile, isLoading]);

    return (
        isLoading ? <Loader/> :
            <div className="bg-gray-100">
                <div className="max-w-lg mx-auto my-10 bg-white rounded-lg shadow-md p-5">
                    <img className="w-32 h-32 rounded-full mx-auto" src="https://picsum.photos/200"
                         alt="Profile picture"/>
                    <h2 className="text-center text-2xl font-semibold mt-3">{firstName} {lastName}</h2>
                    { position &&
                        <p className="text-center text-gray-600 mt-1">{position}, {category}</p>
                    }
                    <p className="text-center text-gray-600 mt-1">{skills}</p>
                    <p className="text-center text-gray-600 mt-1">{experience} years of experience</p>
                    <p className="text-center text-gray-600 mt-1">Salary Expectations: ${salary}</p>
                    <p className="text-center text-gray-600 mt-1">Location: {city}, {country} </p>
                    <p className="text-center text-gray-600 mt-1">Phone: {phone}</p>
                    <div className="flex justify-center mt-5">
                        <a href={linkedin} className="text-blue-500 hover:text-blue-700 mx-3">LinkedIn</a>
                        <a href={github} className="text-blue-500 hover:text-blue-700 mx-3">GitHub</a>
                    </div>
                    <div className="mt-5">
                        <h3 className="text-xl font-semibold">About</h3>
                        <p className="text-gray-600 mt-2">{about}</p>
                    </div>
                </div>
            </div>
    );
};

export default CandidateProfile;
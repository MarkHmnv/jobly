import {useEffect, useState} from "react";
import Loader from "../../Loader/Loader.jsx";
import {useParams} from "react-router-dom";
import {useGetCandidateByIdQuery} from "../../../redux/slices/userSlice.js";

const CandidateProfile = () => {
    const {id} = useParams()
    const {data: profile, isLoading} = useGetCandidateByIdQuery(id)

    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
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
            setEmail(profile.user.email);
            setLastName(profile.user.last_name);
            setPosition(profile.position);
            setCategory(profile.category?.name);
            setSkills(profile.skills.map(skill => skill?.name).join(", "));
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
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex flex-col md:flex-row gap-6 my-6 p-4">
                    <div className="md:w-1/3 flex justify-center">
                        <img
                            alt="Candidate"
                            className="rounded-full h-48 w-48 border-4 border-blue-500"
                            height="192"
                            src="/placeholder.svg"
                            style={{
                                aspectRatio: "192/192",
                                objectFit: "cover",
                            }}
                            width="192"
                        />
                    </div>
                    <div className="md:w-2/3">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-black-500">{firstName} {lastName}</h2>
                        </div>
                        <div>
                            {email && <p className="text-sm text-gray-500">{email}</p>}
                            {phone && <p className="text-sm text-gray-500">{phone}</p>}
                            {position &&
                                <p className="mt-4 text-gray-700">
                                    <strong>Position:</strong> {position}
                                </p>
                            }
                            {category &&
                                <p className="text-gray-700">
                                    <strong>Category:</strong> {category}
                                </p>
                            }
                            {skills &&
                                <p className="text-gray-700">
                                    <strong>Skills:</strong> {skills}
                                </p>
                            }
                            {experience &&
                                <p className="text-gray-700">
                                    <strong>Experience:</strong> {experience} years
                                </p>
                            }
                            {salary &&
                                <p className="text-gray-700">
                                    <strong>Salary:</strong> ${salary}
                                </p>
                            }
                            {country &&
                                <p className="text-gray-700">
                                    <strong>Country:</strong> {country}
                                </p>
                            }
                            {city &&
                                <p className="text-gray-700">
                                    <strong>City:</strong> {city}
                                </p>
                            }
                            {linkedin &&
                                <p className="text-gray-700">
                                    <strong>LinkedIn:</strong> {linkedin}
                                </p>
                            }
                            {github &&
                                <p className="text-gray-700">
                                    <strong>Github:</strong> {github}
                                </p>
                            }
                            {about &&
                                <p className="text-gray-700">
                                    <strong>About:</strong> {about}
                                </p>
                            }
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default CandidateProfile;
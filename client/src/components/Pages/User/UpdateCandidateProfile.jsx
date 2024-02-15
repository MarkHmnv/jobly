import {useGetCandidateProfileQuery, useUpdateCandidateProfileMutation} from "../../../redux/slices/userSlice.js";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {updateName} from "../../../redux/slices/authSlice.js";
import Loader from "../../shared/Loader/Loader.jsx";
import Input from "../../shared/Input/Input.jsx";
import TextArea from "../../shared/TextArea/TextArea.jsx";
import CountrySelect from "../../shared/Select/CountrySelect.jsx";
import CategorySelect from "../../shared/Select/CategorySelect.jsx";
import {toastError} from "../../../util/toastUtil.jsx";
import {toast} from "react-toastify";


const UpdateCandidateProfile = () => {
    const dispatch = useDispatch()
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

    const {data: profile, isLoading} = useGetCandidateProfileQuery();
    const [updateCandidateProfile, {isLoading: isUpdating}] = useUpdateCandidateProfileMutation();


    useEffect(() => {
        if (profile) {
            setFirstName(profile.user.first_name);
            setEmail(profile.user.email);
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

    const submitUpdate = async (e) => {
        e.preventDefault();

        let skillsArray = skills.split(",").map(skill => ({name: skill.trim()}))

        try {
            const res = await updateCandidateProfile({
                "user": {
                    first_name: firstName,
                    last_name: lastName,
                },
                position,
                "category": {
                    "name": category
                },
                skills: skillsArray,
                experience,
                salary,
                country,
                city,
                phone,
                linkedin,
                github,
                about
            }).unwrap()
            dispatch(updateName(res.user.first_name + " " + res.user.last_name))
            toast.success("Profile updated")
        } catch (error) {
            toastError(error)
        }
    }

    return (
        <form className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8" onSubmit={submitUpdate}>
            <div className="space-y-12">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        This information will be displayed publicly so be careful what you share.
                    </p>

                    <div className="border-b border-gray-900/10 pb-12">

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <Input label="First name" value={firstName} setValue={setFirstName} type="text"/>
                            <Input label="Last name" value={lastName} setValue={setLastName} type="text"/>

                            <Input label="Email address" value={email} setValue={setEmail} type="email"/>
                            <Input label="Phone number" value={phone} setValue={setPhone} type="text"/>

                            <CountrySelect currentCountry={country} setCountry={setCountry}/>
                            <Input label="City" value={city} setValue={setCity} type="text"/>
                        </div>
                    </div>
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <Input label="Position" value={position} setValue={setPosition} type="text"/>
                            <CategorySelect value={category} setValue={setCategory}/>

                            <Input label="Expirience" value={experience} setValue={setExperience} type="number"/>
                            <Input label="Salary expectations" value={salary} setValue={setSalary} type="text"/>

                            <Input label="LinkedIn" value={linkedin} setValue={setLinkedin} type="text"/>
                            <Input label="GitHub" value={github} setValue={setGithub} type="text"/>
                        </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                        <TextArea label="About" value={about} setValue={setAbout}/>
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
                    Save
                </button>
            </div>
        </form>
    );
};

export default UpdateCandidateProfile;
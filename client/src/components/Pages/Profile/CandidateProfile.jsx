import {useGetCandidateProfileQuery} from "../../../redux/slices/userSlice.js";
import {useEffect, useState} from "react";


const Input = ({label, value, setValue, type, name}) => {
    return (
        <div className="sm:col-span-3">
            <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    type={type}
                    name={name}
                    id={name}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
            </div>
        </div>
    )
}

const TextArea = ({label, value, setValue}) => {
    return (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                    {label}
                </label>
                <div className="mt-2">
                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
            </div>
        </div>
    )
}

const CandidateProfile = () => {
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


    useEffect(() => {
        if (profile) {
            setFirstName(profile.user.first_name);
            setEmail(profile.user.email);
            setLastName(profile.user.last_name);
            setPosition(profile.position);
            setCategory(profile.category);
            setSkills(profile.skills);
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

    const updateCandidateProfile = (e) => {
        e.preventDefault();
    }

    return (
        <form className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8" onSubmit={updateCandidateProfile}>
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

                            <div className="sm:col-span-3">
                                <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                    Country
                                </label>
                                <div className="mt-2">
                                    <select
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        id="country"
                                        name="country"
                                        autoComplete="country-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>Mexico</option>
                                    </select>
                                </div>
                            </div>
                            <Input label="City" value={city} setValue={setCity} type="text"/>
                        </div>
                    </div>
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <Input label="Position" value={position} setValue={setPosition} type="text"/>
                            <Input label="Category" value={category} setValue={setCategory} type="text"/>

                            <Input label="Expirience" value={experience} setValue={setExperience} type="text"/>
                            <Input label="Salary expectations" value={salary} setValue={setSalary} type="text"/>

                            <Input label="LinkedIn" value={linkedin} setValue={setLinkedin} type="text"/>
                            <Input label="GitHub" value={github} setValue={setGithub} type="text"/>
                        </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                        <TextArea label="About" value={about} setValue={setAbout} name="about"/>
                    </div>
                    <div className="border-b border-gray-900/10 pb-12">
                        <TextArea label="Skills" value={skills} setValue={setSkills} name="skills"/>
                    </div>

                </div>


            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6 pb-12">
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

export default CandidateProfile;
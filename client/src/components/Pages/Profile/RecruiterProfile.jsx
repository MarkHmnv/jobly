import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {useGetRecruiterProfileQuery, useUpdateRecruiterProfileMutation} from "../../../redux/slices/userSlice.js";
import {updateName} from "../../../redux/slices/authSlice.js";
import Input from "./Input.jsx";
import TextArea from "./TextArea.jsx";
import Loader from "../../Loader/Loader.jsx";
import CountrySelect from "./CountrySelect.jsx";

const RecruiterProfile = () => {
    const dispatch = useDispatch()
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [lastName, setLastName] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [about, setAbout] = useState("");

    const {data: profile, isLoading} = useGetRecruiterProfileQuery();
    const [updateRecruitereProfile, {isLoading: isUpdating}] = useUpdateRecruiterProfileMutation();

    useEffect(() => {
        if (profile) {
            setFirstName(profile.user.first_name);
            setEmail(profile.user.email);
            setLastName(profile.user.last_name);
            setCountry(profile.country);
            setCity(profile.city);
            setAbout(profile.about);
        }
    }, [profile, isLoading]);

    const submitUpdate = async (e) => {
        e.preventDefault();

        try {
            const res = await updateRecruitereProfile({
                "user": {
                    first_name: firstName,
                    last_name: lastName,
                },
                country,
                city,
                about
            }).unwrap()
            dispatch(updateName(res.user.first_name + " " + res.user.last_name))
        } catch (error) {
            console.log(error)
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

                            <Input label="Email address" value={email} setValue={setEmail} type="email"
                                   colSpan={4}/>

                            <CountrySelect currentCountry={country} setCountry={setCountry}/>
                            <Input label="City" value={city} setValue={setCity} type="text"/>
                        </div>
                    </div>
                    <div className="border-b border-gray-900/10 pb-12">
                        <TextArea label="About" value={about} setValue={setAbout} name="about"/>
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

export default RecruiterProfile;

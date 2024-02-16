import {COUNTRIES_URL} from "../../../util/constants.js";
import {useEffect, useState} from "react";

const retrieveCountries = async () => {
    const res = await fetch(COUNTRIES_URL);
    return await res.json();
}

const CountrySelect = ({currentCountry, setCountry}) => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const getCountries = async () => {
            const data = await retrieveCountries();
            data.sort((a, b) => a.name.common.localeCompare(b.name.common));
            setCountries(data);
        };
        getCountries();
    }, []);

    return (
        <div className="sm:col-span-3">
            <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                Country
            </label>
            <div className="mt-2">
                <select
                    value={currentCountry ?? ''}
                    onChange={e => setCountry(e.target.value)}
                    id="country"
                    autoComplete="country-name"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                    <option value="">Select a country</option>
                    {countries.map((country, index) => (
                        <option key={index} value={country.name.common}>
                            {country.name.common}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default CountrySelect;

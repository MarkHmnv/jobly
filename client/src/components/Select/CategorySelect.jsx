import {useGetCategoriesQuery} from "../../redux/slices/sharedSlice.js";
import Loader from "../Loader/Loader.jsx";

const CategorySelect = ({value, setValue}) => {
    const {data: categories, isLoading} = useGetCategoriesQuery();

    return (
        isLoading ? <Loader /> :
            <div className="sm:col-span-3">
                <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                    Category
                </label>
                <div className="mt-2">
                    <select
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        id="country"
                        autoComplete="country-name"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
    );
};

export default CategorySelect;

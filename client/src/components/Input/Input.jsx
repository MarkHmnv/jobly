
const Input = ({label, value, setValue, type, colSpan}) => {
    return (
        <div className={colSpan ? `sm:col-span-${colSpan}` : "sm:col-span-3"}>
            <label htmlFor={label} className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    type={type}
                    min="0"
                    max="20"
                    id={label}
                    autoComplete="given-name"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
            </div>
        </div>
    )
};

export default Input;

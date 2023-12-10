const VacancyFilter = () => {
    return (
        <div className="w-72 p-4 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Filter by:</h2>
            <div className="mb-4">
                <label className="text-sm font-bold mb-2">Skills</label>
                <input type="text" placeholder="Enter Skills" className="w-full p-2 border border-gray-300 rounded"/>
            </div>
            <div className="mb-4">
                <label className="text-sm font-bold mb-2">Category</label>
                <select className="w-full p-2 border border-gray-300 rounded">
                    <option>Select Category</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="text-sm font-bold mb-2">Salary</label>
                <input type="number" placeholder="Enter Salary" className="w-full p-2 border border-gray-300 rounded"/>
            </div>
            <button className="py-2 px-4 bg-blue-500 text-white rounded font-medium">Apply Filters</button>
        </div>
    );
}

export default VacancyFilter;
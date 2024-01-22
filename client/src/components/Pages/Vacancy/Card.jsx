const Card = ({title, city, country, experience, salary, description, createdAt, quality, skills}) => {
    const formatDate = (date) => {
        const options = {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
        return new Date(date).toLocaleDateString('en-US', options);
    }

    const formatQuality = (quality) => {
        const percentage = Math.floor(quality * 100);

        const red = Math.floor(255 * (1 - quality));
        const green = Math.floor(255 * quality);
        const color = `rgb(${red}, ${green}, 0)`;

        return <span style={{color}}>Quality: {percentage}%</span>
    };

    return (
        <div className="border rounded-lg shadow-sm bg-white p-4 md:p-6 mb-4">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h2 className="text-2xl leading-6 font-medium space-y-1">
                        {title}
                    </h2>
                    <div className="text-gray-700">
                        <p>{city}, {country}{' · '}{experience} years of experience</p>
                        {salary && <p className="text-green-700">${salary}</p>}
                        <p className="text-gray-500">{description}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(createdAt)}</p>
                    {quality && <p className="text-sm text-gray-500 dark:text-gray-400">{formatQuality(quality)}</p>}
                </div>
            </div>
            <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Skills:</span>
                {skills.map((skill, index) => (
                    <span key={index}
                          className="text-sm bg-gray-200 px-2 py-1 rounded-full">{skill.name}</span>
                ))}
            </div>
        </div>
    );
}

export default Card;

const UserCard = ({ name, position, image, about }) => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center p-5 text-center bg-white shadow-lg rounded-xl w-80">
                <div className="w-32 h-32">
                    <img
                        className="w-full h-full rounded-full"
                        src="https://source.unsplash.com/random"
                        alt="CandidateProfile"
                    />
                </div>
                <div>
                    <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                    <p className="text-gray-600">Software Developer</p>
                    <p className="mt-3 text-xs text-gray-500">
                        Passionate about computer science, technology and coding.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserCard;

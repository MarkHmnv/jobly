import {UserCircleIcon} from "@heroicons/react/24/solid/index.js";
import {toast} from "react-toastify";
import {toastError} from "../../util/toastUtil.jsx";
import {useState} from "react";
import {useDeleteImageMutation, useUploadImageMutation} from "../../redux/slices/sharedSlice.js";

const ImageUpload = ({image, setImage}) => {
    const [uploadProfileImage] = useUploadImageMutation();
    const [deleteProfileImage] = useDeleteImageMutation();
    const [selectedImage, setSelectedImage] = useState(null);

    const handleSelectImage = (event) => {
        setSelectedImage(event.target.files[0]);
        toast.success("Profile image selected")
    }

    const uploadImage = async () => {
        if (!selectedImage) return;
        try {
            const formData = new FormData();
            formData.append("image", selectedImage);
            const res = await uploadProfileImage(formData).unwrap();
            setImage(res.image)
            console.log(selectedImage)
            toast.success("Profile image uploaded")
        } catch (error) {
            toastError(error)
        }
    }

    const deleteImage = async () => {
        if (!image) return;
        try {
            await deleteProfileImage({});
            setImage(null)
            toast.success("Profile image deleted")
        } catch (error) {
            toastError(error)
        }
    }

    return (
        <div className="col-span-full mt-10">
            <label className="block text-sm font-medium leading-6 text-gray-900">
                Photo
            </label>
            <div className="mt-2 flex items-center gap-x-3">
                <label htmlFor="fileInput" className="cursor-pointer">
                    {image ? <img src={image} className="h-20 w-20 rounded-full object-cover" alt="image"/> :
                        <UserCircleIcon className="h-20 w-20 text-gray-300" aria-hidden="true"/>}
                </label>
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSelectImage}
                />
                <button
                    type="button"
                    onClick={uploadImage}
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Upload photo
                </button>
                <button
                    type="button"
                    onClick={deleteImage}
                    className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                    Delete photo
                </button>
            </div>
        </div>
    );
};

export default ImageUpload;
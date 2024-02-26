import {apiSlice} from "./apiSlice.js";
import {CATEGORIES_URL, SKILLS_URL, UPLOAD_IMAGE_URL} from "../../util/constants.js";

export const sharedSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => CATEGORIES_URL,
        }),
        getSkills: builder.query({
            query: () => SKILLS_URL,
        }),
        uploadImage: builder.mutation({
            query: (formData) => ({
                url: UPLOAD_IMAGE_URL,
                method: 'POST',
                body: formData
            })
        }),
        deleteImage: builder.mutation({
            query: () => ({
                url: UPLOAD_IMAGE_URL,
                method: 'DELETE'
            })
        })
    }),
})

export const {
    useGetCategoriesQuery,
    useGetSkillsQuery,
    useUploadImageMutation,
    useDeleteImageMutation
} = sharedSlice
import {apiSlice} from "./apiSlice.js";
import {CATEGORIES_URL, SKILLS_URL} from "../../util/constants.js";

export const sharedSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => CATEGORIES_URL,
        }),
        getSkills: builder.query({
            query: () => SKILLS_URL,
        })
    }),
})

export const {
    useGetCategoriesQuery,
    useGetSkillsQuery
} = sharedSlice
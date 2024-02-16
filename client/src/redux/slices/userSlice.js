import {apiSlice} from "./apiSlice";
import {CANDIDATES_URL, RECRUITERS_URL} from "../../util/constants";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCandidateProfile: builder.query({
            query: () => `${CANDIDATES_URL}me/`
        }),
        updateCandidateProfile: builder.mutation({
            query: (updateRequest) => ({
                url: `${CANDIDATES_URL}me/`,
                method: "PATCH",
                body: updateRequest
            })
        }),
        deleteCandidateProfile: builder.mutation({
            query: () => ({
                url: `${CANDIDATES_URL}me/`,
                method: "DELETE"
            })
        }),
        getRecruiterProfile: builder.query({
            query: () => `${RECRUITERS_URL}me/`
        }),
        updateRecruiterProfile: builder.mutation({
            query: (updateRequest) => ({
                url: `${RECRUITERS_URL}me/`,
                method: "PATCH",
                body: updateRequest
            })
        }),
        deleteRecruiterProfile: builder.mutation({
            query: () => ({
                url: `${RECRUITERS_URL}me/`,
                method: "DELETE"
            })
        }),
        getAllCandidates: builder.query({
            query: ({page}) => `${CANDIDATES_URL}list/?page=${page}`
        }),
        getCandidateById: builder.query({
            query: (id) => `${CANDIDATES_URL}${id}/`
        })
    })
});

export const {
    useGetCandidateProfileQuery,
    useUpdateCandidateProfileMutation,
    useGetRecruiterProfileQuery,
    useUpdateRecruiterProfileMutation,
    useGetAllCandidatesQuery,
    useGetCandidateByIdQuery,
    useDeleteCandidateProfileMutation,
    useDeleteRecruiterProfileMutation
} = usersApiSlice;
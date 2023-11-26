import {apiSlice} from "./apiSlice";
import {CANDIDATES_URL, RECRUITERS_URL} from "../../util/constants";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCandidateProfile: builder.query({
            query: () => `${CANDIDATES_URL}/me/`
        }),
        getRecruiterProfile: builder.query({
            query: () => `${RECRUITERS_URL}/me/`
        }),
        updateCandidateProfile: builder.mutation({
            query: (updateRequest) => ({
                url: `${CANDIDATES_URL}/me/`,
                method: "PATCH",
                body: updateRequest
            })
        }),
        updateRecruiterProfile: builder.mutation({
            query: (updateRequest) => ({
                url: `${RECRUITERS_URL}/me/`,
                method: "PATCH",
                body: updateRequest
            })
        })
    })
});

export const {useGetCandidateProfileQuery, useUpdateCandidateProfileMutation} = usersApiSlice;
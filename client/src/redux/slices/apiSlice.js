import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL, REFRESH_TOKEN} from "../../util/constants";
import {removeCredentials, resetCredentials} from "./authSlice.js";

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        const refreshResult = await fetch(REFRESH_TOKEN, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
        })

        if (refreshResult.ok) {
            const refreshTokenResult = await refreshResult.json()
            api.dispatch(resetCredentials(refreshTokenResult))
            return baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(removeCredentials())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ["Candidate", "Recruiter", "Vacancy"],
    endpoints: () => ({})
})
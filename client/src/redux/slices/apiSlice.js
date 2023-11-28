import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL, REFRESH_TOKEN} from "../../util/constants";
import {removeCredentials, resetCredentials} from "./authSlice.js";
import {Mutex} from "async-mutex";

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, {getState}) => {
        const token = getState().auth.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
})

const mutex = new Mutex();

const baseQueryWithReauth = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            const refreshToken = api.getState().auth.refreshToken;

            try {
                const refreshResult = await baseQuery(
                    {
                        url: REFRESH_TOKEN,
                        method: 'POST',
                        body: {refresh: refreshToken},
                    },
                    api,
                    extraOptions,
                );

                if (refreshResult.data) {
                    api.dispatch(resetCredentials(refreshResult.data));
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    console.log('refresh error', refreshResult.error);
                    api.dispatch(removeCredentials());
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Candidate", "Recruiter", "Vacancy"],
    endpoints: () => ({})
})
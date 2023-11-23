import {createSlice} from "@reduxjs/toolkit";
import {apiSlice} from "./apiSlice.js";
import {CANDIDATES_URL, GET_ACCESS_TOKEN, RECRUITERS_URL} from "../../util/constants.js";

const getItemOrNull = (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

const initialState = {
    tokens: getItemOrNull("tokens"),
    user: getItemOrNull("user")
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const {user, tokens} = action.payload
            state.user = user
            state.accessToken = tokens.access
            state.refreshToken = tokens.refresh
            localStorage.setItem("accessToken", JSON.stringify(state.accessToken))
            localStorage.setItem("refreshToken", JSON.stringify(state.refreshToken))
            localStorage.setItem("user", JSON.stringify(user))
        },
        resetCredentials: (state, action) => {
            const {access, refresh} = action.payload
            state.accessToken = access
            state.refreshToken = refresh
            localStorage.setItem("accessToken", JSON.stringify(state.accessToken))
            localStorage.setItem("refreshToken", JSON.stringify(state.refreshToken))
        },
        removeCredentials: (state) => {
            state.accessToken = null
            state.refreshToken = null
            state.user = null
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("user")
        },
    }
})

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        registerCandidate: builder.mutation({
            query: (registerRequest) => ({
                url: CANDIDATES_URL,
                method: "POST",
                body: registerRequest
            })
        }),
        registerRecruiter: builder.mutation({
            query: (registerRequest) => ({
                url: RECRUITERS_URL,
                method: "POST",
                body: registerRequest
            })
        }),
        signIn: builder.mutation({
            query: (signInRequest) => ({
                url: GET_ACCESS_TOKEN,
                method: "POST",
                body: signInRequest
            })
        }),
    })
})

export const {setCredentials, resetCredentials, removeCredentials} = authSlice.actions
export const {useRegisterCandidateMutation, useRegisterRecruiterMutation, useSignInMutation} = authApiSlice
export default authSlice.reducer
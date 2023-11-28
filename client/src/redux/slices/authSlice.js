import {createSlice} from "@reduxjs/toolkit";
import {apiSlice} from "./apiSlice.js";
import {CANDIDATES_URL, GET_ACCESS_TOKEN, RECRUITERS_URL} from "../../util/constants.js";
import {parseJwt} from "../../util/jwt.js";

const getItemOrNull = (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

const initialState = {
    accessToken: getItemOrNull("accessToken"),
    refreshToken: getItemOrNull("refreshToken"),
    username: getItemOrNull("username")
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const {user, tokens} = action.payload
            state.username = user.first_name + " " + user.last_name
            state.accessToken = tokens.access
            state.refreshToken = tokens.refresh
            localStorage.setItem("accessToken", JSON.stringify(state.accessToken))
            localStorage.setItem("refreshToken", JSON.stringify(state.refreshToken))
            localStorage.setItem("username", JSON.stringify(state.username))
        },
        resetCredentials: (state, action) => {
            const {access, refresh} = action.payload
            state.accessToken = access
            state.refreshToken = refresh
            state.username = parseJwt(access).name
            localStorage.setItem("accessToken", JSON.stringify(state.accessToken))
            localStorage.setItem("refreshToken", JSON.stringify(state.refreshToken))
            localStorage.setItem("username", JSON.stringify(state.username))
        },
        removeCredentials: (state) => {
            state.accessToken = null
            state.refreshToken = null
            state.username = null
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("username")
        },
        updateName: (state, action) => {
            state.username = action.payload
            localStorage.setItem("username", JSON.stringify(state.username))
        }
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

export const {setCredentials, resetCredentials, removeCredentials, updateName} = authSlice.actions
export const {useRegisterCandidateMutation, useRegisterRecruiterMutation, useSignInMutation} = authApiSlice
export default authSlice.reducer
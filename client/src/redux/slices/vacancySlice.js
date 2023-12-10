import {apiSlice} from "./apiSlice.js";
import {VACANCIES_URL} from "../../util/constants.js";

export const vacancySlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllVacancies: builder.query({
            query: () => VACANCIES_URL
        }),
        getVacancy: builder.query({
            query: (id) => `${VACANCIES_URL}${id}/`
        }),
        createVacancy: builder.mutation({
            query: (vacancy) => ({
                url: VACANCIES_URL,
                method: "POST",
                body: vacancy
            })
        }),
        updateVacancy: builder.mutation({
            query: ({vacancy, id}) => ({
                url: `${VACANCIES_URL}${id}/`,
                method: "PATCH",
                body: vacancy
            })
        })
    })
});

export const {
    useGetAllVacanciesQuery,
    useGetVacancyQuery,
    useCreateVacancyMutation,
    useUpdateVacancyMutation
} = vacancySlice
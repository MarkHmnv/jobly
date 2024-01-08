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
        }),
        applyForVacancy: builder.mutation({
            query: ({coverLetter, id}) => ({
                url: `${VACANCIES_URL}${id}/apply/`,
                method: "POST",
                body: coverLetter
            })
        }),
        getVacancyApplications: builder.query({
            query: (id) => `${VACANCIES_URL}${id}/applications/`
        })
    })
});

export const {
    useGetAllVacanciesQuery,
    useGetVacancyQuery,
    useCreateVacancyMutation,
    useUpdateVacancyMutation,
    useApplyForVacancyMutation,
    useGetVacancyApplicationsQuery
} = vacancySlice
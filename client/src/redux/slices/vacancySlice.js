import {apiSlice} from "./apiSlice.js";
import {VACANCIES_URL} from "../../util/constants.js";

export const vacancySlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllVacancies: builder.query({
            query: ({skills, category, salary}) => {
                let queryParameters = '';

                if (skills) {
                    queryParameters += `skills__name__in=${skills}&`;
                }

                if (category) {
                    queryParameters += `category__name=${category}&`;
                }

                if (salary) {
                    queryParameters += `salary=${salary}&`;
                }

                // Remove trailing '&' if there are parameters
                queryParameters = queryParameters.slice(0, -1);

                return `${VACANCIES_URL}?${queryParameters}`;
            }
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
            query: ({id, sort_by, reverse}) =>
                `${VACANCIES_URL}${id}/applications?sort_by=${sort_by}&reverse=${reverse}`
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
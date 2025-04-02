// import Cookies from "js-cookie";
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import Cookies from "js-cookie";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://qavocodes-001-site1.qtempurl.com/api/',
        prepareHeaders: (headers) => {
            const token = Cookies.get('qavoCodesToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAllProject: builder.query({
            query: () => ({
                url: `/Project/get-all-projects`,
            }),
        }),
        getProjectById: builder.query({
            query: (id) => ({
                url: `/Project/get-project-by-id/${id}`,
            }),
        }),
        postAdminLogin: builder.mutation({
            query: (data) => ({
                url: `/Admin/login`,
                method: 'POST',
                body: (data),
                headers: {"Content-Type": "application/json"},
            }),
        }),
        getAllProjectsOfCodes: builder.query({
            query: () => ({
                url: `/Project/get-all-projects-of-codes`,
            }),
        }),
        getAllProjectsOfAgency: builder.query({
            query: () => ({
                url: `/Project/get-all-projects-of-agency`,
            }),
        }),
        postReOrderProject: builder.mutation({
            query: (data) => ({
                url: `/Project/replace-project`,
                method: 'PUT',
                body: (data),
                headers: {"Content-Type": "application/json"},
            }),
        }),
        getAllTeamMembers: builder.query({
            query: () => ({
                url: `/OurTeam/get-all-our-teams`,
            }),
        }),
    }),
})
export const {
    useGetAllProjectQuery,
    useGetProjectByIdQuery,
    usePostAdminLoginMutation,
    useGetAllProjectsOfCodesQuery,
    usePostReOrderProjectMutation,
    useGetAllTeamMembersQuery,
    useGetAllProjectsOfAgencyQuery,
} = userApi
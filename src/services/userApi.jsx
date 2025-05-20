// import Cookies from "js-cookie";
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import Cookies from "js-cookie";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.qavo.az/api/',
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
        getAllProjectsOfAcademy: builder.query({
            query: () => ({
                url: `/Project/get-all-projects-of-academy`,
            }),
        }),
        postProjects: builder.mutation({
            query: (data) => ({
                url: `/Project/create-project`,
                method: 'POST',
                body: (data),
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
        updateTeamMembers: builder.mutation({
            query: (data) => ({
                url: `/OurTeam/update-our-team`,
                method: 'PUT',
                body: (data),
            }),
        }),
        reOrderTeamMembers: builder.mutation({
            query: (data) => ({
                url: `/OurTeam/replace-our-team`,
                method: 'PUT',
                body: (data),
            }),
        }),
        deleteTeamMember: builder.mutation({
            query: (id) => ({
                url: `/OurTeam/delete-our-team/${id}`,
                method: 'DELETE',
            }),
        }),
        postUpdateProject: builder.mutation({
            query: (data) => ({
                url: `/Project/update-project`,
                method: 'PUT',
                body: (data),
            }),
        }),
        postTeamMember: builder.mutation({
            query: (data) => ({
                url: `/OurTeam/create-our-team`,
                method: 'POST',
                body: (data),
            }),
        }),
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/Project/delete-project/${id}`,
                method: 'DELETE',
            }),
        }),
        postSpinUser: builder.mutation({
            query: (data) => ({
                url: `/SpinUsers`,
                method: 'POST',
                body: (data),
            }),
        }),
        getAllSpinUser: builder.query({
            query: () => ({
                url: `/SpinUsers`,
            }),
        }),
        editSpinUser: builder.query({
            query: () => ({
                url: `/SpinUsers`,
            }),
        }),
        spinMarkAsRead: builder.mutation({
            query: (id) => ({
                url: `/SpinUsers?id=${id}`,
                method: 'PUT',
            })
        })
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
    usePostProjectsMutation,
    usePostUpdateProjectMutation,
    useDeleteProjectMutation,
    useGetAllProjectsOfAcademyQuery,
    useUpdateTeamMembersMutation,
    useDeleteTeamMemberMutation,
    useReOrderTeamMembersMutation,
    usePostTeamMemberMutation,
    usePostSpinUserMutation,
    useGetAllSpinUserQuery,
    useSpinMarkAsReadMutation
} = userApi
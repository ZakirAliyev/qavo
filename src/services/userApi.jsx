// import Cookies from "js-cookie";
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://qavocodes-001-site1.qtempurl.com/api/',
        // prepareHeaders: (headers) => {
        //     const token = Cookies.get('');
        //     if (token) {
        //         headers.set('Authorization', `Bearer ${token}`);
        //     }
        //     return headers;
        // },
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
    }),
})
export const {
    useGetAllProjectQuery,
    useGetProjectByIdQuery,
} = userApi
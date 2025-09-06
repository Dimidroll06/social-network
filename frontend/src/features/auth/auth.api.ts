import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithToken } from '../../app/api';
import type { User, CreateUserDto, LoginDto } from '../../entities/user';
import type { AccessToken } from '../../entities/tokens';
import type { ServerMessage } from '../../entities/server';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithToken,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<AccessToken, LoginDto>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<ServerMessage, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<CreateUserDto, ServerMessage>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query<User, void>({
      query: () => ({
        url: '/auth/me',
        method: 'POST',
      }),
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetMeQuery,
} = authApi;

/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export const $api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

type RequestParams = {
  url: string;
  method: string;
  data?: any;
  params?: any;
  headers?: any;
  formData?: boolean;
};

export interface SerializedError {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
}

export const isErrorWithMessage = (
  error: unknown,
): error is { message: string } => {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
};

export interface BaseQueryWithTokenError {
  status: number;
  data: object | string;
}

export const isBaseQueryWithTokenError = (
  error: unknown,
): error is BaseQueryWithTokenError => {
  return (
    typeof error === 'object' &&
    error != null &&
    'status' in error &&
    typeof (error as any).status === 'number' &&
    'data' in error &&
    (typeof (error as any).data === 'object' ||
      typeof (error as any).data === 'string')
  );
};

export const baseQueryWithToken = async (req: RequestParams) => {
  const { url, method, data, params } = req;

  const isFormData = req.formData === true;

  try {
    const token = localStorage.getItem('token');
    const headers = token ? { authorization: `Bearer ${token}` } : {};

    let requestData = data;

    if (isFormData && data instanceof Object && !(data instanceof FormData)) {
      const fd = new FormData();
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          if (value instanceof FileList) {
            for (let i = 0; i < value.length; i++) {
              fd.append(key, value[i]);
            }
          } else {
            fd.append(key, value);
          }
        }
      }
      requestData = fd;
    }

    const res = await $api({
      url,
      method,
      data: requestData,
      params,
      headers,
    });

    return { data: res.data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        try {
          const refreshRes = await $api.post('/auth/refresh', {
            withCredentials: true,
          });

          if (refreshRes.data?.accessToken) {
            const newToken = refreshRes.data.accessToken;
            localStorage.setItem('token', newToken);

            const retryRes = await $api({
              url,
              method,
              data,
              params,
              headers: {
                authorization: `Bearer ${newToken}`,
              },
            });

            return { data: retryRes.data };
          }
        } catch (error) {
          console.error('Не авторизован', error);
        }
      }

      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }

    console.error('Неизвестная ошибка', error);
    return {
      error: {
        status: 500,
        data: 'Something went wrong',
      },
    };
  }
};

import { getConfig } from '../../src/config';
import { AxiosRequestConfig } from 'axios';

export const token = getConfig('TOKEN');
export const authorizationHeader = 'Bearer ' + token;

export const axiosConfigDefaults: AxiosRequestConfig = {
  validateStatus: () => true,
};

// urls
export const baseUrl = process.env.URL || 'http://localhost:3000';
export const apiUrl = `${baseUrl}/api/v1`;
export const authUrl = `${apiUrl}/auth`;

// resources
export const resources = ['videomateri', 'videos', 'puskesmas', 'users'];
export const allMethodsResources = resources.filter((res) => res != 'users');
export const uploadPaths = [];

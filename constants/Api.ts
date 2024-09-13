import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PUBLIC_BASE_URL = 'http://localhost:8080/api/public';
const PRIVATE_BASE_URL = 'http://localhost:8080/api/private';

class ApiClient {
    private readonly publicClient: AxiosInstance;
    private readonly privateClient: AxiosInstance;

    constructor() {
        this.publicClient = axios.create({
            baseURL: PUBLIC_BASE_URL,
        });

        this.privateClient = axios.create({
            baseURL: PRIVATE_BASE_URL,
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.privateClient.interceptors.request.use(
            async (config) => {
                const token = await AsyncStorage.getItem('access_token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.privateClient.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const refreshToken = await AsyncStorage.getItem('refresh_token');
                        const response = await this.publicClient.post('/auth/refresh', { refreshToken });
                        const { accessToken } = response.data;
                        await AsyncStorage.setItem('access_token', accessToken);
                        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                        return this.privateClient(originalRequest);
                    } catch (refreshError) {
                        // Handle refresh token failure (e.g., logout user)
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    public async get<T>(url: string, config?: AxiosRequestConfig, isPublic: boolean = false) {
        const client = isPublic ? this.publicClient : this.privateClient;
        return client.get<T>(url, config);
    }

    public async post(url: string, data?: any, config?: AxiosRequestConfig, isPublic: boolean = false) {
        const client = isPublic ? this.publicClient : this.privateClient;
        return client.post(url, data, config);
    }

    public async put(url: string, data?: any, config?: AxiosRequestConfig, isPublic: boolean = false) {
        const client = isPublic ? this.publicClient : this.privateClient;
        return client.put(url, data, config);
    }

    public async delete(url: string, config?: AxiosRequestConfig, isPublic: boolean = false) {
        const client = isPublic ? this.publicClient : this.privateClient;
        return client.delete(url, config);
    }
}

const api = new ApiClient();
export default api;
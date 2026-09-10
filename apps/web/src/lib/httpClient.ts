import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { authClient } from './auth-client';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
  success: boolean;
}

class HttpClient {
  private instance: AxiosInstance;

  constructor(baseUrl?: string) {
    this.instance = axios.create({
      baseURL:
        baseUrl ||
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:3000/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }
  private setupInterceptors() {
    this.instance.interceptors.request.use(
      async (config) => {
        if (typeof window !== 'undefined') {
          const { data: session } = authClient.getSession();

          if (session) {
            config.headers.Authorization = `Bearer ${session.user.id}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        console.error('❌ API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      },
    );
  }
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }
  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

export const httpClient = new HttpClient();
export default HttpClient;

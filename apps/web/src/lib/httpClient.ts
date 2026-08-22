import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

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
    });

    this.setupInterceptors();
  }
  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
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
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
                {
                  refreshToken,
                },
              );
              const { accessToken } = response.data;
              localStorage.setItem('accessToken', accessToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.instance(originalRequest);
            }
          } catch (error) {
            return Promise.reject(error);
          }
        }
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
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(
    url: string,
    data?: any,
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

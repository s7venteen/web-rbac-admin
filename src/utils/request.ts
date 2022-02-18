import axios, { AxiosRequestConfig } from 'axios'
import { notification } from 'antd'
import { getToken } from 'utils/auth'
export interface Response<T> {
  code: number
  data: T
  message: string
}

export const axiosInstance = axios.create()

axiosInstance.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers!.token = token
    }
    return config
  },
  error => {
    console.error('error', error)
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  response => {
    if (response.data) {
      if (response.data.code !== 200) {
        notification.error({
          message: response.data.message
        })
        return Promise.reject(new Error(response.data.message || 'Error'))
      }
    }
    return response
  },
  error => {
    console.error('error', error)
    return Promise.reject(error)
  }
)

export default function request<T = any>(config: AxiosRequestConfig): Promise<Response<T>> {
  return new Promise((resolve, reject) => {
    axiosInstance.request(config).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error)
    })
  })
}
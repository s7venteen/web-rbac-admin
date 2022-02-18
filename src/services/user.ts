import request from 'utils/request'
export interface AuthData {
  username: string
  password: string
}
export interface UserModel {
  id: number
  username: string
  avatar: string
  phone: string
  email: string
  desc: string
  status: number
  roles: string[]
}

type UserListModel = UserModel[]

export function login(data: AuthData) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request<UserModel>({
    url: '/user/info'
  })
}

export function getUserList() {
  return request<UserListModel>({
    url: '/user/list'
  })
}

export function userAuth(data: any) {
  return request({
    url: '/user/auth',
    method: 'post',
    data
  })
}
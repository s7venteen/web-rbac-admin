import request from 'utils/request'

export function getRoleList() {
  return request({
    url: '/role/list'
  })
}

export function roleAuth(data: any) {
  return request({
    url: '/role/auth',
    method: 'post',
    data
  })
}
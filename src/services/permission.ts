import request from 'utils/request'

export function getPermissionList() {
  return request({
    url: '/permission/list'
  })
}

export function createPermission(data: any) {
  return request({
    url: '/permission/create',
    method: 'post',
    data
  })
}
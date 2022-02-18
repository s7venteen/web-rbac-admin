import request from 'utils/request'

export function getAuthList() {
  return request({
    url: '/auth/list'
  })
}
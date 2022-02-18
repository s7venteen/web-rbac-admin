import request from 'utils/request'
export interface BaseMenuItem {
  parentId: number
  id: number
  url: string
  menuName: string
  menuType: number
  menuVisible: number
  menuStatus: number
}
export interface MenuItem extends BaseMenuItem {
  parentName: string
  children?: MenuItem[]
}

export type MenuNavModel = BaseMenuItem[]

type MenuSelectModel = BaseMenuItem[]

type MenuListModel = MenuItem[]

export function getMenuNav() {
  return request<MenuNavModel>({
    url: '/menu/nav'
  })
}

export function getMenuSelect() {
  return request<MenuSelectModel>({
    url: '/menu/select'
  })
}

export function createMenu(data: any) {
  return request({
    method: 'post',
    url: '/menu/create',
    data
  })
}

export function updateMenu(data: any) {
  return request({
    method: 'patch',
    url: `/menu/update/${data.id}`,
    data
  })
}

export function deleteMenu(id: BaseMenuItem['id']) {
  return request({
    method: 'delete',
    url: `/menu/delete/${id}`
  })
}

export function getMenuById(id: BaseMenuItem['id']) {
  return request({
    url: `/menu/${id}`
  })
}

export function getMenuList() {
  return request<MenuListModel>({
    url: '/menu/list'
  })
}
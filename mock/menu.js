const LocalStorage = require('node-localstorage').LocalStorage
const cloneDeep = require('lodash/cloneDeep')
const uniq = require('lodash/uniq')
const db = require('./data')

const localStorage = new LocalStorage('./mock/scratch')

let menuId = 100

const PARENT_NAME = '主类目'

module.exports = [
  {
    url: '/menu/nav',
    type: 'get',
    response: req => {
      // 从本地存储里读取用户信息
      // const user = JSON.parse(localStorage.getItem('user')) || {}
      // 过滤出符合当前用户角色名称集合的roles
      // const roles = db.roles.filter(role => user.roles.includes(role.roleName))
      // 当前用户的菜单ids
      // const menuIds = uniq(roles.reduce((a, b) => [...a, ...b.menuIds], []))
      // 父id集合
      // const pids = db.menus.filter(menu => menuIds.includes(menu.id)).map(menu => menu.parentId)
      // 完整的ids
      // const fullIds = uniq([...menuIds, ...pids])
      return {
        code: 200,
        data: db.menus,
        message: 'success'
      }
    }
  },
  {
    url: '/menu/select',
    type: 'get',
    response: req => {
      return {
        code: 200,
        data: [{
          parentId: -1,
          id: 0,
          url: '/',
          menuName: '主类目',
          menuType: 1,
          menuVisible: 1,
          menuStatus: 1
        }].concat(db.menus),
        message: 'success'
      }
    }
  },
  {
    url: '/menu/create',
    type: 'post',
    response: req => {
      db.menus.push({
        parentId: req.body.parentId,
        id: menuId += 1,
        url: req.body.url,
        menuName: req.body.menuName,
        menuType: req.body.menuType,
        menuVisible: req.body.menuVisible,
        menuStatus: req.body.menuStatus
      })
      // db.roles.forEach(role => {
      //   if (role.menuIds.includes(req.body.parentId)) {
      //     role.menuIds.push(menuId)
      //   }
      // })
      return {
        code: 200,
        data: null,
        message: 'success'
      }
    }
  },
  {
    url: '/menu/list',
    type: 'get',
    response: req => {
      const cloneMenus = cloneDeep(db.menus)

      // 菜单树
      const result = []
      // 用于构建菜单树
      const menuMap = new Map()

      for (let menu of cloneMenus) {
        menu.children = menu.children || []
        menuMap.set(menu.id, menu)
      }

      for (let menu of cloneMenus) {
        const parent = menuMap.get(menu.parentId)
        if (parent) {
          parent.children.push({
            ...menu,
            parentName: parent.menuName
          })
        } else {
          result.push({
            ...menu,
            parentName: PARENT_NAME
          })
        }
      }

      // 递归清理无用的空子节点
      loopDeleteEmptyChildren(result)

      function loopDeleteEmptyChildren(source) {
        source.forEach(item => {
          if (item.children && item.children.length === 0) {
            delete item.children
          }
          if (item.children && item.children.length > 0) {
            loopDeleteEmptyChildren(item.children)
          }
        })
      }

      return {
        code: 200,
        data: result,
        message: 'success'
      }
    }
  },
  {
    url: '/menu/update/:id',
    type: 'patch',
    response: req => {
      const id = +req.params.id
      const menu = db.menus.find(menu => menu.id === id)
      Object.assign(menu, req.body)
      return {
        code: 200,
        data: null,
        message: 'success'
      }
    }
  },
  {
    url: '/menu/:id',
    type: 'get',
    response: req => {
      const id = +req.params.id
      const menu = db.menus.find(menu => menu.id === id)
      let parentName = PARENT_NAME
      db.menus.forEach(({ id, menuName }) => {
        if (id === menu.parentId) {
          parentName = menuName
        }
      })
      return {
        code: 200,
        data: {
          parentName,
          ...menu
        },
        message: 'success'
      }
    }
  },
  {
    url: '/menu/delete/:id',
    type: 'delete',
    response: req => {
      const id = +req.params.id
      const index = db.menus.findIndex(menu => menu.id === id)
      db.menus.splice(index, 1)
      return {
        code: 200,
        data: null,
        message: 'success'
      }
    }
  }
]
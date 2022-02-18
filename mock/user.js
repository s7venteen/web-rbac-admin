const LocalStorage = require('node-localstorage').LocalStorage
const omit = require('lodash/omit')
const uniq = require('lodash/uniq')
const db = require('./data')

const localStorage = new LocalStorage('./mock/scratch')

// mock token
const token = '54981b3cefd69340e29697a5b8183413'

module.exports = [
  {
    url: '/user/login',
    type: 'post',
    response: req => {
      const { username, password } = req.body
      const user = db.users.find(item => item.username === username)
      if (!user) {
        return {
          code: 204,
          data: null,
          message: '用户不存在'
        }
      }

      if (user.password !== password) {
        return {
          code: 203,
          data: null,
          message: '密码错误'
        }
      }

      localStorage.setItem('user', JSON.stringify(user))

      return {
        code: 200,
        data: token,
        message: 'success'
      }
    }
  },
  {
    url: '/user/info',
    type: 'get',
    response: req => {
      if (!req.headers['token']) {
        return {
          code: 201,
          data: null,
          message: 'bad authentication token'
        }
      }

      // 从本地存储里读取用户信息
      const user = JSON.parse(localStorage.getItem('user')) || {}
      // 拉取当前用户角色
      const roles = db.roles.filter(role => user.roles.includes(role.roleName))
      // 权限菜单ids
      const menuIds = uniq(roles.reduce((a, b) => [...a, ...b.menuIds], []))
      // 按钮权限集合
      const permissions = db.menus.filter(menu => menuIds.includes(menu.id) && menu.menuStatus === 1 && menu.menuType === 3).map(b => b.perms)

      return {
        code: 200,
        data: {
          ...omit(user, ['password']),
          permissions,
          avatar: 'https://joeschmoe.io/api/v1/random'
        },
        message: 'success'
      }
    }
  },
  {
    url: '/user/list',
    type: 'get',
    response: req => {
      return {
        code: 200,
        data: db.users,
        message: 'success'
      }
    }
  },
  {
    url: '/user/logout',
    type: 'post',
    response: req => {
      localStorage.removeItem('user')
      return {
        code: 200,
        data: null,
        message: 'success'
      }
    }
  },
  {
    url: '/user/auth',
    type: 'post',
    response: req => {
      // const { id, checkedIds } = req.body
      // 查找当前用户
      // const user = db.users.find(user => user.id === id)
      // 筛选符合条件的角色集合
      // const roles = db.roles.filter(role => checkedIds.includes(role.id))
      // 用户角色分配
      // (user, 'roles', roles.map(role => role.roleName))
      // 从本地存储里读取用户信息
      // const localStorageUser = JSON.parse(localStorage.getItem('user')) || {}
      // 如果当前登录用户和本地存储的userid一致 则更新本地存储user 保证前端那边获取到的用户信息始终是最新的
      // if (localStorageUser.id === user.id) {
      //   localStorage.setItem('user', JSON.stringify(user))
      // }
      return {
        code: 200,
        data: null,
        message: 'success'
      }
    }
  }
]
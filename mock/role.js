const set = require('lodash/set')
const db = require('./data')

module.exports = [
  {
    url: '/role/list',
    type: 'get',
    response: req => {
      return {
        code: 200,
        data: db.roles,
        message: 'success'
      }
    }
  },
  {
    url: '/role/auth',
    type: 'post',
    response: req => {
      const { id, menuIds } = req.body
      // 根据id查找对应角色
      const role = db.roles.find(role => role.id === id)
      // 分配菜单权限
      set(role, 'menuIds', menuIds)
      return {
        code: 200,
        data: null,
        message: 'success'
      }
    }
  }
]
const db = require('./data')

let id = 1

module.exports = [
  {
    url: '/permission/list',
    type: 'get',
    response: req => {
      const permissions = db.permissions.map(p => {
        const menu = db.menus.find(m => p.menuId === m.id)
        return {
          ...p,
          menuName: menu.menuName
        }
      })
      return {
        code: 200,
        data: permissions,
        message: 'success'
      }
    }
  },
  {
    url: '/permission/create',
    type: 'post',
    response: req => {
      console.log(req.body)
      const roleIds = req.body.roleIds
      db.roles.forEach(r => {
        if (roleIds.includes(r.id)) {
          r.permissions.push(req.body.permission)
        }
      })
      db.permissions.push({
        id: id++,
        menuId: req.body.menuId,
        permissionName: req.body.permissionName,
        permission: req.body.permission,
        status: req.body.status
      })
      return {
        code: 200,
        data: null,
        message: 'success'
      }
    }
  }
]
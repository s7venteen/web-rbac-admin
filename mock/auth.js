const db = require('./data')
const cloneDeep = require('lodash/cloneDeep')

function createAuthList() {
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
        ...menu
      })
    } else {
      result.push({
        ...menu
      })
    }
  }

  return result
}

module.exports = [
  {
    url: '/auth/list',
    type: 'get',
    response: req => {
      return {
        code: 200,
        data: createAuthList(),
        message: 'success'
      }
    }
  }
]
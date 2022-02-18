const Mock = require('mockjs')

const Random = Mock.Random

Random.extend({
  phone: function () {
    var phonePrefixs = ['152', '176', '189']
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/)
  }
})

const permissions = [
  // {
  //   id: 0,
  //   menuId: '',
  //   menuName: '',
  //   permissionName: '',
  //   permission: '',
  //   status: 1
  // }
]

const menus = [
  {
    parentId: 0,
    id: 1,
    url: '/home',
    menuName: '首页',
    menuType: 1,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 0,
    id: 2,
    url: '/system',
    menuName: '系统管理',
    menuType: 1,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 2,
    id: 3,
    url: '/system/user',
    menuName: '用户管理',
    menuType: 2,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 2,
    id: 4,
    url: '/system/role',
    menuName: '角色管理',
    menuType: 2,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 2,
    id: 5,
    url: '/system/permission',
    menuName: '权限管理',
    menuType: 2,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 2,
    id: 6,
    url: '/system/menu',
    menuName: '菜单管理',
    menuType: 2,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 0,
    id: 7,
    url: '/video',
    menuName: '视频管理',
    menuType: 1,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 7,
    id: 8,
    url: '/video/list',
    menuName: '视频列表',
    menuType: 2,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 7,
    id: 9,
    url: '/video/:id',
    menuName: '视频详情',
    menuType: 2,
    menuVisible: 2,
    menuStatus: 1
  }
]

const roles = [
  {
    id: 1,
    roleName: 'admin',
    desc: 'Super Administrator. Have access to view all pages',
    status: 1,
    menuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    permissions: []
  },
  {
    id: 2,
    roleName: 'editor',
    desc: 'Normal Editor. Can see all pages except permission page',
    status: 1,
    menuIds: [1, 7, 8, 9],
    permissions: []
  },
  {
    id: 3,
    roleName: 'visitor',
    desc: 'Just a visitor. Can only see the home page and the document page',
    status: 1,
    menuIds: [1],
    permissions: []
  }
]

const users = [
  {
    id: 1,
    username: 'zhaolei',
    password: '123456',
    phone: Random.phone(),
    email: Random.email(),
    desc: Random.sentence(5),
    status: 1,
    roles: ['admin']
  },
  {
    id: 2,
    username: 'lucky',
    password: '123456',
    phone: Random.phone(),
    email: Random.email(),
    desc: Random.sentence(5),
    status: 1,
    roles: ['editor']
  },
  {
    id: 3,
    username: 'guest',
    password: '123456',
    phone: Random.phone(),
    email: Random.email(),
    desc: Random.sentence(5),
    status: 1,
    roles: ['visitor']
  }
]

module.exports = {
  users,
  roles,
  menus,
  permissions
}
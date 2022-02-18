const Mock = require('mockjs')

const user = require('./user')
const menu = require('./menu')
const role = require('./role')
const auth = require('./auth')
const permission = require('./permission')

const mocks = [
  ...user,
  ...menu,
  ...role,
  ...auth,
  ...permission
]

module.exports = { mocks }
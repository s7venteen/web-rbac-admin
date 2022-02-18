import React, { ComponentType } from 'react'
import { RouteObject, Navigate } from 'react-router-dom'
import pMinDelay from 'p-min-delay'

import Login from 'pages/login'
import Layout from 'layout'

function lazyComponent<T extends ComponentType<any>>(p: Promise<{ default: T }>, d = 300) {
  return React.lazy(() => pMinDelay(p, d))
}

const Home = lazyComponent(import('pages/home'))
const User = lazyComponent(import('pages/system/user'))
const Role = lazyComponent(import('pages/system/role'))
const Permission = lazyComponent(import('pages/system/permission'))
const Menu = lazyComponent(import('pages/system/menu'))
const VideoList = lazyComponent(import('pages/video/list'))
const VideoDetails = lazyComponent(import('pages/video/details'))

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'system/user',
        element: <User />
      },
      {
        path: 'system/role',
        element: <Role />
      },
      {
        path: 'system/permission',
        element: <Permission />
      },
      {
        path: 'system/menu',
        element: <Menu />
      },
      {
        path: 'video/list',
        element: <VideoList />
      },
      {
        path: 'video/:id',
        element: <VideoDetails />
      }
    ]
  },
  {
    path: '/403',
    element: <h3>No permissions</h3>
  },
  {
    path: '/404',
    element: <h3>The page can't be found</h3>
  },
  {
    path: '*',
    element: <Navigate to={'/404'} replace />
  }
]

export default routes
import React, { useMemo, useEffect } from 'react'
import { Outlet, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom'
import { Dropdown, Menu, Button, Avatar, Breadcrumb, Card, Spin } from 'antd'
import { EnvironmentTwoTone } from '@ant-design/icons'
import ProLayout, { MenuDataItem, getMenuData } from '@ant-design/pro-layout'
import useMenu from 'hooks/useMenu'
import useUser, { useLogout } from 'hooks/useUser'
import { getToken } from 'utils/auth'
import nprogress from 'utils/nprogress'

const Loading: React.FC = () => {
  useEffect(() => {
    nprogress.start()
    return () => {
      nprogress.done()
    }
  }, [])
  return (
    <div style={{ textAlign: 'center' }}>
      <Spin />
    </div>
  )
}

const Layout: React.FC = () => {
  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate()

  const { data: user } = useUser()

  const logout = useLogout()

  const { isLoading, isFetching, data: menu, menuList } = useMenu()

  const loopMenuItem = (menus: typeof menuList): MenuDataItem[] | undefined => {
    return menus?.map(menu => ({
      name: menu.menuName,
      path: menu.url ? menu.url : '',
      hideInMenu: menu.menuVisible === 1 ? false : true,
      routes: menu.children ? loopMenuItem(menu.children) : []
    }))
  }

  const breadcrumbItems = useMemo(() => {
    const { breadcrumbMap } = getMenuData(loopMenuItem(menuList) ?? [])
    const pathSnippets = location.pathname.split('/').filter(i => i)
    // eslint-disable-next-line
    const items = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
      const route = breadcrumbMap.get(url)
      if (route) {
        return <Breadcrumb.Item key={route.path}>{route.name}</Breadcrumb.Item>
      }
    })
    return items.filter(item => !!item)
  }, [location, menuList])

  if (!getToken()) {
    return <Navigate to={'/login'} />
  }

  if (isLoading) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Spin />
      </div>
    )
  }

  if (menu && menu.data.length > 0) {
    const pathnames = ['/', ...menu.data.map(item => params.id ? item.url.replace(/:id/g, params.id) : item.url)]
    if (!pathnames.includes(location.pathname)) {
      return <Navigate to={'/403'} replace />
    }
  }

  if (location.pathname === '/') {
    return <Navigate to={'/home'} />
  }

  return (
    <div
      id="layout"
      style={{ height: '100vh' }}
    >
      <ProLayout
        siderWidth={230}
        location={location}
        collapsed={false}
        collapsedButtonRender={false}
        disableMobile={true}
        fixSiderbar={true}
        menu={{
          loading: isFetching
        }}
        headerContentRender={() => {
          return (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 10
              }}
            >
              <EnvironmentTwoTone style={{ marginRight: 10 }} />
              <Breadcrumb>{breadcrumbItems}</Breadcrumb>
            </div>
          )
        }}
        rightContentRender={() => (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key={'logout'}>
                  <Button type={'link'} onClick={() => {
                    logout.mutate()
                  }}>退出</Button>
                </Menu.Item>
              </Menu>
            }
          >
            <div>
              <Avatar src="https://joeschmoe.io/api/v1/random" />
              <Button type={'link'} onClick={(e) => e.preventDefault()}>
                Hi, {user?.data.username}
              </Button>
            </div>
          </Dropdown>
        )}
        menuDataRender={() => {
          return loopMenuItem(menuList) ?? []
        }}
        menuItemRender={(item, dom) => (
          // eslint-disable-next-line
          <a
            onClick={() => {
              if (item.path && item.path !== location.pathname) {
                navigate(item.path)
              }
            }}
          >
            {dom}
          </a>
        )}
        onMenuHeaderClick={(e) => console.log(e)}
      >
        <Card bordered={false}>
          <React.Suspense fallback={<Loading />}>
            <Outlet />
          </React.Suspense>
        </Card>
      </ProLayout>
    </div>
  )
}

export default Layout
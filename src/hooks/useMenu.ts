import { useMemo } from 'react'
import { useQuery } from 'react-query'
import services from 'services'
import { buildTree } from 'utils/tree'
import { getToken } from 'utils/auth'

export default function useMenu() {
  const { data, ...rest } = useQuery('menu.nav', services.menu.getMenuNav, {
    enabled: !!getToken()
  })

  const menuList = useMemo(() => {
    if (data?.code === 200) {
      return buildTree('id', 'parentId', data.data)
    }
  }, [data])

  return {
    data,
    menuList,
    ...rest
  }
}
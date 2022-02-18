import React from 'react'
import { useQueryClient } from 'react-query'
import { Button } from 'antd'
const Home: React.FC = () => {
  const queryClient = useQueryClient()
  return (
    <div>
      <Button onClick={() => {
        queryClient.invalidateQueries('menu.nav', {
          refetchInactive: true
        })
      }}>刷新菜单</Button>
    </div>
  )
}

export default Home
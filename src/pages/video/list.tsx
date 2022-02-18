import React from 'react'
import { NavLink } from 'react-router-dom'

const VideoList: React.FC = () => {
  return (
    <>
      <h1>视频列表</h1>
      <NavLink to={'/video/1'}>跳转视频详情页面</NavLink>
    </>
  )
}

export default VideoList
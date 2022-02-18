import React from 'react'
import { useParams } from 'react-router'

const VideoDetails: React.FC = () => {
  const params = useParams()
  return (
    <>
      <h1>视频详情</h1>
      <span>video id:{params.id}</span>
    </>
  )
}

export default VideoDetails
import React from 'react'
import VideoList from './_components/VideoList'

const Dashboard = () => {
  return (
    <div>
      <h2 className='text-bold text-3xl'>My Videos</h2>
      <VideoList />
    </div>
  )
}

export default Dashboard

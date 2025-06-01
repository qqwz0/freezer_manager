import React from 'react'
import { FreezersCarousel } from 'freezers/components'
import { Header } from 'shared/ui'

function Dashboard() {
  return (
    <>
      <Header />
      <div className='h-screen flex items-center justify-center flex-col text-center max-w-screen'>
          <FreezersCarousel />
      </div>
    </>
  )
}

export default Dashboard
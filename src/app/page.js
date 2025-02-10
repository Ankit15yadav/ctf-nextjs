import Login from '@/components/Login'
import React from 'react'
import { Analytics } from "@vercel/analytics/react"

Analytics()

const page = () => {
  return (
    <div>
      <Login />
    </div>
  )
}

export default page

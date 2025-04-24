// Freezer.jsx
import React from 'react'
import { Shelf } from './Shelf'
import { Card } from 'flowbite-react'

export default function Freezer() {
  return (
    <Card className="max-w-sm dark:bg-blue-900 w-3xl min-h-20" >
      <Shelf />
    </Card>
  )
}

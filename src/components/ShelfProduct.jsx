import React from 'react'
import { Card } from 'flowbite-react'

function ShelfProduct( { children } ) {
  return (
    <Card className="max-w-sm color-300 text-left">
      {children}
    </Card>
  )
}

export default ShelfProduct
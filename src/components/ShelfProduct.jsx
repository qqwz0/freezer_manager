import React from 'react'
import { Card } from 'flowbite-react'
import AddButton from './AddButton'

function ShelfProduct({ children, product }) {
  return (
    <Card className="w-full text-left">
      <div className="flex justify-between items-center w-full">
        <span>{children}</span>
        <div className="flex gap-2">
          <span>{product.quantity}</span>
          <span>{product.unit}</span>
        </div>
      </div>
    </Card>
  )
}

export default ShelfProduct
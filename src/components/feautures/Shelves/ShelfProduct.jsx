import React from 'react'
import { Card } from 'flowbite-react'

function ShelfProduct({ children, product }) {
  console.log('Product:', product)
  return (
    <Card className="w-full text-left">
      <div className="flex justify-between items-center w-full">
        <span>{product.name}</span>
        <div className="flex gap-2">
          <span>{product.quantity}</span>
          <span>{product.unit}</span>
        </div>
      </div>
    </Card>
  )
}

export default ShelfProduct
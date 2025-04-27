import React from 'react'
import { Button } from 'flowbite-react'

export default function AddButton( { name, handleAddition } ) {
  return (
    <div className=" bottom-0 bg-blue-900 p-2 rounded-b-lg cursor-pointer">
        <Button 
            className='w-full shadow-lg cursor-pointer' 
            color="blue" 
            onClick={handleAddition}
        >
            Add {name}
        </Button>
    </div>
  )
}
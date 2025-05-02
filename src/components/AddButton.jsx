import React from 'react'
import { Button } from 'flowbite-react'

export default function AddButton( { onClick, label, action } ) {
  return (
    <div className=" bottom-0 p-2 rounded-b-lg cursor-pointer">
        <Button 
            className='w-full shadow-lg cursor-pointer' 
            color="blue" 
            onClick={onClick}
        >
            {action} {label}
        </Button>
    </div>
  )
}
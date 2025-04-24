import React from 'react'
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from 'flowbite-react'
import ShelfProduct from './ShelfProduct'

export function Shelf() {
  return (
    <Accordion alwaysOpen>
        <AccordionPanel>
            <AccordionTitle className='cursor-pointer'>
                Полиця 1
            </AccordionTitle>
            <AccordionContent className='flex flex-col gap-2'>
                <ShelfProduct> Продукт 1 </ShelfProduct>
                <ShelfProduct> Продукт 2 </ShelfProduct>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
  )
}

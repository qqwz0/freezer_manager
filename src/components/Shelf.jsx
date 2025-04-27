import React from 'react'
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle, Button } from 'flowbite-react'
import { useState } from 'react'
import { useEffect } from 'react'
import ShelfProduct from './ShelfProduct'
import AddButton from './AddButton'

export function Shelf({ shelf }) {
  const [shelfName, setShelfName] = React.useState(null);
  const [products, setProducts] = React.useState(null);

  useEffect(() => {
    const getShelfData = () => {
      const name = shelf.name;
      setShelfName(name);
    }

    getShelfData();
  }, [shelf]);

  useEffect(() => {
    console.log("shelfName", shelfName);
  }, [shelfName, products]); 

  const handleAddProduct = () => {
    console.log("Add Product clicked");
  }

  return (
    <Accordion alwaysOpen>
        <AccordionPanel>
            <AccordionTitle className='cursor-pointer'>
                {shelfName}
            </AccordionTitle>
            <AccordionContent className='flex flex-col gap-2 cursor-pointer'>
              {shelf.products.map(product => (
                <ShelfProduct key={product.id} product={product} className='flex flex-row justify-between items-center w-full'>
                {product.name}
              </ShelfProduct>))}
              <AddButton name="Product" handleAddition={() => console.log("Add Product")} />
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
  )
}

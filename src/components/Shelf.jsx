import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from 'flowbite-react';
import ShelfProduct from './ShelfProduct';
import AddButton from './AddButton';
import DeleteModal from './DeleteModal';
import DeleteButton from './DeleteButton';

export function Shelf({ shelf, onDeleteShelf, onAddProduct }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAddProduct = () => {
    console.log("Add Product clicked");
  }

  const confirmDeleteShelf = () => {
    onDeleteShelf(shelf.id);
    setShowDeleteModal(false);
  }

  console.log("Shelf data:", shelf);

  return (
    <>
      <Accordion alwaysOpen>
          <AccordionPanel>
              <AccordionTitle className='cursor-pointer flex flex-row justify-between items-center w-full'>
                <div className='flex flex-row gap-2 items-center'>
                  {shelf.name}
                  <DeleteButton onClick={() => setShowDeleteModal(true)} />
                </div>
              </AccordionTitle>
              <AccordionContent className='flex flex-col gap-2 cursor-pointer'>
                {shelf.products.map(product => (
                  <ShelfProduct 
                    key={product.id} 
                    product={product} 
                    className='flex flex-row justify-between items-center w-full'
                  />
                ))}
                <AddButton label="Product" handleAddition={handleAddProduct} action={"Add"} />
              </AccordionContent>
          </AccordionPanel>
      </Accordion>

      <DeleteModal
        show={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onDelete={confirmDeleteShelf} 
        title="Shelf"
      />
    </>
  )
}

import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from 'flowbite-react';
import ShelfProduct from './ShelfProduct';
import AddButton from './AddButton';
import DeleteModal from './DeleteModal';

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
                  <span
                  onClick={() => setShowDeleteModal(true)} 
                  role="button" 
                  tabIndex={0}
                  >
                    <svg 
                      className="w-6 h-6 text-gray-800 dark:text-white hover:text-red-500 " 
                      aria-hidden="true" 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                    </svg>
                  </span>
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

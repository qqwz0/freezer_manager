import React, { useState, useEffect, useCallback } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle
} from 'flowbite-react';

import { ActionButton } from 'components/common/Button';
import { DeleteModal, EditModal, Modal, FormModal, useModal } from 'components/common/Modal';
import { ShelfProduct } from 'components/feautures/Shelves';

export default function Shelf({ shelf, freezerId, onRemoveShelf, onUpdateShelf, onAddProduct, onUpdateProduct, onRemoveProduct }) {
  const { config, open, close } = useModal();

  return (
    <>
      <Accordion collapseAll>
        <AccordionPanel>
          <AccordionTitle 
              className='cursor-pointer flex flex-row justify-between items-center w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg p-5' // Added background and hover classes
            >
                <div className='flex flex-row gap-2 items-center'>
                  {shelf.name}
                  <ActionButton
                    onClick={() =>
                      open({
                        mode: 'edit',
                        title: "Shelf",
                        onSubmit: ({ name }) => onUpdateShelf(shelf.id, name),
                        fields: [
                          { key: 'name', label: 'Shelf Name', type: 'text', placeholder: 'Enter shelf name', required: true }
                        ],
                        initialData: { name: shelf.name }
                      })
                    }
                    action="edit"
                  />
                  <ActionButton 
                    onClick={() =>
                      open({
                        mode: 'delete',
                        title: "Shelf",
                        onSubmit: () => onRemoveShelf(shelf.id),
                      })
                    }
                    action="delete"
                  />
                </div>
              </AccordionTitle>
              <AccordionContent className='flex flex-col gap-2 cursor-pointer'>
                {shelf.products.map(product => (
                  <ShelfProduct 
                    key={product.id} 
                    product={product} 
                    shelfId={shelf.id}
                    onUpdateProduct={onUpdateProduct}
                    onRemoveProduct={onRemoveProduct}
                    freezerId={freezerId}
                    className='flex flex-row justify-between items-center w-full'
                  />
                ))}
                <ActionButton 
                  label="Product" 
                  onClick={() =>
                      open({
                        mode: 'add',
                        title: "Product",
                        onSubmit: (product) => onAddProduct(shelf.id, product),
                        fields: [
                          { key: 'name', label: 'Product Name', type: 'text', placeholder: 'Enter product name', required: true },
                          { key: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity', required: true },
                          { key: 'unit', label: 'Unit', type: 'text', placeholder: 'Enter unit', required: true },
                          { key: 'picture', label: 'Picture', type: 'file', placeholder: 'Upload picture', required: false },
                          { key: 'category', label: 'Category', type: 'text', placeholder: 'Enter category', required: false },
                          { key: 'freezingDate', label: 'Freezing Date', type: 'date', placeholder: 'Enter freezing date', required: false },
                          { key: 'expirationDate', label: 'Expiration Date', type: 'date', placeholder: 'Enter expiration date', required: false },
                        ],
                      })
                    }
                  action="add" 
                />
              </AccordionContent>
          </AccordionPanel>
      </Accordion>

      <FormModal
        show={config.mode !== null}
        mode={config.mode}
        title={config.title}
        fields={config.fields}
        initialData={config.initialData}
        onSubmit={config.onSubmit}
        onClose={close}
      />
    </>
  )
}

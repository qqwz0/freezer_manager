import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle
} from 'flowbite-react';

import { useFreezerContext } from 'freezers/hooks';
import { ShelfProduct } from 'freezers/components';
import { useModal } from 'shared/hooks';
import { ActionButton, FormModal } from 'shared/ui';

export default function Shelf({ shelf, freezerData }) {
  const { config, open, close } = useModal();

   const { categories, units, addProduct, updateShelf, removeShelf } = useFreezerContext();

  const shelfData = shelf.name === 'No shelf products' ? {id: shelf.id, name: '-- No Shelf --'} : {id: shelf.id, name: shelf.name }

  const filteredProducts = useMemo(() => {
    if (!freezerData.products) return [];
    return freezerData.products.filter(product => {
      return shelf.id ? product.shelfId === shelf.id
      : !product.shelfId;
    })
  }, [freezerData.products, shelf.id]);

  const handleEditClick = useCallback(() => {
    open({
      mode: 'edit',
      title: "Shelf",
      onSubmit: ({ name }) => updateShelf(freezerData.id, shelf.id, name),
      fields: [
        { key: 'name', label: 'Shelf Name', type: 'text', placeholder: 'Enter shelf name', required: true }
      ],
      initialData: { name: shelf.name }
    });
  }, [open, updateShelf, shelf.id, shelf.name, freezerData.id])

  const handleDeleteShelf = useCallback(() => {
    open({
      mode: 'delete',
      title: "Shelf",
      onSubmit: () => removeShelf(freezerData.id, shelf.id),
    })
  }, [open, removeShelf, shelf.id])

  const handleAddProduct = useCallback(() => {
    open({
      mode: 'add',
      title: "Product",
      onSubmit: (product) => addProduct(freezerData.id, shelf.id, product),
      fields: [
        { key: 'name', label: 'Product Name', type: 'text', placeholder: 'Enter product name', required: true },
        { key: 'shelfId', label: 'Shelf', type: 'select', options: freezerData.shelves, required: false, value: shelfData},
        { key: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity', required: true },
        { key: 'unit', label: 'Unit', type: 'select', options: units, required: true },
        { key: 'picture', label: 'Picture', type: 'file', placeholder: 'Upload picture', required: false },
        { key: 'category', label: 'Category', type: 'select', options: categories, required: false },
        { key: 'freezingDate', label: 'Freezing Date', type: 'date', placeholder: 'Enter freezing date', required: false },
        { key: 'expirationDate', label: 'Expiration Date', type: 'date', placeholder: 'Enter expiration date', required: false },
      ]
    })
  }, [open, addProduct, shelf.id, freezerData.shelves, units, categories])


  return (
    <>
      <Accordion collapseAll>
        <AccordionPanel>
          <AccordionTitle 
              className='cursor-pointer flex flex-row justify-between items-center w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg p-5' // Added background and hover classes
            >
                <div className='flex flex-row gap-2 items-center'>
                  {shelf.name}
                  {
                    shelf.id &&
                    (
                      <>
                      <ActionButton
                        onClick={handleEditClick}
                        action="edit"
                      />
                  <ActionButton 
                    onClick={handleDeleteShelf}
                    action="delete"
                  />
                      </>
                    )
                  }
                </div>
              </AccordionTitle>
              <AccordionContent className='flex flex-col gap-2 cursor-pointer'>
                {filteredProducts.map(product => (
                  <ShelfProduct 
                    key={product.id} 
                    freezerData={freezerData}
                    product={product} 
                    shelf={shelf}
                  />
                ))}
                <ActionButton 
                  label="Product" 
                  onClick={handleAddProduct}
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

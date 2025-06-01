import React, { useCallback, useState } from 'react'
import { Card } from 'flowbite-react'
import { ActionButton, FormModal,  } from 'shared/ui'
import { useModal } from 'shared/hooks'
import { ProductModal } from 'freezers/components'
import { formatDMY } from 'shared/utils'

import { useCategories } from 'freezers/hooks'

function ShelfProduct({ product, shelfId, onRemoveProduct, onUpdateProduct, categories, units, shelves }) {
  const [showProductModal, setShowProductModal] = useState(false)

  const {config, open, close} = useModal();

  const category = categories.find(cat => cat.id === product.category);
  const unit = units.find(un => un.id === product.unit);

  console.log(product)

  return (
    <>
    <Card className="w-full text-left" onClick={() => setShowProductModal(true)}>
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-0 items-center">
          {category?.imageUrl && (
              <img src={category.imageUrl} alt={category.name} className="w-10 h-10 object-cover rounded mr-2" />
          )}
          <span className='ml.3-2'>{product.name}</span>
          <ActionButton
            onClick={() =>
                      console.log("Edit product: ", product) ||
              open({
                mode: 'edit',
                title: "Product",
                onSubmit: (newProduct) => {console.log('submitted'); onUpdateProduct(shelfId, product.id, newProduct)},
                fields: [
                  { key: 'name', label: 'Product Name', type: 'text', placeholder: 'Enter freezer name', required: true },
                  { key: 'shelfId', label: 'Shelf', type: 'select', options: shelves, required: false},
                  { key: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity', required: true },
                  { key: 'unit', label: 'Unit', type: 'select', options: units, required: true },
                  { key: 'photoUrl', label: 'Picture', type: 'file', placeholder: 'Upload picture', required: false },
                  { key: 'category', label: 'Category', type: 'select', options: categories, required: false },
                  { key: 'freezingDate', label: 'Freezing Date', type: 'date', placeholder: 'Enter freezing date', required: false },
                  { key: 'expirationDate', label: 'Expiration Date', type: 'date', placeholder: 'Enter expiration date', required: false },
                ],
                initialData: {
                  id:             product.id,
                  name:           product.name,
                  shelfId: shelfId,
                  quantity:       product.quantity,
                  unit:            product.unit,
                  category:       product.category || '',
                  freezingDate: product.freezingDate?.toDate ? product.freezingDate.toDate() : product.freezingDate,
                  expirationDate: product.expirationDate?.toDate ? product.expirationDate.toDate() : product.expirationDate,
                  photoUrl:   product.photoUrl || '',
                }
              })
            }
            action="edit"
          />
          <ActionButton
            onClick={() =>
              open({
                mode: 'delete',
                title: "Product",
                onSubmit: () => {onRemoveProduct(shelfId, product.id,); console.log(product.id)},
              })
            }
            action="delete"
          />
        </div>
        <div className="flex gap-2">
          <span>{product.quantity}</span>
          {unit?.name && (
              <span>{unit.name}</span>
          )}
        </div>
      </div>
    </Card>

    <ProductModal 
      show={showProductModal} 
      onClose={() => setShowProductModal(false)} 
      product={product}
      unit={unit}
      category={category}
    />

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

export default ShelfProduct
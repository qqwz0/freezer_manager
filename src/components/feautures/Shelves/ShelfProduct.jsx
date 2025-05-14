import React, { useCallback, useState } from 'react'
import { Card } from 'flowbite-react'
import { ActionButton } from 'components/common/Button'
import { EditModal, DeleteModal } from 'components/common/Modal'

import { editProduct, deleteProduct } from 'services/firestoreService'
import { useAuth }   from 'contexts/AuthContext';


function ShelfProduct({ children, product, freezerData, setFreezerData, onEditProduct, onDeleteProduct }) {
  const user = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)


  return (
    <>
    <Card className="w-full text-left">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-0 items-center">
          <span>{product.name}</span>
          <ActionButton
            onClick={() => setShowEditModal(true)}
            action="edit"
          />
          <ActionButton
            onClick={() => setShowDeleteModal(true)}
            action="delete"
          />
        </div>
        <div className="flex gap-2">
          <span>{product.quantity}</span>
          <span>{product.unit}</span>
        </div>
      </div>
    </Card>

    <EditModal
      show={showEditModal}
      onClose={() => setShowEditModal(false)}
      onEdit={onEditProduct}
      title="Product"
      fields={[
        { key: 'name', label: 'Freezer Name', type: 'text', placeholder: 'Enter freezer name', required: true },
        { key: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity', required: true },
        { key: 'unit', label: 'Unit', type: 'text', placeholder: 'Enter unit', required: true },
        { key: 'category', label: 'Category', type: 'text', placeholder: 'Enter category', required: false },
        { key: 'freezingDate', label: 'Freezing Date', type: 'date', placeholder: 'Enter freezing date', required: false },
        { key: 'expirationDate', label: 'Expiration Date', type: 'date', placeholder: 'Enter expiration date', required: false },
      ]}
      freezerData={{
        id: product.id,
      name: product.name,
      quantity: product.quantity,
      unit: product.unit,
      category: product.category || '', // Handle undefined category
    freezingDate: product.freezingDate?.toDate?.().toISOString().split('T')[0] || '',
    expirationDate: product.expirationDate?.toDate?.().toISOString().split('T')[0] || '',
    }}
    />

    <DeleteModal
      show={showDeleteModal} 
      onClose={() => setShowDeleteModal(false)} 
      onDelete={onDeleteProduct} 
      title="Product"
    />
    </>
  )
}

export default ShelfProduct
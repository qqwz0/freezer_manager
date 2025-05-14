import React, { useState, useEffect, useCallback } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle
} from 'flowbite-react';

import { editShelf } from 'services/firestoreService';
import { useAuth }   from 'contexts/AuthContext';
import { createProduct, editProduct, deleteProduct } from 'services/firestoreService';

import { ShelfProduct }                   from 'components/feautures/Shelves';
import { ActionButton }  from 'components/common/Button';
import { DeleteModal, EditModal, Modal }         from 'components/common/Modal';

export default function Shelf({ shelf, freezerId, freezerData, onDeleteShelf, setFreezerData, onUpdateShelf }) {
  const user = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [products, setProducts] = useState(shelf.products)

  useEffect(() => {
    setProducts(shelf.products)
  }, [shelf.products])

  const handleAddProduct = useCallback(async (product) => {
    if (!product || !shelf?.id) return;

    try { 
      const productId = await createProduct(user.uid, freezerId, shelf.id, product.name, product.quantity, product.unit, product.category, product.freezingDate, product.expirationDate);
      const updated = {
        ...freezerData,
        shelves: freezerData.shelves.map(s => {
          return s.id === shelf.id
            ? {
                ...s,
                products: [
                  ...s.products,
                  {
                    id: productId,
                    name: product.name,
                    quantity: product.quantity,
                    unit: product.unit,
                    category: product.category,
                    freezingDate: product.freezingDate,
                    expirationDate: product.expirationDate
                  }
                ]
              }
            : s;
        })
      };
      setFreezerData(updated);
    } catch (e) {
      console.error(e);
      alert('Error adding product. Please try again.');
    }
  }, [user.uid, freezerId, shelf])

const handleEditProduct = useCallback(
    async (updatedProduct) => {
      if (!user?.uid || !freezerId || !shelf.id || !updatedProduct.id) {
        return alert('Missing parameters for editing product');
      }
      try {
        // 1) Оновили в Firestore
        await editProduct(
          user.uid,
          freezerId,
          shelf.id,
          updatedProduct.id,
          updatedProduct
        );

        setProducts(prev =>
          prev.map(p =>
            p.id === updatedProduct.id
              ? {
                  ...p,
                  ...updatedProduct,
                  freezingDate:
                    updatedProduct.freezingDate?.toDate?.() ||
                    updatedProduct.freezingDate,
                  expirationDate:
                    updatedProduct.expirationDate?.toDate?.() ||
                    updatedProduct.expirationDate
                }
              : p
          )
        )


        // 2) Оновлюємо freezerData: 
        // передаємо в setFreezerData подвійний ключ — ідентифікатор полиці й продукту
        setFreezerData(prev => {
          const newShelves = prev.shelves.map(s => {
            if (s.id !== shelf.id) return s;
            return {
              ...s,
              products: s.products.map(p =>
                p.id === updatedProduct.id
                  ? { 
                      // створюємо новий об’єкт продукту з новими полями
                      ...p,
                      ...updatedProduct,
                      freezingDate:
                        updatedProduct.freezingDate?.toDate?.() ||
                        updatedProduct.freezingDate,
                      expirationDate:
                        updatedProduct.expirationDate?.toDate?.() ||
                        updatedProduct.expirationDate,
                    }
                  : p
              )
            };
          });
          // повертаємо новий freezerData
          return { ...prev, shelves: newShelves };
        });

        // 3) Закриваємо модалку
        setShowEditModal(false);
      } catch (e) {
        console.error('Product update failed:', e);
        alert(`Error editing product: ${e.message}`);
      }
    },
    // Видаляємо shelf.id із залежностей — воно вже приходить в аргумент
    [user?.uid, freezerId, setFreezerData]
  );

  const handleDeleteProduct = useCallback(
    async (productId) => {
      if (!user?.uid || !freezerId || !shelf.id || !productId) {
        return alert('Missing parameters for deleting product')
      }

      try {
        // 1) Видаляємо з Firestore
        await deleteProduct(user.uid, freezerId, shelf.id, productId)

        // 2) Оновлюємо локальний стейт для миттєвого ререндеру
        setProducts(prev => prev.filter(p => p.id !== productId))

        // 3) А також синхронізуємо в глобальному freezerData
        setFreezerData(prev => ({
          ...prev,
          shelves: prev.shelves.map(s =>
            s.id !== shelf.id
              ? s
              : {
                  ...s,
                  products: s.products.filter(p => p.id !== productId)
                }
          )
        }))
      } catch (e) {
        console.error('Error deleting product:', e)
        alert('Error deleting product. Please try again.')
      }
    },
    [user?.uid, freezerId, shelf.id, setFreezerData]
  )


  const confirmDeleteShelf = () => {
    onDeleteShelf(shelf.id);
    setShowDeleteModal(false);
  }

  const handleEditShelf = useCallback(async ({ name }) => {
    try {
      await editShelf(user.uid, freezerId, shelf.id, name);

      onUpdateShelf(freezerId, shelf.id, name);
      setShowEditModal(false);
    } catch (e) {
      console.error(e);
      alert('Error updating shelf. Please try again.')
    }
  }, [user.uid, freezerId, shelf.id, onUpdateShelf])

  console.log("Shelf data:", shelf);

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
                    onClick={() => {setShowEditModal(true); console.log("Edit shelf")}}
                    action="edit"
                  />
                  <ActionButton onClick={() => setShowDeleteModal(true)} action="delete"/>
                </div>
              </AccordionTitle>
              <AccordionContent className='flex flex-col gap-2 cursor-pointer'>
                {products.map(product => (
                  <ShelfProduct 
                    key={product.id} 
                    product={product} 
                    freezerData={freezerData}
                    setFreezerData={setFreezerData}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={() => handleDeleteProduct(product.id)}
                    className='flex flex-row justify-between items-center w-full'
                  />
                ))}
                <ActionButton label="Product" onClick={() => setIsModalOpen(true)} action="add" />
              </AccordionContent>
          </AccordionPanel>
      </Accordion>

      <DeleteModal
        show={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onDelete={confirmDeleteShelf} 
        title="Shelf"
      />

      <EditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleEditShelf}
        title="Shelf"
        fields={[
          { key: 'name', label: 'Shelf Name', type: 'text', placeholder: 'Enter shelf name', required: true },
        ]}
        freezerData={{ name: shelf.name }}
      />

      <Modal 
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
        fields={[
          { key: 'name', label: 'Product Name', type: 'text', placeholder: 'Enter product name', required: true },
          { key: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity', required: true },
          { key: 'unit', label: 'Unit', type: 'text', placeholder: 'Enter unit', required: true },
          { key: 'category', label: 'Category', type: 'text', placeholder: 'Enter category', required: false },
          { key: 'freezingDate', label: 'Freezing Date', type: 'date', placeholder: 'Enter freezing date', required: false },
          { key: 'expirationDate', label: 'Expiration Date', type: 'date', placeholder: 'Enter expiration date', required: false },
        ]}
      />
    </>
  )
}

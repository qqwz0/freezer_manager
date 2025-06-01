import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { ActionButton, FormModal, QrScannerModal } from 'shared/ui';
import { useModal, useQrScanner } from 'shared/hooks';
import { formatDMY } from 'shared/utils';

import { Freezer } from 'freezers/components';
import { useFreezers, useCategories } from 'freezers/hooks';


export default function FreezerCarousel() {
  const { config, open, close } = useModal();
  
  const { 
    freezers,
    loading,
    error,
    addFreezer,
    updateFreezer,
    deleteFreezer,
    addShelf,
    updateShelf,
    removeShelf,
    addProduct,
    updateProduct,
    removeProduct
  } = useFreezers();

  const { categories, units } = useCategories();

    function findProductLocation(freezers, productId) {
    for (const freezer of freezers) {
        const product = freezer.products.find(p => p.id === productId);
        if (product) {
          return { freezerId: freezer.id, product };
        }
    }
    return null;
  }


  const { showScanner, openScanner, closeScanner, scanResult, scanError, qrContainerId } = 
    useQrScanner({
      onScanSuccess: (decodedText) => {
        console.log('scanned:', decodedText);
        const found = findProductLocation(freezers, decodedText);
        if (!found) return alert("Product not found.");

        const { freezerId, product } = found;
        const freezer = freezers.find(f => f.id === freezerId);
        const shelves = freezer ? freezer.shelves : [];
        open({
          mode: 'edit',
          title: "Product",
          onSubmit: (newProduct) => {console.log('submitted'); updateProduct(freezerId, product.shelfId, product.id, newProduct)},
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
            shelfId: product.shelfId,
            quantity:       product.quantity,
            unit:            product.unit,
            category:       product.category || '',
            freezingDate:   formatDMY(product.freezingDate),
            expirationDate: formatDMY(product.expirationDate),
            photoUrl:   product.photoUrl || '',
          }
        })
      },
      onScanError: (errMsg) => {
        console.error('Scanner error', errMsg)
      }
    })

  if (loading) return <div>Loading…</div>;
  if (error)   return <div>Error: {error.message}</div>;

  return (
    <>
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        loop={false}
        navigation
        style={{ width: '100%', height: '100%' }}
        observer={true}
        observeParents={true}
        observeSlideChildren={true}
        className='w-full h-full flex justify-center items-center'
      >
        {freezers.map((fr) => (
          <SwiperSlide key={fr.id}>
            <Freezer 
              freezerData={fr} 
              onDeleteFreezer={() => deleteFreezer(fr.id)}
              onEditFreezer={newName => updateFreezer(fr.id, newName)}
              onAddShelf={shelfName => addShelf(fr.id, shelfName)}
              onUpdateShelf={(shelfId, newName) => updateShelf(fr.id, shelfId, newName)}
              onRemoveShelf={shelfId => removeShelf(fr.id, shelfId)}
              onAddProduct={(shelfId, product) => addProduct(fr.id, shelfId, product)}
              onUpdateProduct={(shelfId, productId, newProduct) => updateProduct(fr.id, shelfId, productId, newProduct)}
              onRemoveProduct={(shelfId, productId) => removeProduct(fr.id, shelfId, productId)}
            />
          </SwiperSlide>
        ))}
          <SwiperSlide className='flex-col gap-2'>
            <ActionButton 
              label="Freezer" 
              onClick={() =>
                  open({
                    mode: 'add',
                    title: "Freezer",
                    onSubmit: ({ name }) => {addFreezer(name)},
                    fields: [
                      { key: 'name', label: 'Frezer Name', type: 'text', placeholder: 'Enter freezer name', required: true }
                    ],
                  })
                }
              action="add" 
              className="w-1/5"/>
            <ActionButton
              label="Scan Freezer"
              onClick={openScanner}
              action="scan"
              className="w-1/5 mt-2"
            />
          </SwiperSlide>
      </Swiper>

      <FormModal
              show={config.mode !== null}
              mode={config.mode}
              title={config.title}
              fields={config.fields}
              initialData={config.initialData}
              onSubmit={config.onSubmit}
              onClose={close}
      />

      <QrScannerModal 
        show={showScanner}
        onClose={closeScanner}
        scanError={scanError}
        scanResult={scanResult}
        qrContainerId={qrContainerId}
      />
    </>
  );
}

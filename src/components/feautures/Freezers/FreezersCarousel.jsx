import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { ActionButton } from 'components/common/Button';
import { Modal, FormModal } from 'components/common/Modal';
import { Freezer, useFreezers } from 'components/feautures/Freezers';
import { useModal } from 'components/common/Modal';

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
          <SwiperSlide>
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
    </>
  );
}

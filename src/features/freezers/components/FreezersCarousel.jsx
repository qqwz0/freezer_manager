import React, { useState, useMemo, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

import { useFreezerContext } from 'freezers/hooks';
import { ActionButton, FormModal, QrScannerModal, LoadingScreen } from 'shared/ui';
import { useModal, useQrScanner } from 'shared/hooks';
import { formatDMY } from 'shared/utils';

import { Freezer } from 'freezers/components';

import { toast } from 'react-toastify';

export default function FreezerCarousel() {
  const { config, open, close } = useModal();

  const {
    freezers,
    loading,
    error,
    categories,
    units,
    addFreezer,
    updateProduct, 
  } = useFreezerContext();

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

        if (!found) {
          toast.error("Product not found.");
          return;
        }

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

    const slides = useMemo(() => {
      return freezers.map((fr) => (
          <SwiperSlide key={fr.id} className="flex items-center justify-center">
            <div className="w-full max-w-3xl">
              <Freezer 
                freezerData={fr} 
              />
            </div>
          </SwiperSlide>
        ))
  }, [freezers])

  const emptySlide = useMemo(() => {
    return <SwiperSlide className='flex items-center justify-center px-4 py-8 sm:px-0'>
        <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 p-6 sm:p-12 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl sm:rounded-3xl shadow-2xl border border-blue-100 dark:border-blue-800/30 backdrop-blur-sm w-full max-w-xl">
          
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Manage your freezers
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Create a new freezer or add/edit a product with QR-code
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full justify-center">
            
            <div className="group flex flex-col items-center w-full sm:w-auto">
              <ActionButton 
                label="New Freezer" 
                onClick={() =>
                  open({
                    mode: 'add',
                    title: "Freezer",
                    onSubmit: ({ name }) => {addFreezer(name)},
                    fields: [
                      { key: 'name', label: 'Freezer Name', type: 'text', placeholder: 'Enter freezer name', required: true }
                    ],
                  })
                }
                action="add" 
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group-hover:shadow-blue-500/25"
              />
              <div className="text-center mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Create from scratch
              </div>
            </div>

            <p className="text-gray-500 dark:text-gray-400">or</p>
            
            <div className="group flex flex-col items-center w-full sm:w-auto">
              <ActionButton
                label="Scan QR Code"
                onClick={openScanner}
                action="scan"
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group-hover:shadow-purple-500/25"
              />
              <div className="text-center mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Scan existing freezer
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
  }, [open, addFreezer, openScanner])

  if (loading) return (
    <LoadingScreen />
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-red-800 dark:text-red-200 font-medium">Error loading freezers</h3>
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full min-h-screen">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10 pointer-events-none"></div>
      
     {!loading && <Swiper
        modules={[Navigation, EffectCoverflow]}
        spaceBetween={30}
        slidesPerView={1}
        loop={false}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        effect="coverflow"
        coverflowEffect={{
          rotate: 15,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        style={{ width: '100%', height: '100%', padding: '20px 0' }}
        observer={true}
        observeParents={true}
        observeSlideChildren={true}
        className='w-full h-full flex justify-center items-center'
      >
        {slides}
        {emptySlide}
      </Swiper>
}
      {/* Custom navigation buttons */}
      <div className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 border border-gray-200 dark:border-gray-700">
        <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      
      <div className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 border border-gray-200 dark:border-gray-700">
        <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

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
    </div>
  );
}
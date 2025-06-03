import React, { useEffect, useState, useMemo } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { Timestamp } from 'firebase/firestore';
import { formatDMY } from 'shared/utils';
import { useCategories } from 'freezers/hooks';

function ProductModal({show, onClose, product, unit, category}) {
    if (!product) return null;
    const { getCategory } = useCategories();

    function getImageSrc(image) {
        if (!image) return null;
        if (typeof image === 'string') return image;
        if (image instanceof File) {
            return URL.createObjectURL(image);
        }
        return null;
    }

    const handleDownload = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const response = await fetch(product.qrCodeUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${product.name}-qrcode.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    return (
        <Modal show={show} onClose={onClose} size="lg">
            <ModalHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {product.name}
                        </h3>
                        {category && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {category.name}
                            </p>
                        )}
                    </div>
                </div>
            </ModalHeader>
            
            <ModalBody className="p-0">
                <div className="p-6 space-y-6">
                    {/* Product Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-2xs">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Product Details
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Quantity:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {product.quantity} {unit ? unit.name : ''}
                                        </span>
                                    </div>
                                    {product.freezingDate && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Freezing Date:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatDMY(product.freezingDate)}
                                            </span>
                                        </div>
                                    )}
                                    {product.expirationDate && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Expiration Date:</span>
                                            <span className="font-medium text-red-600 dark:text-red-400">
                                                {formatDMY(product.expirationDate)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Product Image */}
                        {product.photoUrl && (
                            <div className="space-y-4">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Product Photo
                                    </h4>
                                    <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                                        <img
                                            src={getImageSrc(product.photoUrl)}
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* QR Code Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h.01M12 15h.01M12 12h.01M12 9h.01M12 6h.01M7 5h.01M7 8h.01M7 11h.01M7 14h.01M7 17h.01M17 17h.01M17 14h.01M17 11h.01M17 8h.01M17 5h.01" />
                            </svg>
                            QR Code
                        </h4>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="flex-shrink-0">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                    <img
                                        src={product.qrCodeUrl}
                                        alt="QR Code"
                                        className="w-32 h-32"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Scan this QR code to quickly access product information
                                </p>
                                <button
                                    type="button"
                                    onClick={handleDownload}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download QR Code
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    )
}

export default ProductModal
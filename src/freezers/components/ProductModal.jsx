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
  e.preventDefault(); // stop any default behavior
  e.stopPropagation(); // stop modal click bubbling

  try {
    const response = await fetch(product.qrCodeUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

    return (
    <Modal show={show} onClose={onClose}>
        <ModalHeader>{product.name}</ModalHeader>
        <ModalBody>
            <ul>
                <li>Quantity: {product.quantity} {unit ? unit.name : null}</li>
                { category ? <li>Category: {category.name}</li> : null }
                {product.freezingDate && <li>Freezing Date: {product.freezingDate
                    ? formatDMY(product.freezingDate)
                    : ''}
                </li>}
                {product.expirationDate && <li>Expiration Date: {product.expirationDate
                    ? formatDMY(product.expirationDate)
                    : ''}
                </li>}
                {product.photoUrl && <li>Picture: <img
                    src={getImageSrc(product.photoUrl)}
                    alt="QR Code"
                    className="w-30 h-30"
                    />
                </li>}
                <li>QR Code: 
                    <div className='flex flex-col gap-2'>
                        <img
                        src={product.qrCodeUrl}
                        alt="Product"
                        className="w-30 h-30"
                        />
                        <button
                            type="button"
                            onClick={handleDownload}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 max-w-max"
                        >
                            Download QR Code
                        </button>
                    </div>
                </li>
            </ul>
        </ModalBody>
    </Modal>
    )
}

export default ProductModal
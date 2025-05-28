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
                    className="w-10 h-10 rounded-full"
                    />
                </li>}
                <li>QR Code: <img
                    src={product.qrCodeUrl}
                    alt="Product"
                    className="w-10 h-10 rounded-full"
                    />
                </li>
            </ul>
        </ModalBody>
    </Modal>
    )
}

export default ProductModal
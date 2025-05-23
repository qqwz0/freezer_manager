import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { Timestamp } from 'firebase/firestore';
import { formatYMD } from 'shared/utils';

import {
  getCategoryById
} from 'services/firestoreService';

function ProductModal({show, onClose, product}) {
    if (!product) return null;

    const  [category, setCategory]  = useState(null);

    function getImageSrc(image) {
        if (!image) return null;
        if (typeof image === 'string') return image;
        if (image instanceof File) {
            return URL.createObjectURL(image);
        }
        return null;
    }

    useEffect(() => {
    if (!show || !product?.category) return;   
    let canceled = false;

    getCategoryById(product.category)
        .then(cat => {
        if (!canceled) setCategory(cat);
        })
        .catch(err => {
        console.error("Failed loading category:", err);
        });

    return () => {
        canceled = true;
    };
    }, [show, product?.category]);

    return (
    <Modal show={show} onClose={onClose}>
        <ModalHeader>{product.name}</ModalHeader>
        <ModalBody>
            <ul>
                <li>Quantity: {product.quantity} {product.unit}</li>
                { category ? <li>Category: {category.name}</li> : null }
                <li>Freezing Date: {product.freezingDate
                    ? formatYMD(product.freezingDate)
                    : ''}
                </li>
                <li>Expiration Date: {product.expirationDate
                    ? formatYMD(product.expirationDate)
                    : ''}
                </li>
                <li>Picture: <img
                    src={getImageSrc(product.photoUrl)}
                    alt="QR Code"
                    className="w-10 h-10 rounded-full"
                    />
                </li>
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
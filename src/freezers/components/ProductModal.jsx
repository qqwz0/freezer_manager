import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { Timestamp } from 'firebase/firestore';
import { formatYMD } from 'shared/utils';

function ProductModal({show, onClose, product}) {

    console.log("ProductModal", product);

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
                <li>Quantity: {product.quantity} {product.unit}</li>
                <li>Category: {product.category}</li>
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
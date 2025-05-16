import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { Timestamp } from 'firebase/firestore';

function ProductModal({show, onClose, product}) {;
    function formatYMD(value) {
        // якщо нічого немає — повертаємо пустий рядок
        if (value === null || value === undefined || value === '') {
            return '';
        }

        // отримуємо JS-Date
        const date = value instanceof Timestamp
            ? value.toDate()
            : (value instanceof Date
                ? value
                : new Date(value)
            );

        // якщо дата некоректна — пустий рядок
        if (isNaN(date.getTime())) {
            return '';
        }

        // інакше — у форматі YYYY-MM-DD
        return date.toISOString().split('T')[0];
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
                    src={product.photoUrl}
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
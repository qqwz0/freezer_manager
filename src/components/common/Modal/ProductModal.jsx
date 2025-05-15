import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { Timestamp } from 'firebase/firestore';

function ProductModal({show, onClose, product}) {

    function formatYMD(value) {
        const date = value instanceof Timestamp
            ? value.toDate()
            : new Date(value);
        return date.toISOString().split('T')[0];
        }

    console.log(product.expirationDate)

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
            </ul>
        </ModalBody>
    </Modal>
  )
}

export default ProductModal
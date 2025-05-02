// BaseModal.jsx
import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';

export function BaseModal({ show, onClose, header, children, footer }) {
  return (
    <Modal show={show} onClose={onClose}>
      <ModalHeader>{header}</ModalHeader>
      <ModalBody>
        {children}
      </ModalBody>
      <ModalFooter>
        {footer}
      </ModalFooter>
    </Modal>
  );
}

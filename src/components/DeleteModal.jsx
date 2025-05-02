import React from 'react'
import { Button } from "flowbite-react";
import { useState } from 'react'
import { FormInput } from './FormInput';
import { BaseModal } from './BaseModal';
import AddButton from './AddButton';

function DeleteModal({ 
    show, 
    onClose, 
    onDelete, 
    title, 
}) {

    return (
        <BaseModal
            show={show}
            onClose={onClose}
            header={`Delete ${title}`}
            footer={<AddButton onClick={onDelete} action="Delete">Delete</AddButton>}
        >
            <div className="text-center">
                <p>Are you sure you want to delete this {title}?</p>
                <p>This action cannot be undone.</p>
            </div>
        </BaseModal>
    )
}

export default DeleteModal
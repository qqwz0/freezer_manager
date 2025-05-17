import React, { useState }           from 'react';
import { Button }                    from 'flowbite-react';

import { FormInput }                 from 'components/common/Form';
import { BaseModal }                 from 'components/common/Modal';
import { ActionButton }                 from 'components/common/Button';


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
            footer={<ActionButton onClick={onDelete} action="submit" label={title}>Delete</ActionButton>}
        >
            <div className="text-center">
                <p>Are you sure you want to delete this {title}?</p>
                <p>This action cannot be undone.</p>
            </div>
        </BaseModal>
    )
}

export default DeleteModal
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'flowbite-react'

const icons = {
    delete: (
        <svg
      className="w-6 h-6 text-gray-800 dark:text-white hover:text-red-500 cursor-pointer"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
      />
    </svg>
    ),
    edit: (
      <svg class="w-6 h-6 text-gray-800 dark:text-white hover:text-gray-400 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"/>
      </svg>
    ),
};

export default function ActionButton({action, onClick, children, label}) {
  if (action === 'submit') {
    return (
        <Button
        type="submit"
        onClick={e => {
            e.stopPropagation(); 
            onClick?.(e);
          }}
        className=""
      >
        {children} {label && label}
      </Button>
    )
  } else if (action === 'add') {
    return (
        <Button 
        className='w-full shadow-lg cursor-pointer' 
        color="blue" 
        onClick={e => {
            e.stopPropagation();  
            onClick?.(e);
          }}
        >
         Create {label}
        </Button>
    )
  }

  return (
    <button
        type='button'
        onClick={e => {
            e.stopPropagation();  
            onClick?.(e);
          }}
        aria-label={action}
        className='p-1 focus:outline-none'
    >
        {icons[action]}
    </button>
  )
}

ActionButton.propTypes = {
    variant: PropTypes.oneOf(['delete', 'edit', 'submit']).isRequired,
    onClick: PropTypes.func,
    children: PropTypes.node,
};

ActionButton.defaultProps = {
    onClick: () => {},
    children: null,
}
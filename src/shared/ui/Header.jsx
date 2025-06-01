import React from 'react';
import { Navbar, NavbarBrand, NavbarToggle, NavbarCollapse, NavbarLink,  Button } from 'flowbite-react';
import { HiOutlineHome, HiOutlineViewGrid } from 'react-icons/hi';
import { HiOutlineArchiveBox } from 'react-icons/hi2';

function Header() {
  return (
    <Navbar fluid rounded className="bg-white shadow-sm">
      <NavbarBrand href="/">
        <HiOutlineArchiveBox className="mr-3 h-6 w-6 text-blue-600" />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          Freezer Manager
        </span>
      </NavbarBrand>
      
      <div className="flex md:order-2 gap-2">
        <Button color="light" size="sm" href="/login">
          Login
        </Button>
        <Button color="blue" size="sm" href="/signup">
          Sign Up
        </Button>
        <NavbarToggle />
      </div>
      
      <NavbarCollapse>
        <NavbarLink href="/" className="flex items-center gap-2">
          <HiOutlineHome className="h-4 w-4" />
          Home
        </NavbarLink>
        <NavbarLink href="/dashboard" className="flex items-center gap-2">
          <HiOutlineViewGrid className="h-4 w-4" />
          Dashboard
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default Header;
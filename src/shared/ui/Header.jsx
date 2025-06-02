import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarToggle, NavbarCollapse, NavbarLink, Button } from 'flowbite-react';
import { HiOutlineHome, HiOutlineViewGrid } from 'react-icons/hi';
import { HiOutlineArchiveBox } from 'react-icons/hi2';

function Header() {
  return (
    <Navbar fluid rounded className="bg-white shadow-sm">
      <NavbarBrand as={Link} to="/">
        <HiOutlineArchiveBox className="mr-3 h-6 w-6 text-blue-600" />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          Freezer Manager
        </span>
      </NavbarBrand>
      
      <div className="flex md:order-2 gap-2">
        <Link to="/login">
          <Button color="light" size="sm">
            Login
          </Button>
        </Link>
        <Link to="/signup">
          <Button color="blue" size="sm">
            Sign Up
          </Button>
        </Link>
        <NavbarToggle />
      </div>
      
      <NavbarCollapse>
        <NavbarLink as={Link} to="/" className="flex items-center gap-2">
          <HiOutlineHome className="h-4 w-4" />
          Home
        </NavbarLink>
        <NavbarLink as={Link} to="/dashboard" className="flex items-center gap-2">
          <HiOutlineViewGrid className="h-4 w-4" />
          Dashboard
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default Header;
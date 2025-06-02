import React from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarToggle,
  NavbarCollapse,
  NavbarLink,
  Button,
} from 'flowbite-react';
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

      {/* 
        Inline buttons: hidden by default,
        become flex only at viewport ≥ 425px 
      */}
      <div className="flex order-2 items-center gap-2">
        <div className="hidden [@media(min-width:425px)]:flex gap-2">
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
        </div>
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

        {/*
          On small screens (< 425px), show Login/Sign Up inside collapse.
          So we make these block by default, then hide at ≥ 425px.
        */}
        <NavbarLink
          as={Link}
          to="/login"
          className="block mt-2 [@media(min-width:425px)]:hidden"
        >
          Login
        </NavbarLink>
        <NavbarLink
          as={Link}
          to="/signup"
          className="block [@media(min-width:425px)]:hidden"
        >
          Sign Up
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default Header;

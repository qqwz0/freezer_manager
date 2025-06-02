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
import { useAuth } from 'contexts/AuthContext';
import { logout } from 'services/auth';

function Header() {
  const user = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Navbar fluid rounded className="bg-white shadow-sm">
      {/* Brand / Logo */}
      <NavbarBrand as={Link} to="/">
        <HiOutlineArchiveBox className="mr-3 h-6 w-6 text-blue-600" />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          Freezer Manager
        </span>
      </NavbarBrand>

      {/* Right side: login/logout buttons (desktop) + Toggle button */}
      <div className="flex order-2 items-center gap-2">
        {/* Desktop: hidden on <640px, flex on ≥640px */}
        <div className="hidden sm:flex gap-2">
          {user ? (
            <>
              <span className="text-sm text-gray-700 dark:text-white self-center">
                {user.email}
              </span>
              <Button color="gray" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* This is the hamburger toggle for small screens */}
        <NavbarToggle />
      </div>

      {/* Collapsible menu (mobile) */}
      <NavbarCollapse>
        {/* Always visible link */}
        <NavbarLink as={Link} to="/" className="flex items-center gap-2">
          <HiOutlineHome className="h-4 w-4" />
          Home
        </NavbarLink>

        {/* Dashboard link if logged in */}
        {user && (
          <NavbarLink as={Link} to="/dashboard" className="flex items-center gap-2">
            <HiOutlineViewGrid className="h-4 w-4" />
            Dashboard
          </NavbarLink>
        )}

        {/* Mobile-only: show “Login/Sign Up” when not logged in */}
        {!user && (
          <>
            <NavbarLink
              as={Link}
              to="/login"
              className="block mt-2 sm:hidden"
            >
              Login
            </NavbarLink>
            <NavbarLink
              as={Link}
              to="/signup"
              className="block mt-2 sm:hidden"
            >
              Sign Up
            </NavbarLink>
          </>
        )}

        {/* Mobile-only: show email + “Log out” when logged in */}
        {user && (
          <>
            <NavbarLink
              as="span"
              className="block mt-2 text-gray-700 dark:text-white sm:hidden"
            >
              {user.email}
            </NavbarLink>
            <NavbarLink
              as={Link}
              onClick={handleLogout}
              className="block mt-2 text-left sm:hidden"
            >
              Log out
            </NavbarLink>
          </>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}

export default Header;

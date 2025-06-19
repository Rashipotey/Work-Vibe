import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; 
import { BiUser } from "react-icons/bi";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-[100%] bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-[#00B09F]">
            Work Vibe
          </Link>

          <div className="hidden md:flex space-x-8 text-sm font-medium items-center">
            <NavLink to="/favorites" label="Favorites" isActive={isActive} />
            <NavLink to="/about" label="About" isActive={isActive} />
            <NavLink to="/blogs" label="Blogs" isActive={isActive} />
            <NavLink to="/addLoc" label="Add" isActive={isActive} />

            <Link
              to="/profile"
              className={`${
                isActive("/profile") ? "text-[#00B09F] font-semibold" : "text-gray-600"
              } hover:text-[#00B09F] flex items-center`}
              aria-label="Profile"
            >
              <BiUser size={24} />
            </Link>

            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-[#00B09F] text-sm font-medium"
            >
              Logout
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-2 mt-2">
            <NavLink to="/favorites" label="Favorites" isActive={isActive} />
            <NavLink to="/map" label="Map" isActive={isActive} />

            <Link
              to="/profile"
              className={`flex items-center ${
                isActive("/profile") ? "text-[#00B09F] font-semibold" : "text-gray-600"
              } hover:text-[#00B09F] text-sm font-medium`}
              aria-label="Profile"
              onClick={() => setMenuOpen(false)}
            >
              <BiUser size={20} className="mr-2" /> Profile
            </Link>

            <button
              onClick={handleLogout}
              className="text-left text-gray-600 hover:text-[#00B09F] text-sm font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, label, isActive }) {
  return (
    <Link
      to={to}
      className={`${
        isActive(to) ? "text-[#00B09F] font-semibold" : "text-gray-600"
      } hover:text-[#00B09F]`}
    >
      {label}
    </Link>
  );
}

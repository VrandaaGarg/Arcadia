import React from "react";
import { NavLink } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-950 to-purple-950 text-white py-6 px-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {/* Left Section - Website Name & Tagline */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">Arcadia</h2>
          <p className="text-sm text-gray-300">Your Ultimate Gaming Hub 🎮</p>
        </div>

        {/* Center Section - Navigation Links */}
        <nav className="mb-4 md:mb-0">
          <ul className="flex gap-6">
            <li>
              <NavLink to="/" className="hover:text-blue-400 transition-colors">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className="hover:text-blue-400 transition-colors"
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="hover:text-blue-400 transition-colors"
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className="hover:text-blue-400 transition-colors"
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right Section - Social Media Icons */}
        <div className="flex gap-4 text-2xl">
          <a href="#" className="hover:text-blue-400 transition-colors">
            <FaFacebook />
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors">
            <FaLinkedin />
          </a>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-sm text-gray-400 mt-4">
        © {new Date().getFullYear()} Arcadia. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;

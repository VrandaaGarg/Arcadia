import React from "react";
import { NavLink } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaDiscord, FaTwitch, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0B1120] border-t border-cyan-500/20 text-gray-300 py-12 px-4 sm:px-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left space-y-2 hover:transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:from-[#4ECDC4] hover:to-[#FF6B6B] transition-all duration-500">
            Arcadia
          </h2>
          <p className="text-cyan-400/80">Where Gaming Legends Rise 🏆</p>
        </div>

        <div className="flex gap-4 sm:gap-6 text-2xl">
          {[FaTwitter, FaDiscord, FaTwitch, FaYoutube].map((Icon, index) => (
            <a
              key={index}
              href="#"
              className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-125 transform-gpu"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-12 hover:text-gray-400 transition-colors duration-300">
        © {new Date().getFullYear()} Arcadia. Level Up Your Gaming Experience.
      </div>
    </footer>
  );
};

export default Footer;

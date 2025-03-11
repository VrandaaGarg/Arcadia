import React from "react";
import { NavLink } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { MdEmail, MdBugReport } from "react-icons/md";

const Footer = () => {
  const handleBugReport = () => {
    const emailAddress = 'vrandacodz@gmail.com';
    const subject = 'Bug/Feedback Report for Arcadia';
    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <footer className="bg-[#0B1120] border-t border-cyan-500/20 text-gray-300 py-12 px-4 sm:px-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left space-y-2 hover:transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-purple-600 hover:to-cyan-400 transition-all duration-500">
            Arcadia
          </h2>
          <p className="text-cyan-400/80">Where Gaming Legends Rise 🏆</p>
        </div>

        <div className="flex items-center gap-6">
          {/* GitHub Link */}
          <a
            href="https://github.com/VrandaaGarg/Arcadia"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-125 transform-gpu"
          >
            <FaGithub className="text-2xl" />
          </a>

          {/* Email Link */}
          <a
            href="mailto:vrandacodz@gmail.com"
            className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-125 transform-gpu"
          >
            <MdEmail className="text-2xl" />
          </a>

          {/* Bug Report Button */}
          <button
            onClick={handleBugReport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
              hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 rounded-lg 
              transition-all duration-300 hover:scale-105 group"
          >
            <MdBugReport className="text-xl text-cyan-400 group-hover:text-cyan-300" />
            <span className="text-cyan-400 group-hover:text-cyan-300 font-medium">Report Bug</span>
          </button>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-12 hover:text-gray-400 transition-colors duration-300">
        © {new Date().getFullYear()} Arcadia. Level Up Your Gaming Experience.
      </div>
    </footer>
  );
};

export default Footer;

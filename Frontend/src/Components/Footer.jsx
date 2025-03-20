import React from "react";
import { FaGithub } from "react-icons/fa";
import { MdEmail, MdBugReport } from "react-icons/md";

const Footer = () => {
  const handleBugReport = () => {
    const emailAddress = 'vrandacodz@gmail.com';
    const subject = 'Bug/Feedback Report for Arcadia';
    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <footer className="bg-[#0B1120] border-t border-cyan-500/10 text-gray-300 py-6 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5" />
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        {/* Logo Section */}
        <div className="text-center md:text-left group cursor-pointer">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 
            group-hover:from-purple-600 group-hover:to-cyan-400 transition-all duration-500">
            Arcadia
          </h2>
          <p className="text-sm text-cyan-400/60 group-hover:text-cyan-400/80 transition-colors">Gaming Legends Rise 🏆</p>
        </div>

        {/* Links Section */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/VrandaaGarg/Arcadia"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 
              transition-all duration-300 hover:scale-110"
          >
            <FaGithub className="text-xl" />
          </a>

          <a
            href="mailto:vrandacodz@gmail.com"
            className="p-2 rounded-lg hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 
              transition-all duration-300 hover:scale-110"
          >
            <MdEmail className="text-xl" />
          </a>

          <button
            onClick={handleBugReport}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 
              hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/20 rounded-lg 
              transition-all duration-300 hover:scale-105 group"
          >
            <MdBugReport className="text-lg text-cyan-400 group-hover:text-cyan-300" />
            <span className="text-sm text-cyan-400 group-hover:text-cyan-300 font-medium">Report Bug</span>
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-4 hover:text-gray-400 transition-colors duration-300">
        © {new Date().getFullYear()} Arcadia
      </div>
    </footer>
  );
};

export default Footer;

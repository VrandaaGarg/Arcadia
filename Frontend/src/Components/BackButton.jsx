import React from "react";
import { Link, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoCaretBack } from "react-icons/io5";
import { motion } from "framer-motion";

const BackButton = () => {
  const { gameName } = useParams(); // Get gameName dynamically from URL

  return (
    <Link
      to={`/${gameName}`} // Navigate back to the game page dynamically
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center font-semibold w-fit px-2.5 py-2 rounded-lg border border-purple-400 hover:bg-gray-800 transition text-2xl bg-gradient-to-r from-purple-400/75 to-pink-400/75"
      >
        <IoCaretBack className=" text-white transition-transform duration-200 hover:scale-110" />
        <span className="text-white  hidden sm:inline">Back</span>
      </motion.div>
    </Link>
  );
};

export default BackButton;

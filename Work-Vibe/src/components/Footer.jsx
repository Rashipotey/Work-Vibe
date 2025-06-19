import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"

export default function Footer() {
  return (
    <footer className="bg-[#00B09F] border-t mt-auto text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm mb-2 md:mb-0">&copy; {new Date().getFullYear()} Work Vibe. All rights reserved.</p>

        <div className="flex space-x-4">
          <a
            href="https://x.com/PoteyRashi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black"
          >
            <FaXTwitter size={20} />
          </a>
          <a
            href="https://github.com/Rashipotey"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://linkedin.com/in/rashipotey"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black"
          >
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}

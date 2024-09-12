import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/Qodeit.png"

const Navbar = () => {
  return (
    <div className="w-full bg-zinc-700 h-[9vh] flex items-center justify-between text-white px-4">
      <div>
        <img className="w-16 sm:w-20" src={`${logo}`} alt="Qodeit Logo" />
      </div>

      <div className="flex items-center justify-center gap-4 sm:gap-6">
        <Link
          className="text-sm transition sm:text-base hover:text-zinc-300 hover:scale-105"
          to="/LoginIntern"
        >
          Intern Login
        </Link>
        <Link
          className="text-sm transition sm:text-base hover:text-zinc-300 hover:scale-105"
          to="/"
        >
          HR Login
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

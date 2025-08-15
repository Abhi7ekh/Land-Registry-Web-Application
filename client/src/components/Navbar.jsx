import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Register Land", path: "/register-land" },
    { label: "View Lands", path: "/view-lands" },
  ];

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-600">🏛️ Land Registry DApp</h1>
      <ul className="flex space-x-6">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`text-sm font-medium ${
                location.pathname === item.path
                  ? "text-indigo-600 underline"
                  : "text-gray-700 hover:text-indigo-500"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;

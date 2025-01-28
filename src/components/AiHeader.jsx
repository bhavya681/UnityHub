import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const AiHeader = () => {
  return (
    <motion.header
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg p-4 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand Name */}
        <motion.div
          className="text-3xl font-extrabold tracking-wide text-white select-none cursor-pointer"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          AI<span className="text-yellow-400">Tools</span>
        </motion.div>

        {/* Navigation Links */}
        <ul className="flex space-x-8 text-lg">
          {[
            { path: '/cartoon-selfie', label: 'Cartoon Selfie' },
            { path: '/face-cutout', label: 'Face Cutout' },
            { path: '/remove-background', label: 'Remove Background' },
            { path: '/passport-photo', label: 'Passport Photo' },
          ].map((link, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 * index,
                duration: 0.4,
                ease: 'easeOut',
              }}
            >
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `transition duration-300 px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 hover:text-gray-900 ${
                    isActive
                      ? 'bg-yellow-400 text-gray-900'
                      : 'text-white hover:shadow-md'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
};

export default AiHeader;

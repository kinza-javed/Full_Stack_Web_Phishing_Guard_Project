import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, LogOut, LogIn, User } from 'lucide-react';

const Navbar = ({ currentPage, setCurrentPage, isSignedIn, setIsSignedIn, userName = 'User' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    { name: 'Home', href: 'home' },
    { name: 'Report', href: 'report' },
    { name: 'History', href: 'history' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    const isDark = saved === 'dark';
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const handler = (e) => setIsDesktop(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  // Prevent overlap: when drawer open on desktop, push body a bit
  useEffect(() => {
    if (isDesktop && isOpen) {
      document.body.style.paddingLeft = '18rem';
    } else {
      document.body.style.paddingLeft = '0';
    }
    return () => {
      document.body.style.paddingLeft = '0';
    };
  }, [isDesktop, isOpen]);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  const handleNavClick = (href) => {
    setCurrentPage(href);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignIn = () => {
    setIsOpen(false);
    setCurrentPage('auth');
  };

  const handleSignOut = () => {
    setIsOpen(false);
    setShowProfileMenu(false);
    localStorage.removeItem('currentUser');
    
    // Clear scan history when logging out to prevent data leakage
    if (window.clearScanHistory) {
      window.clearScanHistory();
    }
    
    setIsSignedIn(false);
    setCurrentPage('auth');
  };

  const isDrawerOpen = isOpen && !isDesktop;
  const isDesktopDrawerOpen = isOpen && isDesktop;

  return (
    <>
      {/* Top navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-dark-bg/90 backdrop-blur-lg border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setIsOpen((prev) => !prev)}
                className="p-2 rounded-lg bg-white dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-dark-hover border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-200 transition-all duration-300"
                aria-label="Toggle menu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div animate={(isDrawerOpen || isDesktopDrawerOpen) ? { rotate: 180 } : { rotate: 0 }} transition={{ duration: 0.25 }}>
                  {(isDrawerOpen || isDesktopDrawerOpen) ? (
                    <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  )}
                </motion.div>
              </motion.button>

              <motion.button
                onClick={() => handleNavClick('home')}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-glow text-2xl">
                  🦀
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
                  Phishing Guard
                </span>
              </motion.button>
            </div>

            {/* Centered secondary links */}
            <div className="hidden lg:flex flex-1 justify-center items-center space-x-3">
              <button onClick={() => handleNavClick('home')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${currentPage === 'home' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_10px_24px_rgba(99,102,241,0.25)]' : 'bg-white/90 dark:bg-dark-card text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-dark-border shadow-sm hover:bg-white dark:hover:bg-dark-hover'}`}>Dashboard</button>
              <button onClick={() => handleNavClick('api')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${currentPage === 'api' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_10px_24px_rgba(99,102,241,0.25)]' : 'bg-white/90 dark:bg-dark-card text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-dark-border shadow-sm hover:bg-white dark:hover:bg-dark-hover'}`}>API</button>
              <button onClick={() => handleNavClick('contact')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${currentPage === 'contact' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_10px_24px_rgba(99,102,241,0.25)]' : 'bg-white/90 dark:bg-dark-card text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-dark-border shadow-sm hover:bg-white dark:hover:bg-dark-hover'}`}>Contact Us</button>
              <button onClick={() => handleNavClick('about')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${currentPage === 'about' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_10px_24px_rgba(99,102,241,0.25)]' : 'bg-white/90 dark:bg-dark-card text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-dark-border shadow-sm hover:bg-white dark:hover:bg-dark-hover'}`}>About Us</button>
            </div>

            {/* Right actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-dark-hover border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-200 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-400" />
                )}
              </button>

              {isSignedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-[0_10px_24px_rgba(99,102,241,0.25)] hover:shadow-[0_14px_30px_rgba(99,102,241,0.35)] transition-all"
                    aria-label="Profile"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  {showProfileMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/80 dark:bg-dark-card/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-200 dark:border-white/10">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Signed in as</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1 truncate">{userName}</p>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200 flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login / Signup</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Drawer (mobile + desktop) */}
      <AnimatePresence>
        {(isDrawerOpen || isDesktopDrawerOpen) && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl border-r border-gray-200 dark:border-dark-border shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-dark-border">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 hover:-translate-y-[2px] ${
                      currentPage === item.href
                        ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_10px_24px_rgba(99,102,241,0.25)]'
                        : 'bg-white/80 text-gray-900 hover:bg-white dark:bg-dark-card dark:text-gray-200 dark:hover:bg-dark-hover'
                    }`}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg/70 space-y-3">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/80 hover:bg-white text-gray-800 dark:bg-dark-hover dark:hover:bg-dark-border dark:text-gray-200 transition-all duration-200"
                >
                  <span className="text-gray-800 dark:text-gray-300 font-medium">Theme</span>
                  <div className="flex items-center space-x-2">
                    {isDarkMode ? (
                      <>
                        <Sun className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-gray-400">Dark</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-5 h-5 text-indigo-400" />
                        <span className="text-sm text-gray-400">Light</span>
                      </>
                    )}
                  </div>
                </button>

                <button
                  onClick={isSignedIn ? handleSignOut : handleSignIn}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isSignedIn
                      ? 'bg-white/80 hover:bg-white text-gray-900 dark:bg-dark-hover dark:hover:bg-dark-border dark:text-gray-200'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-glow'
                  }`}
                >
                  {isSignedIn ? (
                    <>
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span className="font-medium">Sign In</span>
                    </>
                  )}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

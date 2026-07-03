import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiChevronDown,
  FiCheckCircle
} from 'react-icons/fi';
import './Navbar.css';

// Standardized Auth Storage Keys
const TOKEN_KEY = "token";
const USER_KEY = "user";

export default function Navbar({ onToggleMobileMenu }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Read user role dynamically from backend/localStorage with safe fallback
  const storedUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  const user = storedUser || {
    name: "Vasanth Kumar",
    role: "Workspace User"
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setProfileOpen(false);
    setNotifOpen(false);
    navigate('/login');
  };

  const handleNavigation = (path) => {
    setProfileOpen(false);
    setNotifOpen(false);
    navigate(path);
  };

  return (
    <nav className="orbit-navbar d-flex align-items-center justify-content-between">
      {/* --- Left Section: Mobile Trigger & Search Bar --- */}
      <div className="d-flex align-items-center gap-3">
        {/* Mobile Hamburger Trigger */}
        <button
          type="button"
          className="orbit-nav-hamburger d-lg-none d-flex align-items-center justify-content-center"
          onClick={() => onToggleMobileMenu && onToggleMobileMenu()}
          aria-label="Toggle Sidebar"
        >
          <FiMenu className="fs-5" />
        </button>

        {/* Animated Rounded Search Bar (Prepared for modular expansion) */}
        <div className={`orbit-search-wrapper d-none d-sm-block ${isSearchFocused ? 'focused' : ''}`}>
          <FiSearch className="position-absolute text-muted" style={{ top: '11px', left: '14px', fontSize: '0.9rem' }} />
          <input
            type="text"
            className="orbit-search-input"
            placeholder="Search projects, tasks, team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>

      {/* --- Right Section: Notifications & Profile --- */}
      <div className="d-flex align-items-center gap-2 gap-sm-3">
        {/* Notification Bell with Popover Panel */}
        <div className="position-relative">
          <button
            type="button"
            className={`orbit-nav-icon-btn position-relative ${notifOpen ? 'active' : ''}`}
            title="Notifications"
            aria-label="Notifications"
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
          >
            <FiBell className="fs-5" />
            <span className="orbit-badge-pulse" />
          </button>

          {/* Framer Motion Notification Popover Panel */}
          <AnimatePresence>
            {notifOpen && (
              <>
                <div
                  className="position-fixed top-0 start-0 w-100 h-100"
                  style={{ zIndex: 1045 }}
                  onClick={() => setNotifOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="orbit-popover-panel p-3"
                >
                  <div className="d-flex align-items-center justify-content-between pb-2 mb-2 border-bottom" style={{ borderColor: 'var(--orbit-nav-border)' }}>
                    <span className="fw-semibold small text-dark">Notifications</span>
                    <span className="badge bg-light text-muted border" style={{ fontSize: '0.65rem' }}>0 New</span>
                  </div>
                  <div className="text-center py-4">
                    <FiCheckCircle className="fs-4 text-success mb-2 opacity-75" />
                    <div className="small fw-medium text-dark">No new notifications</div>
                    <small className="text-muted d-block mt-0.5" style={{ fontSize: '0.75rem' }}>
                      You're all caught up across your projects.
                    </small>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Vertical Divider */}
        <div className="vr d-none d-sm-block my-2 mx-1" style={{ color: '#E5E7EB' }} />

        {/* User Profile Pill & Dropdown Popover */}
        <div className="position-relative">
          <div
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className={`orbit-profile-trigger d-flex align-items-center gap-2.5 ${profileOpen ? 'active' : ''}`}
          >
            {/* Avatar Pill */}
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
              style={{ width: '36px', height: '36px', backgroundColor: 'var(--orbit-primary)', fontSize: '0.85rem' }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            {/* Name & Dynamic Backend Role */}
            <div className="d-none d-md-block text-start overflow-hidden">
              <div className="fw-semibold lh-1 text-dark text-truncate" style={{ fontSize: '0.825rem', maxWidth: '120px' }}>
                {user.name}
              </div>
              <small className="text-muted d-block text-truncate mt-1" style={{ fontSize: '0.685rem' }}>
                {user.role || 'Workspace User'}
              </small>
            </div>

            <FiChevronDown className={`small text-muted transition-all d-none d-sm-block ${profileOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Framer Motion Profile Popover */}
          <AnimatePresence>
            {profileOpen && (
              <>
                <div
                  className="position-fixed top-0 start-0 w-100 h-100"
                  style={{ zIndex: 1045 }}
                  onClick={() => setProfileOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="orbit-profile-dropdown"
                >
                  <div className="px-3 py-2 border-bottom mb-1 d-md-none" style={{ borderColor: 'var(--orbit-nav-border)' }}>
                    <div className="fw-semibold text-dark text-truncate small">{user.name}</div>
                    <small className="text-muted d-block text-truncate" style={{ fontSize: '0.7rem' }}>{user.role || 'Workspace User'}</small>
                  </div>

                  <button onClick={() => handleNavigation('/profile')} className="orbit-dropdown-item">
                    <FiUser className="fs-6 text-muted" />
                    <span>My Profile</span>
                  </button>

                  <button onClick={() => handleNavigation('/settings')} className="orbit-dropdown-item">
                    <FiSettings className="fs-6 text-muted" />
                    <span>Settings</span>
                  </button>

                  <div className="border-top my-1" style={{ borderColor: 'var(--orbit-nav-border)' }} />

                  <button onClick={handleLogout} className="orbit-dropdown-item danger">
                    <FiLogOut className="fs-6" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
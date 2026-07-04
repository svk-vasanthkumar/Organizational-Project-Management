import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { showWarning } from './AppToast';
import {
  FiGrid,
  FiFolder,
  FiClock,
  FiUsers,
  FiCheckSquare,
  FiList,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiArchive,
  FiBarChart2,
  FiChevronRight,
  FiChevronUp,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import './Sidebar.css';

const TOKEN_KEY = "token";
const USER_KEY = "user";

const NAVIGATION_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { name: 'Projects', path: '/projects', icon: FiFolder },
  { name: 'Estimation', path: '/estimation', icon: FiClock },
  { name: 'Team Members', path: '/team-members', icon: FiUsers },
  { name: 'Assignment', path: '/assignment', icon: FiCheckSquare },
  { name: 'Tasks', path: '/tasks', icon: FiList },
  { name: 'Time Logs', path: '/time-logs', icon: FiClock },
  { name: 'Performance', path: '/performance', icon: FiTrendingUp },
  { name: 'Project Delivery', path: '/project-delivery', icon: FiCheckCircle },
  { name: 'Breach Logs', path: '/breach-logs', icon: FiAlertCircle },
  { name: 'Closure Snapshot', path: '/closure-snapshots', icon: FiArchive },
  { name: 'Reports', path: '/reports', icon: FiBarChart2 },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Parse user safely from local storage
  const storedUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  const user = storedUser || {
    name: "Vasanth Kumar",
    role: "Administrator"
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setProfileMenuOpen(false);
    setMobileOpen(false);
    navigate('/login');
  };

  // Safe handler to prevent navigation crashes until Profile/Settings modules exist
  const handleSafeRoute = (destination) => {
    setProfileMenuOpen(false);
    showWarning(`Module ${destination} will be connected in the next phase.`);
  };

  const NavigationContent = ({ isMobile = false }) => (
    <div className="d-flex flex-column h-100 justify-content-between position-relative">
      {/* 1. Top Branding Section */}
      <div>
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom"
             style={{ borderColor: 'var(--orbit-sidebar-border)' }}>
          <div className="d-flex align-items-center gap-3">
            {/* Premium Geometric SVG Logo Placeholder */}
            <div
              className="rounded-3 d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
              style={{ width: '36px', height: '36px', backgroundColor: 'var(--orbit-primary)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <span className="fs-5 fw-bold text-white d-block lh-1 tracking-tight">OrbitPM</span>
              <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.625rem', letterSpacing: '0.8px' }}>
                Project Management
              </span>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="btn btn-sm text-muted p-1 d-flex align-items-center justify-content-center border-0"
              aria-label="Close menu"
            >
              <FiX className="fs-5" />
            </button>
          )}
        </div>

        {/* 2. Scrollable Navigation List */}
        <nav className="orbit-sidebar-scroll mt-3 px-3 d-flex flex-column gap-1" style={{ maxHeight: 'calc(100vh - 190px)' }}>
          <div className="px-2 pb-1 text-uppercase fw-semibold" style={{ fontSize: '0.685rem', color: '#6B7280', letterSpacing: '0.5px' }}>
            Menu
          </div>

          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                className={({ isActive }) =>
                  `orbit-nav-link position-relative d-flex align-items-center justify-content-between px-3 py-2 text-decoration-none ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId={isMobile ? 'mobileActiveIndicator' : 'desktopActiveIndicator'}
                        className="position-absolute orbit-active-pill top-50 translate-middle-y"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <div className="d-flex align-items-center gap-3 position-relative z-1">
                      <Icon className="fs-5 nav-icon" />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <FiChevronRight className="text-white opacity-75 small" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* 3. Footer Profile Popover & Version Section */}
      <div className="mt-auto border-top p-3 position-relative" style={{ borderColor: 'var(--orbit-sidebar-border)' }}>
        <AnimatePresence>
          {profileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="orbit-profile-popover position-absolute p-1 mb-2 shadow-lg"
              style={{ bottom: '100%', left: '12px', right: '12px' }}
            >
              <button onClick={() => handleSafeRoute('/profile')} className="orbit-popover-item">
                <FiUser className="fs-6 text-muted" />
                <span>Profile</span>
              </button>
              <button onClick={() => handleSafeRoute('/settings')} className="orbit-popover-item">
                <FiSettings className="fs-6 text-muted" />
                <span>Settings</span>
              </button>
              <div className="border-top my-1" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
              <button onClick={handleLogout} className="orbit-popover-item danger">
                <FiLogOut className="fs-6" />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Card Trigger */}
        <div
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className={`orbit-profile-card d-flex align-items-center justify-content-between p-2.5 mb-2 ${profileMenuOpen ? 'active' : ''}`}
        >
          <div className="d-flex align-items-center gap-2.5 overflow-hidden">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
              style={{ width: '34px', height: '34px', backgroundColor: '#374151', fontSize: '0.85rem' }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'V'}
            </div>
            <div className="overflow-hidden">
              <div className="text-truncate text-white fw-semibold" style={{ fontSize: '0.825rem' }}>
                {user.name}
              </div>
              <div className="text-truncate" style={{ fontSize: '0.7rem', color: 'var(--orbit-sidebar-text)' }}>
                {user.role || 'Administrator'}
              </div>
            </div>
          </div>
          <FiChevronUp className={`fs-6 text-muted transition-all ${profileMenuOpen ? 'rotate-180 text-white' : ''}`} />
        </div>

        {/* Isolated Version Footer */}
        <div className="text-center text-muted" style={{ fontSize: '0.685rem' }}>
          OrbitPM v1.0.0
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Offcanvas Trigger Button */}
      <div className="d-lg-none position-fixed top-0 start-0 p-3 z-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="orbit-mobile-toggle d-flex align-items-center justify-content-center shadow-sm"
          aria-label="Open Sidebar"
        >
          <FiMenu className="fs-5" />
        </button>
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside className="orbit-sidebar-desktop position-fixed top-0 bottom-0 start-0 d-none d-lg-block">
        <NavigationContent isMobile={false} />
      </aside>

      {/* Responsive Mobile Offcanvas Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark d-lg-none"
              style={{ zIndex: 1045 }}
              onClick={() => { setMobileOpen(false); setProfileMenuOpen(false); }}
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2 }}
              className="position-fixed top-0 bottom-0 start-0 d-lg-none offcanvas orbit-mobile-drawer"
              style={{ zIndex: 1050, display: 'block' }}
            >
              <NavigationContent isMobile={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
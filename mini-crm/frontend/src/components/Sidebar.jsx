import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && <div className="sidebar-backdrop" onClick={closeSidebar}></div>}

      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-group">
            <span className="logo-emoji">⚡</span>
            <span className="logo-text">CRM Portal</span>
          </div>
          <button className="sidebar-close-btn" onClick={closeSidebar} aria-label="Close sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li>
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9"></rect>
                  <rect x="14" y="3" width="7" height="5"></rect>
                  <rect x="14" y="12" width="7" height="9"></rect>
                  <rect x="3" y="16" width="7" height="5"></rect>
                </svg>
                <span>Dashboard Overview</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/leads" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Manage Leads</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/add-lead" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="17" y1="11" x2="23" y2="11"></line>
                </svg>
                <span>Add Client Lead</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/analytics" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span>Lead Analytics</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="system-version">Version 1.0.0 (Stable)</div>
        </div>

        <style>{`
          .sidebar-container {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 260px;
            background-color: var(--dark-sidebar);
            display: flex;
            flex-direction: column;
            z-index: 1010;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
            transition: transform var(--transition-normal);
          }
          
          .sidebar-header {
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1.5rem;
            border-bottom: 1px solid var(--dark-sidebar-hover);
          }

          .sidebar-logo-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .logo-emoji {
            font-size: 1.25rem;
          }

          .logo-text {
            font-family: 'Outfit', sans-serif;
            font-size: 1.15rem;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 0.5px;
          }

          .sidebar-close-btn {
            display: none;
            background: transparent;
            border: none;
            color: var(--dark-sidebar-text);
            cursor: pointer;
            padding: 0.25rem;
          }

          .sidebar-close-btn:hover {
            color: white;
          }

          .sidebar-nav {
            flex: 1;
            padding: 1.5rem 0.75rem;
            overflow-y: auto;
          }

          .sidebar-menu {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .sidebar-link {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            padding: 0.75rem 1rem;
            border-radius: var(--radius-sm);
            color: var(--dark-sidebar-text);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9375rem;
            transition: all var(--transition-fast);
          }

          .sidebar-link:hover {
            background-color: var(--dark-sidebar-hover);
            color: var(--dark-sidebar-text-active);
          }

          .sidebar-link.active {
            background-color: var(--primary);
            color: white;
          }

          .sidebar-footer {
            padding: 1.25rem 1.5rem;
            border-top: 1px solid var(--dark-sidebar-hover);
          }

          .system-version {
            font-size: 0.75rem;
            color: var(--dark-sidebar-text);
            opacity: 0.5;
            text-align: center;
          }

          .sidebar-backdrop {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(2px);
            z-index: 1005;
          }

          @media (max-width: 992px) {
            .sidebar-container {
              transform: translateX(-100%);
            }
            .sidebar-container.open {
              transform: translateX(0);
            }
            .sidebar-close-btn {
              display: block;
            }
            .sidebar-backdrop {
              display: block;
            }
          }
        `}</style>
      </aside>
    </>
  );
};

export default Sidebar;

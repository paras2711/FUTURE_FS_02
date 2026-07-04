import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { admin, logout } = useAuth();

  return (
    <header className="navbar-header">
      <div className="navbar-left">
        {/* Mobile menu trigger */}
        <button 
          className="mobile-toggle-btn" 
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Brand identity */}
        <div className="navbar-brand">
          <span className="brand-logo">💼</span>
          <h1 className="brand-title">Client Lead CRM</h1>
        </div>
      </div>

      <div className="navbar-right">
        {admin && (
          <span className="admin-email-badge">
            <span className="admin-status-dot"></span>
            {admin.email}
          </span>
        )}
        <button className="btn btn-secondary btn-sm logout-btn" onClick={logout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>

      {/* Styled Navbar elements inside CSS (appended inline in index.css or added directly here) */}
      <style>{`
        .navbar-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: #ffffff;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          z-index: 1000;
        }
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .mobile-toggle-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: var(--radius-sm);
        }
        .mobile-toggle-btn:hover {
          background-color: var(--bg-main);
          color: var(--text-primary);
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .brand-logo {
          font-size: 1.5rem;
        }
        .brand-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .admin-email-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #f1f5f9;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .admin-status-dot {
          width: 8px;
          height: 8px;
          background-color: #10b981;
          border-radius: 50%;
          display: inline-block;
        }
        .logout-btn {
          border-radius: var(--radius-sm);
        }
        @media (max-width: 992px) {
          .mobile-toggle-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .navbar-header {
            padding: 0 1rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

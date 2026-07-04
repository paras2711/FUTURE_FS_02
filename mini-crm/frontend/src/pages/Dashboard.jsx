import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StatsCard from '../components/StatsCard';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/leads');
      if (res.data.success) {
        setLeads(res.data.data);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load dashboard statistics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Aggregate stats
  const totalCount = leads.length;
  const newCount = leads.filter(l => l.status === 'New').length;
  const contactedCount = leads.filter(l => l.status === 'Contacted').length;
  const convertedCount = leads.filter(l => l.status === 'Converted').length;

  // Get 5 most recent leads
  const recentLeads = leads.slice(0, 5);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard Overview</h2>
          <p className="page-subtitle">Real-time breakdown of your sales pipeline and client contacts</p>
        </div>
        <Link to="/add-lead" className="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Client Lead
        </Link>
      </div>

      {/* Grid of Stats Cards */}
      <div className="stats-grid">
        <StatsCard 
          title="Total Leads" 
          count={totalCount} 
          type="total"
          icon={<span>📊</span>}
        />
        <StatsCard 
          title="New Leads" 
          count={newCount} 
          type="new"
          icon={<span>📥</span>}
        />
        <StatsCard 
          title="Contacted" 
          count={contactedCount} 
          type="contacted"
          icon={<span>📞</span>}
        />
        <StatsCard 
          title="Converted" 
          count={convertedCount} 
          type="converted"
          icon={<span>🏆</span>}
        />
      </div>

      {/* Lower Dashboard Section */}
      <div className="dashboard-row">
        {/* Recent Leads Panel */}
        <div className="dashboard-col card recent-leads-card">
          <div className="card-header-flex">
            <h3 className="card-title">Recent Client Leads</h3>
            <Link to="/leads" className="view-all-link">View All Leads →</Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="empty-recent-state">
              <span className="empty-icon">📁</span>
              <p>No leads found in database. Add a new lead to get started.</p>
            </div>
          ) : (
            <div className="recent-leads-list">
              {recentLeads.map((lead) => (
                <div key={lead._id} className="recent-lead-item">
                  <div className="recent-lead-meta">
                    <span className="recent-lead-name">{lead.name}</span>
                    <span className="recent-lead-email">{lead.email}</span>
                  </div>
                  <div className="recent-lead-details">
                    <span className="recent-lead-source">{lead.source}</span>
                    <span className={`badge badge-${lead.status.toLowerCase()}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Tips Panel */}
        <div className="dashboard-col card quick-actions-card">
          <h3 className="card-title">Lead Management Actions</h3>
          <div className="quick-actions-grid">
            <Link to="/add-lead" className="action-button-link">
              <span className="action-icon">➕</span>
              <div className="action-info">
                <span className="action-title">Create Manual Lead</span>
                <span className="action-desc">Add a lead from offline form, phone call or event</span>
              </div>
            </Link>
            <Link to="/leads" className="action-button-link">
              <span className="action-icon">🔍</span>
              <div className="action-info">
                <span className="action-title">Search & Filter Leads</span>
                <span className="action-desc">Find client details or change lead contact logs</span>
              </div>
            </Link>
            <Link to="/analytics" className="action-button-link">
              <span className="action-icon">📈</span>
              <div className="action-info">
                <span className="action-title">Pipeline Analysis</span>
                <span className="action-desc">Visualize conversion rates across web sources</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .page-subtitle {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          margin-top: 0.15rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .dashboard-row {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 1.5rem;
        }

        @media (max-width: 992px) {
          .dashboard-row {
            grid-template-columns: 1fr;
          }
        }

        .card-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
        }

        .card-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .view-all-link {
          font-size: 0.875rem;
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
          transition: color var(--transition-fast);
        }
        .view-all-link:hover {
          color: var(--primary-hover);
        }

        .recent-leads-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .recent-lead-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          transition: transform var(--transition-fast);
        }

        .recent-lead-item:hover {
          transform: translateX(3px);
        }

        .recent-lead-meta {
          display: flex;
          flex-direction: column;
        }

        .recent-lead-name {
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--text-primary);
        }

        .recent-lead-email {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .recent-lead-details {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .recent-lead-source {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          background-color: white;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }

        .empty-recent-state {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-secondary);
        }

        .empty-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .quick-actions-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .quick-actions-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .action-button-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          text-decoration: none;
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }

        .action-button-link:hover {
          background-color: var(--primary-light);
          border-color: rgba(37, 99, 235, 0.3);
        }

        .action-icon {
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: var(--radius-sm);
          background-color: var(--bg-main);
        }

        .action-button-link:hover .action-icon {
          background-color: white;
        }

        .action-info {
          display: flex;
          flex-direction: column;
        }

        .action-title {
          font-weight: 600;
          font-size: 0.9375rem;
        }

        .action-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

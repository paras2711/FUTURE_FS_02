import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  
  // Note preview modal state
  const [activeNoteLead, setActiveNoteLead] = useState(null);

  const { addToast } = useToast();
  const navigate = useNavigate();

  // Load leads when search or filter values change (debounced search would be nice, but simple trigger is fine)
  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const fetchLeads = async (searchOverride) => {
    try {
      setLoading(true);
      const querySearch = searchOverride !== undefined ? searchOverride : search;
      let url = '/api/leads';
      
      const params = [];
      if (querySearch) params.push(`search=${encodeURIComponent(querySearch)}`);
      if (statusFilter && statusFilter !== 'All') params.push(`status=${encodeURIComponent(statusFilter)}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const res = await axios.get(url);
      if (res.data.success) {
        setLeads(res.data.data);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load leads list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on submit or keyUp
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleSearchClear = () => {
    setSearch('');
    fetchLeads('');
  };

  // Inline status updates
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const res = await axios.patch(`/api/leads/status/${leadId}`, { status: newStatus });
      if (res.data.success) {
        // Update state locally
        setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
        addToast(`Lead status updated to ${newStatus}`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to update lead status.', 'error');
    }
  };

  // Deletion logic
  const openDeleteModal = (lead) => {
    setLeadToDelete(lead);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setLeadToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;
    try {
      const res = await axios.delete(`/api/leads/${leadToDelete._id}`);
      if (res.data.success) {
        setLeads(prev => prev.filter(l => l._id !== leadToDelete._id));
        addToast(`Lead "${leadToDelete.name}" successfully deleted.`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete lead.', 'error');
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="leads-list-page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Client Leads Database</h2>
          <p className="page-subtitle">Search, filter, edit details and keep track of your contacts</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add-lead')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Client Lead
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="controls-row card">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search leads by name..."
              className="form-control search-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" className="search-clear-btn" onClick={handleSearchClear}>×</button>
            )}
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">Search</button>
        </form>

        <div className="filter-group">
          <label className="filter-label" htmlFor="status-filter">Filter Status:</label>
          <select
            id="status-filter"
            className="form-control filter-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Leads</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : leads.length === 0 ? (
        <div className="card empty-leads-card">
          <span className="empty-leads-icon">📁</span>
          <h3>No Leads Found</h3>
          <p>We couldn't find any leads matching your criteria. Try adjusting your query or insert a new record.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Email Address</th>
                <th>Source</th>
                <th>Status</th>
                <th>Notes Preview</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <div className="client-identity">
                      <span className="client-avatar">{lead.name.charAt(0)}</span>
                      <span className="client-name">{lead.name}</span>
                    </div>
                  </td>
                  <td>
                    <a href={`mailto:${lead.email}`} className="client-email-link">{lead.email}</a>
                  </td>
                  <td>
                    <span className="source-tag">{lead.source}</span>
                  </td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      className={`status-select status-select-${lead.status.toLowerCase()}`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Converted">Converted</option>
                    </select>
                  </td>
                  <td>
                    {lead.notes ? (
                      <div className="notes-preview-container">
                        <span className="notes-preview-text">
                          {lead.notes.length > 40 ? `${lead.notes.substring(0, 40)}...` : lead.notes}
                        </span>
                        {lead.notes.length > 40 && (
                          <button 
                            className="notes-expand-btn"
                            onClick={() => setActiveNoteLead(lead)}
                            title="View Full Note"
                          >
                            👁️
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="notes-empty-text">No notes added</span>
                    )}
                  </td>
                  <td>
                    <div className="actions-cell-flex">
                      <button 
                        className="btn btn-secondary btn-sm action-icon-btn"
                        onClick={() => navigate(`/edit-lead/${lead._id}`)}
                        title="Edit Details"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-sm action-icon-btn"
                        onClick={() => openDeleteModal(lead)}
                        title="Delete Lead"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>Confirm Deletion</h3>
            <p>Are you sure you want to permanently delete the lead record for <strong>{leadToDelete?.name}</strong>?</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary btn-sm" onClick={closeDeleteModal}>Cancel</button>
              <button className="btn btn-danger btn-sm" onClick={confirmDeleteLead}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Note Reader Modal Overlay */}
      {activeNoteLead && (
        <div className="modal-overlay" onClick={() => setActiveNoteLead(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'left', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Notes for {activeNoteLead.name}
            </h3>
            <div className="note-full-text-box">
              {activeNoteLead.notes}
            </div>
            <div className="modal-actions" style={{ justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveNoteLead(null)}>Close</button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => {
                  const leadId = activeNoteLead._id;
                  setActiveNoteLead(null);
                  navigate(`/edit-lead/${leadId}`);
                }}
              >
                Edit Notes
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .leads-list-page-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
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

        .controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
          padding: 1.25rem 1.5rem;
        }

        .search-form {
          display: flex;
          gap: 0.75rem;
          flex: 1;
          max-width: 500px;
          min-width: 285px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          color: var(--text-secondary);
          pointer-events: none;
        }

        .search-control {
          padding-left: 2rem;
          padding-right: 2rem;
        }

        .search-clear-btn {
          position: absolute;
          right: 10px;
          background: transparent;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: var(--text-muted);
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .filter-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .filter-control {
          min-width: 150px;
          background-color: white;
        }

        .empty-leads-card {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        }

        .empty-leads-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 0.75rem;
        }

        .client-identity {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .client-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 700;
          border-radius: 50%;
          font-size: 0.875rem;
        }

        .client-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .client-email-link {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .client-email-link:hover {
          color: var(--primary);
          text-decoration: underline;
        }

        .source-tag {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          background-color: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        /* Status Select element styling in-table */
        .status-select {
          padding: 0.35rem 1.75rem 0.35rem 0.75rem;
          font-size: 0.8125rem;
          font-weight: 600;
          border-radius: 9999px;
          border: 1px solid transparent;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.25rem;
          outline: none;
          transition: all var(--transition-fast);
        }

        .status-select-new {
          background-color: var(--status-new-bg);
          color: var(--status-new);
          border-color: rgba(59, 130, 246, 0.2);
        }
        .status-select-contacted {
          background-color: var(--status-contacted-bg);
          color: var(--status-contacted);
          border-color: rgba(245, 158, 11, 0.2);
        }
        .status-select-converted {
          background-color: var(--status-converted-bg);
          color: var(--status-converted);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .notes-preview-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .notes-preview-text {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .notes-expand-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          opacity: 0.6;
          transition: opacity var(--transition-fast);
        }
        .notes-expand-btn:hover {
          opacity: 1;
        }

        .notes-empty-text {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-style: italic;
        }

        .actions-cell-flex {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }

        .action-icon-btn {
          font-size: 0.8125rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.35rem 0.65rem;
        }

        .note-full-text-box {
          max-height: 250px;
          overflow-y: auto;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 1rem;
          white-space: pre-wrap;
          font-size: 0.9375rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default LeadsList;

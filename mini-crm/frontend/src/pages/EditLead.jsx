import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      // Fetch all leads and find matching ID to ensure route compatibility
      const res = await axios.get('/api/leads');
      if (res.data.success) {
        const lead = res.data.data.find(l => l._id === id);
        if (lead) {
          setName(lead.name);
          setEmail(lead.email);
          setSource(lead.source);
          setStatus(lead.status);
          setNotes(lead.notes || '');
        } else {
          addToast('Lead not found in the database.', 'error');
          navigate('/leads');
        }
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to retrieve lead details.', 'error');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Client name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!source.trim()) {
      newErrors.source = 'Lead source is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const res = await axios.put(`/api/leads/${id}`, {
        name,
        email,
        source,
        status,
        notes
      });

      if (res.data.success) {
        addToast(`Lead details for "${name}" successfully updated.`, 'success');
        navigate('/leads');
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Failed to update lead details.';
      addToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="edit-lead-page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Edit Client Lead</h2>
          <p className="page-subtitle">Modify contact data, change status, or add notes for this lead</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/leads')}>
          ← Cancel Changes
        </button>
      </div>

      {/* Form Card */}
      <div className="card form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group col-6">
              <label className="form-label" htmlFor="name">Client Name *</label>
              <input
                type="text"
                id="name"
                className={`form-control ${errors.name ? 'input-error' : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>

            <div className="form-group col-6">
              <label className="form-label" htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? 'input-error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={saving}
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-6">
              <label className="form-label" htmlFor="source">Lead Source *</label>
              <select
                id="source"
                className="form-control"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                disabled={saving}
              >
                <option value="Website Contact Form">Website Contact Form</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Other">Other</option>
              </select>
              {errors.source && <div className="error-text">{errors.source}</div>}
            </div>

            <div className="form-group col-6">
              <label className="form-label" htmlFor="status">Lead Status</label>
              <select
                id="status"
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notes">Notes / Follow-ups</label>
            <textarea
              id="notes"
              className="form-control"
              rows="5"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={saving}
            ></textarea>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/leads')}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Lead Changes'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .edit-lead-page-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
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
        }

        .form-card {
          padding: 2.5rem;
          border-radius: var(--radius-lg);
        }

        .form-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .col-6 {
          flex: 1;
        }

        @media (max-width: 600px) {
          .form-row {
            flex-direction: column;
            gap: 0;
          }
          .form-card {
            padding: 1.5rem;
          }
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
        }

        .input-error {
          border-color: #ef4444;
        }

        .input-error:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }
      `}</style>
    </div>
  );
};

export default EditLead;

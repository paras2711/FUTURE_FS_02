import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const AddLead = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('Website Contact Form');
  const [status, setStatus] = useState('New');
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { addToast } = useToast();
  const navigate = useNavigate();

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

    setLoading(true);
    try {
      const res = await axios.post('/api/leads', {
        name,
        email,
        source,
        status,
        notes
      });

      if (res.data.success) {
        addToast(`Lead for "${name}" successfully created.`, 'success');
        navigate('/leads');
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Failed to create lead.';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSource('Website Contact Form');
    setStatus('New');
    setNotes('');
    setErrors({});
    addToast('Form fields cleared.', 'info');
  };

  return (
    <div className="add-lead-page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Add Client Lead</h2>
          <p className="page-subtitle">Fill in the contact form details below to add a lead to the database</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/leads')}>
          ← Back to Leads
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
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>

            <div className="form-group col-6">
              <label className="form-label" htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? 'input-error' : ''}`}
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
              placeholder="Provide context, details on the client query, or scheduled actions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
            ></textarea>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={loading}
            >
              Reset Fields
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Save Client Lead'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .add-lead-page-container {
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

export default AddLead;

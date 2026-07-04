import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const Analytics = () => {
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
      addToast('Failed to load analytics data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const total = leads.length;

  // 1. Status aggregates
  const newCount = leads.filter(l => l.status === 'New').length;
  const contactedCount = leads.filter(l => l.status === 'Contacted').length;
  const convertedCount = leads.filter(l => l.status === 'Converted').length;

  const newPercent = total > 0 ? Math.round((newCount / total) * 100) : 0;
  const contactedPercent = total > 0 ? Math.round((contactedCount / total) * 100) : 0;
  const convertedPercent = total > 0 ? Math.round((convertedCount / total) * 100) : 0;

  // 2. Source distribution aggregates
  const sources = {};
  leads.forEach(l => {
    sources[l.source] = (sources[l.source] || 0) + 1;
  });

  const sourceData = Object.keys(sources).map(sourceName => ({
    name: sourceName,
    count: sources[sourceName],
    percent: total > 0 ? Math.round((sources[sourceName] / total) * 100) : 0
  })).sort((a, b) => b.count - a.count); // Sort by count descending

  // 3. Simple Conversion Rate
  const conversionRate = total > 0 ? Math.round((convertedCount / total) * 100) : 0;

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="analytics-page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Lead Analytics</h2>
          <p className="page-subtitle">Deep dive statistical metrics mapping customer acquisition performance</p>
        </div>
      </div>

      {/* Summary KPI row */}
      <div className="analytics-kpi-row">
        <div className="card kpi-analytics-card">
          <span className="kpi-label">Conversion Rate</span>
          <h2 className="kpi-value text-success">{conversionRate}%</h2>
          <p className="kpi-desc">Percentage of total leads converted to paying clients</p>
        </div>

        <div className="card kpi-analytics-card">
          <span className="kpi-label">Lead Pipeline Health</span>
          <h2 className="kpi-value text-info">{newCount + contactedCount}</h2>
          <p className="kpi-desc">Total active leads currently being processed (New + Contacted)</p>
        </div>

        <div className="card kpi-analytics-card">
          <span className="kpi-label">Total Contacts Registered</span>
          <h2 className="kpi-value">{total}</h2>
          <p className="kpi-desc">Historical records saved in database</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Status Distribution */}
        <div className="card chart-card">
          <h3 className="chart-title">Status Funnel Distribution</h3>
          <p className="chart-subtitle">Breakdown of leads across stages in the CRM lifecycle</p>
          
          {total === 0 ? (
            <div className="empty-chart">No data available</div>
          ) : (
            <div className="visual-progress-list">
              <div className="progress-item">
                <div className="progress-label-row">
                  <span className="progress-item-name">📥 New Leads</span>
                  <span className="progress-item-vals"><strong>{newCount}</strong> ({newPercent}%)</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill fill-new" style={{ width: `${newPercent}%` }}></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-label-row">
                  <span className="progress-item-name">📞 Contacted Leads</span>
                  <span className="progress-item-vals"><strong>{contactedCount}</strong> ({contactedPercent}%)</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill fill-contacted" style={{ width: `${contactedPercent}%` }}></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-label-row">
                  <span className="progress-item-name">🏆 Converted Clients</span>
                  <span className="progress-item-vals"><strong>{convertedCount}</strong> ({convertedPercent}%)</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill fill-converted" style={{ width: `${convertedPercent}%` }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Source Channels */}
        <div className="card chart-card">
          <h3 className="chart-title">Leads by Referral Source</h3>
          <p className="chart-subtitle">Comparison of lead yields across marketing channels</p>

          {sourceData.length === 0 ? (
            <div className="empty-chart">No data available</div>
          ) : (
            <div className="visual-progress-list source-list">
              {sourceData.map((src, index) => {
                // Generate simple gradient or colors based on index
                const colors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6', '#64748b'];
                const fillColor = colors[index % colors.length];

                return (
                  <div key={src.name} className="progress-item">
                    <div className="progress-label-row">
                      <span className="progress-item-name">🌐 {src.name}</span>
                      <span className="progress-item-vals"><strong>{src.count}</strong> ({src.percent}%)</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${src.percent}%`, backgroundColor: fillColor }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .analytics-page-container {
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
        }

        .analytics-kpi-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .kpi-analytics-card {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1.75rem;
        }

        .kpi-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .kpi-value {
          font-size: 2.5rem;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          color: var(--text-primary);
          line-height: 1.1;
        }

        .text-success { color: var(--status-converted); }
        .text-info { color: var(--status-new); }

        .kpi-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        .chart-card {
          padding: 2rem;
        }

        .chart-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .chart-subtitle {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .visual-progress-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .progress-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .progress-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .progress-item-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .progress-item-vals {
          color: var(--text-secondary);
        }

        .progress-bar-bg {
          height: 10px;
          background-color: var(--bg-main);
          border-radius: 9999px;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .fill-new { background-color: var(--status-new); }
        .fill-contacted { background-color: var(--status-contacted); }
        .fill-converted { background-color: var(--status-converted); }

        .empty-chart {
          text-align: center;
          padding: 4rem 1rem;
          color: var(--text-muted);
          font-style: italic;
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-sm);
        }

        .source-list {
          max-height: 350px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Analytics;

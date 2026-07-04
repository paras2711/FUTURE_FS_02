import React from 'react';

const StatsCard = ({ title, count, icon, type = 'total' }) => {
  // Map type to border and icon background styles
  const typeClasses = {
    total: {
      border: 'stats-border-total',
      bg: 'stats-bg-total',
      color: 'stats-color-total'
    },
    new: {
      border: 'stats-border-new',
      bg: 'stats-bg-new',
      color: 'stats-color-new'
    },
    contacted: {
      border: 'stats-border-contacted',
      bg: 'stats-bg-contacted',
      color: 'stats-color-contacted'
    },
    converted: {
      border: 'stats-border-converted',
      bg: 'stats-bg-converted',
      color: 'stats-color-converted'
    }
  };

  const style = typeClasses[type] || typeClasses.total;

  return (
    <div className={`card stats-card ${style.border}`}>
      <div className="stats-info">
        <span className="stats-label">{title}</span>
        <h3 className="stats-count">{count}</h3>
      </div>
      <div className={`stats-icon-wrapper ${style.bg} ${style.color}`}>
        {icon}
      </div>

      <style>{`
        .stats-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-left: 4px solid transparent;
        }

        .stats-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stats-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stats-count {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .stats-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          font-size: 1.5rem;
        }

        /* Border accents */
        .stats-border-total { border-left-color: #64748b; }
        .stats-border-new { border-left-color: var(--status-new); }
        .stats-border-contacted { border-left-color: var(--status-contacted); }
        .stats-border-converted { border-left-color: var(--status-converted); }

        /* Icon background accents */
        .stats-bg-total { background-color: #f1f5f9; }
        .stats-bg-new { background-color: var(--status-new-bg); }
        .stats-bg-contacted { background-color: var(--status-contacted-bg); }
        .stats-bg-converted { background-color: var(--status-converted-bg); }

        /* Icon color accents */
        .stats-color-total { color: #64748b; }
        .stats-color-new { color: var(--status-new); }
        .stats-color-contacted { color: var(--status-contacted); }
        .stats-color-converted { color: var(--status-converted); }
      `}</style>
    </div>
  );
};

export default StatsCard;

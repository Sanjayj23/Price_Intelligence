import React from 'react';
import type { CommodityRecord } from '../services/api';

interface PriceComparisonProps {
  records: CommodityRecord[];
}

export const PriceComparison: React.FC<PriceComparisonProps> = ({ records }) => {
  if (!records || records.length === 0) {
    return (
      <div className="panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        No records found for the selected filters.
      </div>
    );
  }

  // Only show the single latest transaction
  const displayRecords = records.slice(0, 1);

  return (
    <div className="panel" style={{ padding: '0 0 16px 0' }}>
      <div className="panel-header" style={{ padding: '20px 24px', margin: 0 }}>
        <h3 style={{ fontSize: '18px' }}>Price Comparison</h3>
      </div>
      <div className="table-responsive">
        <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ paddingLeft: '24px' }}>SOURCE</th>
            <th>MIN PRICE</th>
            <th>MODAL PRICE</th>
            <th>MAX PRICE</th>
            <th>ARRIVALS</th>
            <th>PRICE DATE</th>
            <th style={{ paddingRight: '24px' }}>MARKET</th>
          </tr>
        </thead>
        <tbody>
          {displayRecords.map((record, index) => (
            <tr key={`${record.Arrival_Date}-${record.Market}-${record.Variety}-${index}`}>
              <td style={{ paddingLeft: '24px' }}>
                <div className="source-badge">
                  <div className="status-dot" style={{ background: 'var(--accent-yellow)' }}></div>
                  data.gov.in
                  <span style={{ 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    color: 'var(--accent-green)', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '10px',
                    marginLeft: '8px'
                  }}>
                    Latest
                  </span>
                </div>
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>₹{record.Min_Price}</td>
              <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                <span style={{ borderBottom: '2px solid var(--accent-yellow)', paddingBottom: '2px' }}>
                  ₹{record.Modal_Price}
                </span>
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>₹{record.Max_Price}</td>
              <td style={{ color: 'var(--text-secondary)' }}>0.0 T</td>
              <td style={{ color: 'var(--text-secondary)' }}>{record.Arrival_Date}</td>
              <td style={{ color: 'var(--text-secondary)', paddingRight: '24px' }}>{record.Market}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

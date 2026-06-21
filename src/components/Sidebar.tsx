import React, { useMemo } from 'react';

interface SidebarProps {
  filters: {
    state: string;
    district: string;
    market: string;
    commodity: string;
    variety: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
  availableOptions: {
    districts: string[];
    markets: string[];
    varieties: string[];
  }
}

export const Sidebar: React.FC<SidebarProps> = ({ filters, onFilterChange, onReset, availableOptions }) => {
  const quickSelect = ['Onion', 'Wheat', 'Tomato', 'Potato', 'Rice', 'Maize', 'Apple', 'Banana'];
  const popularStates = ['Maharashtra', 'Uttar Pradesh', 'Rajasthan', 'Karnataka', 'Punjab', 'Gujarat', 'Haryana'];

  // Full list of states for the dropdown
  const allStates = [
    "Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", 
    "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", 
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const allCommodities = [
    "Wheat", "Paddy(Dhan)(Common)", "Rice", "Maize", "Bajra(Pearl Millet/Cumbu)", "Sorghum(Jowar)",
    "Potato", "Onion", "Tomato", "Apple", "Banana", "Cotton", "Groundnut", "Mustard", "Soyabean"
  ].sort();

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>FILTERS</h3>
        <button className="reset-btn" onClick={onReset}>Reset</button>
      </div>

      <div className="input-group">
        <label>State</label>
        <select value={filters.state} onChange={e => onFilterChange('state', e.target.value)}>
          <option value="All States">All States</option>
          {allStates.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="input-group">
        <label>District</label>
        <select value={filters.district} onChange={e => onFilterChange('district', e.target.value)}>
          <option value="All Districts">All Districts</option>
          {availableOptions.districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="input-group">
        <label>Market / Mandi</label>
        <select value={filters.market} onChange={e => onFilterChange('market', e.target.value)}>
          <option value="All Markets">All Markets</option>
          {availableOptions.markets.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="input-group">
        <label>Commodity</label>
        <select value={filters.commodity} onChange={e => onFilterChange('commodity', e.target.value)}>
          <option value="All Commodities">All Commodities</option>
          {allCommodities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="input-group">
        <label>Variety</label>
        <select value={filters.variety} onChange={e => onFilterChange('variety', e.target.value)}>
          <option value="All Varieties">All Varieties</option>
          {availableOptions.varieties.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <div style={{ marginTop: '16px' }}>
        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', display: 'block' }}>Quick select</label>
        <div className="pill-container">
          {quickSelect.map(c => (
            <button 
              key={c} 
              className={`pill ${filters.commodity === c ? 'active' : ''}`}
              onClick={() => onFilterChange('commodity', c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', display: 'block' }}>Popular states</label>
        <div className="pill-container">
          {popularStates.map(s => (
            <button 
              key={s} 
              className={`pill ${filters.state === s ? 'active' : ''}`}
              onClick={() => onFilterChange('state', s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

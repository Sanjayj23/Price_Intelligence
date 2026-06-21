import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  data: Array<{
    date: string;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
  }>;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <div className="panel" style={{ height: '400px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px' }}>7-Day Price Trend</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="status-pill" style={{ background: 'transparent', border: '1px solid var(--panel-border)' }}>
            <div className="status-dot" style={{ background: 'var(--accent-pink)' }}></div>
            <span style={{ color: 'var(--text-secondary)' }}>Veg Market Price</span>
          </div>
          <div className="status-pill" style={{ background: 'transparent', border: '1px solid var(--accent-yellow)' }}>
            <div className="status-dot" style={{ background: 'var(--accent-yellow)' }}></div>
            <span style={{ color: 'var(--text-primary)' }}>data.gov.in</span>
          </div>
          <div className="status-pill" style={{ background: 'transparent', border: '1px solid var(--panel-border)' }}>
            <div className="status-dot" style={{ background: 'var(--accent-blue)' }}></div>
            <span style={{ color: 'var(--text-secondary)' }}>eNAM</span>
          </div>
        </div>
      </div>

      {(!data || data.length === 0) ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          No trend data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickMargin={10}
              minTickGap={30}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
              width={60}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Area 
              type="monotone" 
              dataKey="avgPrice" 
              name="Modal Price" 
              stroke="#f59e0b" 
              strokeWidth={3}
              fillOpacity={0} 
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
      
      <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Modal price (₹/quintal) — toggle sources above to compare
      </div>
    </div>
  );
};

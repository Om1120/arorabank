import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { spendingCategoryData } from '../../services/initialData';
import { formatCurrency } from '../../services/transactionService';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '0.8rem',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontWeight: 600 }}>{data.name}</div>
        <div className="font-mono text-emerald mt-1">{formatCurrency(data.value)}</div>
      </div>
    );
  }
  return null;
};

export const SpendingPieChart = () => {
  const total = spendingCategoryData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="d-flex flex-column align-items-center">
      <div style={{ width: '100%', height: 200, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={spendingCategoryData}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {spendingCategoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
            Outflow
          </div>
          <div className="font-mono fw-bold" style={{ fontSize: '0.85rem', color: 'var(--aurora-navy)' }}>
            ₹{(total / 1000).toFixed(0)}k
          </div>
        </div>
      </div>

      {/* Category legend */}
      <div className="w-100 d-flex flex-wrap gap-2 justify-content-center mt-2">
        {spendingCategoryData.map((item, idx) => (
          <div key={idx} className="d-flex align-items-center gap-1" style={{ fontSize: '0.72rem', color: '#475569' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }}></span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

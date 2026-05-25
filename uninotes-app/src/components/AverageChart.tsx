// ============================================
// AverageChart - Barra visual de promedio
// ============================================

import React from 'react';

interface Props {
  value: number;
  maxValue?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
}

const AverageChart: React.FC<Props> = ({ value, maxValue = 5.0, color = '#2563EB', label, showValue = true }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  const getColor = (): string => {
    if (color) return color;
    if (value >= 4.0) return '#22C55E';
    if (value >= 3.0) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div style={{ width: '100%' }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
          {label && <span style={{ fontSize: '13px', color: 'var(--uni-text-secondary)' }}>{label}</span>}
          {showValue && <span style={{ fontSize: '15px', fontWeight: 700, color: getColor() }}>{value.toFixed(1)}</span>}
        </div>
      )}
      <div className="average-bar">
        <div className="fill" style={{ width: `${percentage}%`, background: getColor() }} />
      </div>
    </div>
  );
};

export default AverageChart;

// ============================================
// StatCard - Tarjeta de estadística del dashboard
// ============================================

import React from 'react';
import { IonIcon } from '@ionic/react';

interface Props {
  icon: string;
  iconColor: string;
  label: string;
  value: string | number;
}

const StatCard: React.FC<Props> = ({ icon, iconColor, label, value }) => {
  return (
    <div className="stat-card card-enter">
      <div className="stat-icon" style={{ background: iconColor }}>
        <IonIcon icon={icon} />
      </div>
      <div className="stat-info">
        <h3>{label}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;

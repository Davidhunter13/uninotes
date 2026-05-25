// ============================================
// GradeItem - Fila de calificación
// ============================================

import React from 'react';
import { IonItem, IonLabel, IonBadge } from '@ionic/react';
import { Grade } from '../types';

interface Props {
  grade: Grade;
  onDelete?: (id: string) => void;
}

const GradeItem: React.FC<Props> = ({ grade }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 4.0) return '#22C55E';
    if (score >= 3.0) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <IonItem lines="inset" style={{ '--padding-start': '16px' }}>
      <IonLabel>
        <h3 style={{ fontWeight: 600, fontSize: '14px', margin: '0 0 2px' }}>{grade.name}</h3>
        <p style={{ fontSize: '12px', color: 'var(--uni-text-secondary)', margin: 0 }}>
          Porcentaje: {grade.percentage}%
        </p>
      </IonLabel>
      <IonBadge
        slot="end"
        style={{
          background: getScoreColor(grade.score),
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 700,
        }}
      >
        {grade.score.toFixed(1)}
      </IonBadge>
    </IonItem>
  );
};

export default GradeItem;

// ============================================
// SubjectCard - Tarjeta de materia con color
// ============================================

import React from 'react';
import { IonCard, IonCardContent, IonIcon, IonBadge } from '@ionic/react';
import { bookOutline, personOutline, locationOutline } from 'ionicons/icons';
import { Subject } from '../types';

interface Props {
  subject: Subject;
  average?: number;
  onClick?: () => void;
}

const SubjectCard: React.FC<Props> = ({ subject, average, onClick }) => {
  return (
    <IonCard onClick={onClick} button style={{ borderLeft: `4px solid ${subject.color}` }}>
      <IonCardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
              {subject.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <IonIcon icon={personOutline} style={{ fontSize: '14px', color: 'var(--uni-text-secondary)' }} />
              <span style={{ fontSize: '13px', color: 'var(--uni-text-secondary)' }}>{subject.professor}</span>
            </div>
            {subject.room && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <IonIcon icon={locationOutline} style={{ fontSize: '14px', color: 'var(--uni-text-secondary)' }} />
                <span style={{ fontSize: '13px', color: 'var(--uni-text-secondary)' }}>{subject.room}</span>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <IonBadge color="light" style={{ fontSize: '12px', padding: '4px 8px' }}>
              <IonIcon icon={bookOutline} style={{ marginRight: '4px' }} />
              {subject.credits} cr
            </IonBadge>
            {average !== undefined && average > 0 && (
              <p style={{ margin: '8px 0 0', fontSize: '20px', fontWeight: 700, color: subject.color }}>
                {average.toFixed(1)}
              </p>
            )}
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default SubjectCard;

// ============================================
// ScheduleBlock - Bloque de horario
// ============================================

import React from 'react';
import { IonIcon } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import { ScheduleEntry } from '../types';

interface Props {
  entry: ScheduleEntry;
  subjectName: string;
  subjectColor: string;
}

const ScheduleBlock: React.FC<Props> = ({ entry, subjectName, subjectColor }) => {
  return (
    <div className="schedule-block">
      <div className="time-column">
        <span className="time-start">{entry.startTime}</span>
        <span className="time-end">{entry.endTime}</span>
      </div>
      <div className="divider-line" style={{ background: subjectColor }} />
      <div className="class-info" style={{ flex: 1 }}>
        <h4 style={{ color: 'var(--ion-text-color)' }}>{subjectName}</h4>
        <p>
          <IonIcon icon={locationOutline} style={{ fontSize: '12px', marginRight: '4px', verticalAlign: 'middle' }} />
          {entry.room}
        </p>
      </div>
    </div>
  );
};

export default ScheduleBlock;

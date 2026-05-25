// ============================================
// TaskCard - Tarjeta de tarea con checkbox
// ============================================

import React from 'react';
import { IonItem, IonCheckbox, IonLabel, IonIcon, IonNote } from '@ionic/react';
import { calendarOutline, flagOutline } from 'ionicons/icons';
import { Task } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  task: Task;
  subjectName?: string;
  subjectColor?: string;
  onToggle?: (id: string) => void;
  onClick?: () => void;
}

const TaskCard: React.FC<Props> = ({ task, subjectName, subjectColor, onToggle, onClick }) => {
  const dueDate = new Date(task.dueDate);
  const isOverdue = !task.completed && dueDate < new Date();

  return (
    <IonItem
      button
      detail={false}
      onClick={onClick}
      style={{
        '--border-radius': '12px',
        '--padding-start': '12px',
        '--inner-padding-end': '12px',
        marginBottom: '8px',
        opacity: task.completed ? 0.6 : 1,
      }}
    >
      <IonCheckbox
        slot="start"
        checked={task.completed}
        onIonChange={(e) => {
          e.stopPropagation();
          onToggle?.(task.id);
        }}
        style={{ marginRight: '12px' }}
      />
      <IonLabel>
        <h2 style={{
          fontWeight: 600,
          fontSize: '15px',
          textDecoration: task.completed ? 'line-through' : 'none',
          color: 'var(--ion-text-color)',
        }}>
          {task.title}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
          {subjectName && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--uni-text-secondary)' }}>
              <span className="color-dot" style={{ background: subjectColor || '#64748B', width: '8px', height: '8px' }} />
              {subjectName}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px', color: isOverdue ? '#EF4444' : 'var(--uni-text-secondary)' }}>
            <IonIcon icon={calendarOutline} style={{ fontSize: '12px' }} />
            {format(dueDate, "dd MMM", { locale: es })}
          </span>
          <span className={`priority-badge priority-${task.priority}`}>
            <IonIcon icon={flagOutline} style={{ fontSize: '10px', marginRight: '2px' }} />
            {task.priority}
          </span>
        </div>
      </IonLabel>
    </IonItem>
  );
};

export default TaskCard;

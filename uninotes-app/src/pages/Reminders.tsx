// ============================================
// Reminders - Lista de recordatorios
// ============================================

import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonBackButton, IonList, IonItem, IonLabel, IonIcon, IonToggle,
  IonBadge,
} from '@ionic/react';
import { notificationsOutline, calendarOutline, timeOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { ReminderService } from '../services/reminder.service';
import { Reminder } from '../types';
import EmptyState from '../components/EmptyState';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Reminders: React.FC = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => { loadReminders(); }, [user]);

  const loadReminders = () => {
    if (!user) return;
    setReminders(ReminderService.getAll(user.id));
  };

  const handleToggle = (id: string) => {
    ReminderService.toggle(id);
    loadReminders();
  };

  const isUpcoming = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000; // 3 días
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/profile" />
          </IonButtons>
          <IonTitle>Recordatorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ padding: '16px 16px 8px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--uni-text-secondary)' }}>
            Gestiona los recordatorios de tus tareas y actividades académicas.
          </p>
        </div>

        {reminders.length > 0 ? (
          <IonList style={{ padding: '0 8px' }}>
            {reminders.map(reminder => (
              <IonItem key={reminder.id} lines="inset" style={{ '--border-radius': '12px', marginBottom: '4px' }}>
                <IonIcon
                  icon={notificationsOutline}
                  slot="start"
                  color={reminder.active ? 'primary' : 'medium'}
                  style={{ opacity: reminder.active ? 1 : 0.5 }}
                />
                <IonLabel>
                  <h2 style={{ fontWeight: 600, fontSize: '15px' }}>
                    {reminder.title}
                    {isUpcoming(reminder.date) && (
                      <IonBadge color="warning" style={{ marginLeft: '8px', fontSize: '10px', verticalAlign: 'middle' }}>
                        Próximo
                      </IonBadge>
                    )}
                  </h2>
                  <p style={{ fontSize: '13px' }}>{reminder.message}</p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--uni-text-secondary)' }}>
                      <IonIcon icon={calendarOutline} style={{ fontSize: '12px' }} />
                      {format(new Date(reminder.date), "dd MMM yyyy", { locale: es })}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--uni-text-secondary)' }}>
                      <IonIcon icon={timeOutline} style={{ fontSize: '12px' }} />
                      {format(new Date(reminder.date), "HH:mm")}
                    </span>
                  </div>
                </IonLabel>
                <IonToggle
                  slot="end"
                  checked={reminder.active}
                  onIonChange={() => handleToggle(reminder.id)}
                />
              </IonItem>
            ))}
          </IonList>
        ) : (
          <EmptyState
            icon={notificationsOutline}
            title="Sin recordatorios"
            message="No tienes recordatorios configurados."
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Reminders;

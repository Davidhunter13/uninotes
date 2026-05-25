// ============================================
// Dashboard - Pantalla principal
// ============================================

import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonIcon, IonCard, IonCardContent,
  IonList, IonFab, IonFabButton, IonFabList,
} from '@ionic/react';
import {
  bookOutline, clipboardOutline, trophyOutline, timeOutline,
  addOutline, bookmarkOutline, createOutline, calendarOutline,
  notificationsOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SubjectService } from '../services/subject.service';
import { TaskService } from '../services/task.service';
import { GradeService } from '../services/grade.service';
import { ScheduleService } from '../services/schedule.service';
import { ReminderService } from '../services/reminder.service';
import { Subject, Task, ScheduleEntry, WeekDay } from '../types';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import ScheduleBlock from '../components/ScheduleBlock';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<ScheduleEntry[]>([]);
  const [globalAverage, setGlobalAverage] = useState(0);
  const [reminderCount, setReminderCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = () => {
    if (!user) return;
    const subs = SubjectService.getAll(user.id);
    setSubjects(subs);

    const tasks = TaskService.getUpcoming(user.id, 7);
    setPendingTasks(tasks.slice(0, 4));

    const avg = GradeService.getGlobalAverage(user.id, subs.map(s => s.id));
    setGlobalAverage(avg);

    const days: WeekDay[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const todayDay = days[new Date().getDay() - 1];
    if (todayDay) {
      setTodaySchedule(ScheduleService.getByDay(user.id, todayDay));
    }

    const reminders = ReminderService.getUpcoming(user.id, 3);
    setReminderCount(reminders.length);
  };

  const getSubjectById = (id: string) => subjects.find(s => s.id === id);

  const handleToggleTask = (taskId: string) => {
    TaskService.toggleComplete(taskId);
    loadData();
  };

  const allPending = user ? TaskService.getPending(user.id).length : 0;
  const todayStr = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* Header con gradiente */}
        <div className="dashboard-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="welcome">¡Hola, bienvenido!</p>
              <h1 className="user-name">{user?.name || 'Estudiante'}</h1>
              <p style={{ fontSize: '13px', opacity: 0.8, margin: '4px 0 0', textTransform: 'capitalize' }}>{todayStr}</p>
            </div>
            <div
              onClick={() => history.push('/app/profile')}
              style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          {/* Alerta de recordatorios */}
          {reminderCount > 0 && (
            <div
              onClick={() => history.push('/app/reminders')}
              style={{
                marginTop: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.15)',
                borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              }}
            >
              <IonIcon icon={notificationsOutline} style={{ fontSize: '18px' }} />
              <span style={{ fontSize: '13px' }}>Tienes {reminderCount} recordatorio(s) próximo(s)</span>
            </div>
          )}
        </div>

        {/* Estadísticas */}
        <div className="stats-grid">
          <StatCard icon={bookOutline} iconColor="#2563EB" label="Materias" value={subjects.length} />
          <StatCard icon={clipboardOutline} iconColor="#F59E0B" label="Pendientes" value={allPending} />
          <StatCard icon={trophyOutline} iconColor="#22C55E" label="Promedio" value={globalAverage > 0 ? globalAverage.toFixed(1) : '—'} />
          <StatCard icon={timeOutline} iconColor="#7C3AED" label="Hoy" value={`${todaySchedule.length} clases`} />
        </div>

        {/* Tareas Próximas */}
        <h2 className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Tareas Próximas
          <span
            onClick={() => history.push('/app/tasks')}
            style={{ fontSize: '13px', color: 'var(--ion-color-primary)', fontWeight: 500, cursor: 'pointer' }}
          >
            Ver todas
          </span>
        </h2>
        {pendingTasks.length > 0 ? (
          <IonList style={{ padding: '0 16px' }}>
            {pendingTasks.map(task => {
              const sub = getSubjectById(task.subjectId);
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  subjectName={sub?.name}
                  subjectColor={sub?.color}
                  onToggle={handleToggleTask}
                  onClick={() => history.push(`/app/tasks`)}
                />
              );
            })}
          </IonList>
        ) : (
          <IonCard>
            <IonCardContent style={{ textAlign: 'center', color: 'var(--uni-text-secondary)' }}>
              <IonIcon icon={clipboardOutline} style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }} />
              ¡No hay tareas pendientes esta semana!
            </IonCardContent>
          </IonCard>
        )}

        {/* Horario de hoy */}
        <h2 className="section-title" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Horario de Hoy
          <span
            onClick={() => history.push('/app/schedule')}
            style={{ fontSize: '13px', color: 'var(--ion-color-primary)', fontWeight: 500, cursor: 'pointer' }}
          >
            Ver horario
          </span>
        </h2>
        <div style={{ padding: '0 16px 24px' }}>
          {todaySchedule.length > 0 ? (
            todaySchedule.map(entry => {
              const sub = getSubjectById(entry.subjectId);
              return (
                <ScheduleBlock
                  key={entry.id}
                  entry={entry}
                  subjectName={sub?.name || 'Materia'}
                  subjectColor={sub?.color || '#64748B'}
                />
              );
            })
          ) : (
            <IonCard>
              <IonCardContent style={{ textAlign: 'center', color: 'var(--uni-text-secondary)' }}>
                <IonIcon icon={calendarOutline} style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }} />
                No hay clases programadas para hoy
              </IonCardContent>
            </IonCard>
          )}
        </div>

        {/* FAB con acciones rápidas */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end" style={{ marginBottom: '8px', marginRight: '8px' }}>
          <IonFabButton>
            <IonIcon icon={addOutline} />
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton color="primary" onClick={() => history.push('/app/subjects')}>
              <IonIcon icon={bookmarkOutline} />
            </IonFabButton>
            <IonFabButton color="secondary" onClick={() => history.push('/app/create-task')}>
              <IonIcon icon={createOutline} />
            </IonFabButton>
            <IonFabButton color="success" onClick={() => history.push('/app/grades')}>
              <IonIcon icon={trophyOutline} />
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

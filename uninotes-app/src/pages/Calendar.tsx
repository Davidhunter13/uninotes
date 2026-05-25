// ============================================
// Calendar - Calendario académico mensual
// ============================================

import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonButton, IonIcon, IonList, IonBackButton,
} from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline, calendarOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { TaskService } from '../services/task.service';
import { SubjectService } from '../services/subject.service';
import { Task, Subject } from '../types';
import TaskCard from '../components/TaskCard';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    if (!user) return;
    setTasks(TaskService.getAll(user.id));
    setSubjects(SubjectService.getAll(user.id));
  }, [user]);

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  // Generar días del calendario
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  // Tareas del día seleccionado
  const selectedTasks = tasks.filter(t => isSameDay(new Date(t.dueDate), selectedDate));

  // Verificar si un día tiene tareas
  const hasTasks = (date: Date) => tasks.some(t => isSameDay(new Date(t.dueDate), date));

  const handleToggle = (id: string) => {
    TaskService.toggleComplete(id);
    if (user) setTasks(TaskService.getAll(user.id));
  };

  const weekDayHeaders = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/dashboard" />
          </IonButtons>
          <IonTitle>Calendario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Navegación de mes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
          <IonButton fill="clear" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, textTransform: 'capitalize' }}>
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h2>
          <IonButton fill="clear" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <IonIcon icon={chevronForwardOutline} />
          </IonButton>
        </div>

        {/* Grid del calendario */}
        <div className="calendar-grid">
          {weekDayHeaders.map(d => (
            <div key={d} className="day-header">{d}</div>
          ))}
          {days.map(day => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);
            const dayHasTasks = hasTasks(day);

            return (
              <div
                key={day.toISOString()}
                className={`day-cell ${isToday ? 'today' : ''} ${dayHasTasks ? 'has-tasks' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
                onClick={() => setSelectedDate(day)}
                style={{
                  border: isSelected && !isToday ? '2px solid var(--ion-color-primary)' : '2px solid transparent',
                  fontWeight: isToday ? 700 : 400,
                }}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>

        {/* Tareas del día seleccionado */}
        <div style={{ padding: '16px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, textTransform: 'capitalize' }}>
            {isSameDay(selectedDate, new Date()) ? 'Hoy' : format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
          </h3>

          {selectedTasks.length > 0 ? (
            <IonList>
              {selectedTasks.map(task => {
                const sub = getSubject(task.subjectId);
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    subjectName={sub?.name}
                    subjectColor={sub?.color}
                    onToggle={handleToggle}
                  />
                );
              })}
            </IonList>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--uni-text-secondary)' }}>
              <IonIcon icon={calendarOutline} style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }} />
              <p style={{ margin: 0 }}>No hay tareas para este día</p>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Calendar;

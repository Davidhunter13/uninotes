// ============================================
// Tasks - Lista de tareas con filtros
// ============================================

import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonSegment,
  IonSegmentButton, IonLabel, IonList, IonFab, IonFabButton, IonIcon,
} from '@ionic/react';
import { addOutline, clipboardOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TaskService } from '../services/task.service';
import { SubjectService } from '../services/subject.service';
import { Task, Subject } from '../types';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [segment, setSegment] = useState('pending');

  useEffect(() => { loadData(); }, [user]);

  const loadData = () => {
    if (!user) return;
    setSubjects(SubjectService.getAll(user.id));
    setTasks(TaskService.getAll(user.id));
  };

  const handleToggle = (id: string) => {
    TaskService.toggleComplete(id);
    loadData();
  };

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  const filtered = tasks.filter(t => {
    if (segment === 'pending') return !t.completed;
    if (segment === 'completed') return t.completed;
    return true;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="gradient-header">
          <IonTitle>Tareas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Resumen */}
        <div style={{ display: 'flex', gap: '12px', padding: '16px', justifyContent: 'center' }}>
          <div style={{
            padding: '8px 20px', borderRadius: '20px',
            background: 'rgba(245,158,11,0.1)', textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#F59E0B' }}>{pendingCount}</p>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--uni-text-secondary)' }}>Pendientes</p>
          </div>
          <div style={{
            padding: '8px 20px', borderRadius: '20px',
            background: 'rgba(34,197,94,0.1)', textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#22C55E' }}>{completedCount}</p>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--uni-text-secondary)' }}>Completadas</p>
          </div>
        </div>

        <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as string)} style={{ padding: '0 16px' }}>
          <IonSegmentButton value="pending"><IonLabel>Pendientes</IonLabel></IonSegmentButton>
          <IonSegmentButton value="completed"><IonLabel>Completadas</IonLabel></IonSegmentButton>
          <IonSegmentButton value="all"><IonLabel>Todas</IonLabel></IonSegmentButton>
        </IonSegment>

        {filtered.length > 0 ? (
          <IonList style={{ padding: '8px 16px' }}>
            {filtered.map(task => {
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
          <EmptyState
            icon={clipboardOutline}
            title={segment === 'completed' ? 'Sin tareas completadas' : 'Sin tareas pendientes'}
            message={segment === 'completed' ? 'Aún no has completado ninguna tarea.' : '¡Excelente! No tienes tareas pendientes.'}
            actionLabel="Crear Tarea"
            onAction={() => history.push('/app/create-task')}
          />
        )}

        <IonFab slot="fixed" vertical="bottom" horizontal="end" style={{ marginBottom: '8px', marginRight: '8px' }}>
          <IonFabButton onClick={() => history.push('/app/create-task')}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tasks;

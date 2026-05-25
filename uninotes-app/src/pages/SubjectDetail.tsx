// ============================================
// SubjectDetail - Detalle de una materia
// ============================================

import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonBackButton, IonSegment, IonSegmentButton, IonLabel, IonIcon,
  IonList, IonCard, IonCardContent, IonFab, IonFabButton, IonModal,
  IonItem, IonInput, IonButton, useIonToast,
} from '@ionic/react';
import { addOutline, trophyOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SubjectService } from '../services/subject.service';
import { TaskService } from '../services/task.service';
import { GradeService } from '../services/grade.service';
import { ScheduleService } from '../services/schedule.service';
import { Subject, Task, Grade, ScheduleEntry } from '../types';
import TaskCard from '../components/TaskCard';
import GradeItem from '../components/GradeItem';
import ScheduleBlock from '../components/ScheduleBlock';
import AverageChart from '../components/AverageChart';
import EmptyState from '../components/EmptyState';
import { clipboardOutline, calendarOutline } from 'ionicons/icons';

const SubjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [segment, setSegment] = useState<string>('tasks');
  const [average, setAverage] = useState(0);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeName, setGradeName] = useState('');
  const [gradeScore, setGradeScore] = useState('');
  const [gradePercentage, setGradePercentage] = useState('');
  const [present] = useIonToast();

  useEffect(() => { loadData(); }, [id, user]);

  const loadData = () => {
    if (!user || !id) return;
    const sub = SubjectService.getById(id);
    if (sub) setSubject(sub);

    setTasks(TaskService.getBySubject(user.id, id));
    setGrades(GradeService.getBySubject(user.id, id));
    setSchedule(ScheduleService.getBySubject(user.id, id));
    setAverage(GradeService.getSubjectAverage(user.id, id));
  };

  const handleToggleTask = (taskId: string) => {
    TaskService.toggleComplete(taskId);
    loadData();
  };

  const handleAddGrade = () => {
    if (!gradeName || !gradeScore || !gradePercentage || !user) {
      present({ message: 'Completa todos los campos.', duration: 2000, color: 'warning' });
      return;
    }
    const score = parseFloat(gradeScore);
    const percentage = parseFloat(gradePercentage);

    if (isNaN(score) || isNaN(percentage) || score < 0 || score > 5 || percentage < 0 || percentage > 100) {
      present({ message: 'Valores inválidos.', duration: 2000, color: 'danger' });
      return;
    }

    GradeService.create({
      subjectId: id,
      name: gradeName,
      score,
      percentage,
      userId: user.id,
    });

    setShowGradeModal(false);
    setGradeName(''); setGradeScore(''); setGradePercentage('');
    present({ message: 'Nota registrada.', duration: 1500, color: 'success' });
    loadData();
  };

  if (!subject) return <IonPage><IonContent><p>Cargando...</p></IonContent></IonPage>;

  const totalPercentage = grades.reduce((sum, g) => sum + g.percentage, 0);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': subject.color, '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/subjects" style={{ color: '#ffffff' }} />
          </IonButtons>
          <IonTitle style={{ color: '#ffffff' }}>{subject.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Info Header */}
        <div style={{ padding: '20px 16px', background: subject.color, color: '#ffffff', borderRadius: '0 0 24px 24px' }}>
          <p style={{ margin: '0 0 4px', opacity: 0.8 }}>{subject.professor}</p>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '13px' }}>{subject.room} • {subject.credits} créditos</p>
          <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px' }}>Promedio</span>
              <span style={{ fontSize: '24px', fontWeight: 700 }}>{average > 0 ? average.toFixed(1) : '—'}</span>
            </div>
            <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.3)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(average / 5) * 100}%`, background: '#ffffff', borderRadius: '3px' }} />
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '12px', opacity: 0.8 }}>{totalPercentage}% evaluado</p>
          </div>
        </div>

        {/* Segmentos */}
        <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as string)} style={{ padding: '8px 16px' }}>
          <IonSegmentButton value="tasks"><IonLabel>Tareas</IonLabel></IonSegmentButton>
          <IonSegmentButton value="grades"><IonLabel>Notas</IonLabel></IonSegmentButton>
          <IonSegmentButton value="schedule"><IonLabel>Horario</IonLabel></IonSegmentButton>
        </IonSegment>

        {/* Tareas */}
        {segment === 'tasks' && (
          tasks.length > 0 ? (
            <IonList style={{ padding: '0 16px' }}>
              {tasks.map(t => (
                <TaskCard key={t.id} task={t} onToggle={handleToggleTask} />
              ))}
            </IonList>
          ) : (
            <EmptyState icon={clipboardOutline} title="Sin tareas" message="No hay tareas para esta materia." />
          )
        )}

        {/* Notas */}
        {segment === 'grades' && (
          <>
            {grades.length > 0 ? (
              <>
                <IonList>
                  {grades.map(g => <GradeItem key={g.id} grade={g} />)}
                </IonList>
                <div style={{ padding: '16px' }}>
                  <AverageChart value={average} label="Promedio de materia" color={subject.color} />
                </div>
              </>
            ) : (
              <EmptyState icon={trophyOutline} title="Sin notas" message="Agrega tu primera calificación." actionLabel="Agregar Nota" onAction={() => setShowGradeModal(true)} />
            )}
            <IonFab slot="fixed" vertical="bottom" horizontal="end" style={{ marginBottom: '8px', marginRight: '8px' }}>
              <IonFabButton onClick={() => setShowGradeModal(true)}>
                <IonIcon icon={addOutline} />
              </IonFabButton>
            </IonFab>
          </>
        )}

        {/* Horario */}
        {segment === 'schedule' && (
          <div style={{ padding: '8px 16px' }}>
            {schedule.length > 0 ? (
              schedule.map(s => (
                <ScheduleBlock key={s.id} entry={s} subjectName={subject.name} subjectColor={subject.color} />
              ))
            ) : (
              <EmptyState icon={calendarOutline} title="Sin horario" message="No hay clases programadas para esta materia." />
            )}
          </div>
        )}

        {/* Modal Agregar Nota */}
        <IonModal isOpen={showGradeModal} onDidDismiss={() => setShowGradeModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => setShowGradeModal(false)}>Cancelar</IonButton>
              </IonButtons>
              <IonTitle>Nueva Nota</IonTitle>
              <IonButtons slot="end">
                <IonButton strong onClick={handleAddGrade}>Guardar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList style={{ padding: '16px' }}>
              <IonItem>
                <IonLabel position="stacked">Nombre de la evaluación</IonLabel>
                <IonInput value={gradeName} onIonInput={(e) => setGradeName(e.detail.value || '')} placeholder="Ej: Parcial 1" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Calificación (0 - 5.0)</IonLabel>
                <IonInput type="number" value={gradeScore} onIonInput={(e) => setGradeScore(e.detail.value || '')} placeholder="Ej: 4.2" min="0" max="5" step="0.1" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Porcentaje (%)</IonLabel>
                <IonInput type="number" value={gradePercentage} onIonInput={(e) => setGradePercentage(e.detail.value || '')} placeholder="Ej: 25" min="0" max="100" />
              </IonItem>
            </IonList>
            <IonCard>
              <IonCardContent style={{ fontSize: '13px', color: 'var(--uni-text-secondary)' }}>
                Porcentaje evaluado hasta ahora: <strong>{totalPercentage}%</strong>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default SubjectDetail;

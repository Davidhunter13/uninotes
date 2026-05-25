// ============================================
// CreateTask - Crear/Editar tarea
// ============================================

import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonBackButton, IonList, IonItem, IonLabel, IonInput, IonSelect,
  IonSelectOption, IonTextarea, IonButton, IonDatetime, IonIcon,
  useIonToast, IonModal,
} from '@ionic/react';
import { saveOutline, calendarOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TaskService } from '../services/task.service';
import { SubjectService } from '../services/subject.service';
import { Subject, TaskPriority } from '../types';

const CreateTask: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const history = useHistory();
  const [present] = useIonToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString());
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!user) return;
    setSubjects(SubjectService.getAll(user.id));

    if (id) {
      const task = TaskService.getAll(user.id).find(t => t.id === id);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setSubjectId(task.subjectId);
        setDueDate(task.dueDate);
        setPriority(task.priority);
      }
    }
  }, [user, id]);

  const handleSave = () => {
    if (!title || !subjectId || !user) {
      present({ message: 'Completa título y materia.', duration: 2000, color: 'warning' });
      return;
    }

    if (id) {
      TaskService.update(id, { title, description, subjectId, dueDate, priority });
      present({ message: 'Tarea actualizada.', duration: 1500, color: 'success' });
    } else {
      TaskService.create({ title, description, subjectId, dueDate, priority, completed: false, userId: user.id });
      present({ message: 'Tarea creada.', duration: 1500, color: 'success' });
    }

    history.goBack();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/tasks" />
          </IonButtons>
          <IonTitle>{id ? 'Editar Tarea' : 'Nueva Tarea'}</IonTitle>
          <IonButtons slot="end">
            <IonButton strong onClick={handleSave}>
              <IonIcon icon={saveOutline} slot="start" />
              Guardar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList style={{ padding: '16px' }}>
          <IonItem>
            <IonLabel position="stacked">Título de la tarea</IonLabel>
            <IonInput value={title} onIonInput={(e) => setTitle(e.detail.value || '')} placeholder="Ej: Taller de derivadas" />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Descripción</IonLabel>
            <IonTextarea value={description} onIonInput={(e) => setDescription(e.detail.value || '')} placeholder="Describe la tarea..." rows={3} />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Materia</IonLabel>
            <IonSelect value={subjectId} onIonChange={(e) => setSubjectId(e.detail.value)} placeholder="Seleccionar materia">
              {subjects.map(s => (
                <IonSelectOption key={s.id} value={s.id}>{s.name}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Prioridad</IonLabel>
            <IonSelect value={priority} onIonChange={(e) => setPriority(e.detail.value)}>
              <IonSelectOption value="alta">🔴 Alta</IonSelectOption>
              <IonSelectOption value="media">🟡 Media</IonSelectOption>
              <IonSelectOption value="baja">🟢 Baja</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem button onClick={() => setShowDatePicker(true)}>
            <IonIcon icon={calendarOutline} slot="start" color="primary" />
            <IonLabel>
              <h3>Fecha de entrega</h3>
              <p>{new Date(dueDate).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </IonLabel>
          </IonItem>
        </IonList>

        {/* Selector de Fecha */}
        <IonModal isOpen={showDatePicker} onDidDismiss={() => setShowDatePicker(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Seleccionar Fecha</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowDatePicker(false)}>Listo</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonDatetime
              value={dueDate}
              onIonChange={(e) => setDueDate(e.detail.value as string)}
              presentation="date-time"
              locale="es-ES"
              style={{ margin: '0 auto' }}
            />
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CreateTask;

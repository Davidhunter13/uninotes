// ============================================
// Schedule - Horario académico semanal
// ============================================

import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonSegment,
  IonSegmentButton, IonLabel, IonFab, IonFabButton, IonIcon,
  IonModal, IonItem, IonInput, IonSelect, IonSelectOption,
  IonButton, IonButtons, IonList, useIonToast,
} from '@ionic/react';
import { addOutline, calendarOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { ScheduleService } from '../services/schedule.service';
import { SubjectService } from '../services/subject.service';
import { Subject, ScheduleEntry, WeekDay } from '../types';
import ScheduleBlock from '../components/ScheduleBlock';
import EmptyState from '../components/EmptyState';

const DAYS: WeekDay[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const SHORT_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const Schedule: React.FC = () => {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<WeekDay>(() => {
    const dayIndex = new Date().getDay() - 1;
    return DAYS[dayIndex >= 0 && dayIndex < 6 ? dayIndex : 0];
  });
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [subjectId, setSubjectId] = useState('');
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('09:00');
  const [room, setRoom] = useState('');
  const [present] = useIonToast();

  useEffect(() => {
    if (!user) return;
    setSubjects(SubjectService.getAll(user.id));
  }, [user]);

  useEffect(() => { loadEntries(); }, [user, selectedDay]);

  const loadEntries = () => {
    if (!user) return;
    setEntries(ScheduleService.getByDay(user.id, selectedDay));
  };

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  const handleSave = () => {
    if (!subjectId || !user) {
      present({ message: 'Selecciona una materia.', duration: 2000, color: 'warning' });
      return;
    }

    ScheduleService.create({
      subjectId,
      day: selectedDay,
      startTime,
      endTime,
      room,
      userId: user.id,
    });

    setShowModal(false);
    setSubjectId(''); setRoom('');
    present({ message: 'Clase agregada al horario.', duration: 1500, color: 'success' });
    loadEntries();
  };

  // Calcular total de horas del día
  const totalHours = entries.reduce((sum, e) => {
    const start = parseInt(e.startTime.split(':')[0]);
    const end = parseInt(e.endTime.split(':')[0]);
    return sum + (end - start);
  }, 0);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="gradient-header">
          <IonTitle>Horario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Selector de día */}
        <IonSegment
          scrollable
          value={selectedDay}
          onIonChange={(e) => setSelectedDay(e.detail.value as WeekDay)}
          style={{ padding: '8px 16px' }}
        >
          {DAYS.map((day, i) => (
            <IonSegmentButton key={day} value={day}>
              <IonLabel>{SHORT_DAYS[i]}</IonLabel>
            </IonSegmentButton>
          ))}
        </IonSegment>

        {/* Info del día */}
        <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>{selectedDay}</h2>
          <span style={{ fontSize: '13px', color: 'var(--uni-text-secondary)' }}>
            {entries.length} clases • {totalHours}h
          </span>
        </div>

        {/* Bloques de horario */}
        <div style={{ padding: '0 16px 100px' }}>
          {entries.length > 0 ? (
            entries.map(entry => {
              const sub = getSubject(entry.subjectId);
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
            <EmptyState
              icon={calendarOutline}
              title="Sin clases"
              message={`No hay clases programadas para ${selectedDay}.`}
              actionLabel="Agregar Clase"
              onAction={() => setShowModal(true)}
            />
          )}
        </div>

        <IonFab slot="fixed" vertical="bottom" horizontal="end" style={{ marginBottom: '8px', marginRight: '8px' }}>
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Modal Agregar Clase */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => setShowModal(false)}>Cancelar</IonButton>
              </IonButtons>
              <IonTitle>Agregar Clase</IonTitle>
              <IonButtons slot="end">
                <IonButton strong onClick={handleSave}>Guardar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList style={{ padding: '16px' }}>
              <IonItem>
                <IonLabel position="stacked">Materia</IonLabel>
                <IonSelect value={subjectId} onIonChange={(e) => setSubjectId(e.detail.value)} placeholder="Seleccionar materia">
                  {subjects.map(s => (
                    <IonSelectOption key={s.id} value={s.id}>{s.name}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Día</IonLabel>
                <IonInput value={selectedDay} disabled />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Hora de inicio</IonLabel>
                <IonInput type="time" value={startTime} onIonInput={(e) => setStartTime(e.detail.value || '07:00')} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Hora de fin</IonLabel>
                <IonInput type="time" value={endTime} onIonInput={(e) => setEndTime(e.detail.value || '09:00')} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Aula</IonLabel>
                <IonInput value={room} onIonInput={(e) => setRoom(e.detail.value || '')} placeholder="Ej: Aula 301" />
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Schedule;

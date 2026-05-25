// ============================================
// Subjects - Lista y gestión de materias
// ============================================

import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonFab,
  IonFabButton, IonIcon, IonModal, IonItem, IonInput, IonButton,
  IonSelect, IonSelectOption, IonList, IonItemSliding, IonItemOptions,
  IonItemOption, useIonToast, IonLabel, IonButtons, IonSearchbar,
} from '@ionic/react';
import { addOutline, trashOutline, createOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SubjectService } from '../services/subject.service';
import { GradeService } from '../services/grade.service';
import { Subject } from '../types';
import SubjectCard from '../components/SubjectCard';
import EmptyState from '../components/EmptyState';
import { bookOutline } from 'ionicons/icons';

const COLORS = ['#2563EB', '#7C3AED', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316'];

const Subjects: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [name, setName] = useState('');
  const [professor, setProfessor] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [credits, setCredits] = useState(3);
  const [room, setRoom] = useState('');
  const [search, setSearch] = useState('');
  const [present] = useIonToast();

  useEffect(() => { loadSubjects(); }, [user]);

  const loadSubjects = () => {
    if (!user) return;
    setSubjects(SubjectService.getAll(user.id));
  };

  const openCreate = () => {
    setEditSubject(null);
    setName(''); setProfessor(''); setColor(COLORS[0]); setCredits(3); setRoom('');
    setShowModal(true);
  };

  const openEdit = (subject: Subject) => {
    setEditSubject(subject);
    setName(subject.name); setProfessor(subject.professor);
    setColor(subject.color); setCredits(subject.credits); setRoom(subject.room || '');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!name || !professor || !user) {
      present({ message: 'Completa nombre y profesor.', duration: 2000, color: 'warning' });
      return;
    }

    if (editSubject) {
      SubjectService.update(editSubject.id, { name, professor, color, credits, room });
      present({ message: 'Materia actualizada.', duration: 1500, color: 'success' });
    } else {
      SubjectService.create({ name, professor, color, credits, room, userId: user.id });
      present({ message: 'Materia creada.', duration: 1500, color: 'success' });
    }

    setShowModal(false);
    loadSubjects();
  };

  const handleDelete = (id: string) => {
    SubjectService.delete(id);
    present({ message: 'Materia eliminada.', duration: 1500, color: 'danger' });
    loadSubjects();
  };

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.professor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="gradient-header">
          <IonTitle>Materias</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar
          value={search}
          onIonInput={(e) => setSearch(e.detail.value || '')}
          placeholder="Buscar materia..."
          style={{ padding: '8px 16px' }}
        />

        {filtered.length > 0 ? (
          <IonList>
            {filtered.map(subject => {
              const avg = user ? GradeService.getSubjectAverage(user.id, subject.id) : 0;
              return (
                <IonItemSliding key={subject.id}>
                  <SubjectCard
                    subject={subject}
                    average={avg}
                    onClick={() => history.push(`/app/subject/${subject.id}`)}
                  />
                  <IonItemOptions side="end">
                    <IonItemOption color="primary" onClick={() => openEdit(subject)}>
                      <IonIcon icon={createOutline} slot="icon-only" />
                    </IonItemOption>
                    <IonItemOption color="danger" onClick={() => handleDelete(subject.id)}>
                      <IonIcon icon={trashOutline} slot="icon-only" />
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              );
            })}
          </IonList>
        ) : (
          <EmptyState
            icon={bookOutline}
            title="Sin materias"
            message="Agrega tu primera materia para comenzar."
            actionLabel="Agregar Materia"
            onAction={openCreate}
          />
        )}

        <IonFab slot="fixed" vertical="bottom" horizontal="end" style={{ marginBottom: '8px', marginRight: '8px' }}>
          <IonFabButton onClick={openCreate}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Modal Crear/Editar */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => setShowModal(false)}>Cancelar</IonButton>
              </IonButtons>
              <IonTitle>{editSubject ? 'Editar Materia' : 'Nueva Materia'}</IonTitle>
              <IonButtons slot="end">
                <IonButton strong onClick={handleSave}>Guardar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList style={{ padding: '16px' }}>
              <IonItem>
                <IonLabel position="stacked">Nombre de la materia</IonLabel>
                <IonInput value={name} onIonInput={(e) => setName(e.detail.value || '')} placeholder="Ej: Cálculo Diferencial" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Profesor</IonLabel>
                <IonInput value={professor} onIonInput={(e) => setProfessor(e.detail.value || '')} placeholder="Ej: Dr. García" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Aula</IonLabel>
                <IonInput value={room} onIonInput={(e) => setRoom(e.detail.value || '')} placeholder="Ej: Aula 301" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Créditos</IonLabel>
                <IonSelect value={credits} onIonChange={(e) => setCredits(e.detail.value)}>
                  {[1, 2, 3, 4, 5, 6].map(c => (
                    <IonSelectOption key={c} value={c}>{c}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Color</IonLabel>
                <div style={{ display: 'flex', gap: '8px', padding: '12px 0', flexWrap: 'wrap' }}>
                  {COLORS.map(c => (
                    <div
                      key={c}
                      onClick={() => setColor(c)}
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%', background: c,
                        border: color === c ? '3px solid var(--ion-text-color)' : '3px solid transparent',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Subjects;

// ============================================
// Grades - Gestión de calificaciones y promedios
// ============================================

import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonList,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon,
  IonFab, IonFabButton, IonModal, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonButton, IonButtons, useIonToast,
  IonAccordionGroup, IonAccordion,
} from '@ionic/react';
import { addOutline, trophyOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { SubjectService } from '../services/subject.service';
import { GradeService } from '../services/grade.service';
import { Subject, Grade } from '../types';
import GradeItem from '../components/GradeItem';
import AverageChart from '../components/AverageChart';
import EmptyState from '../components/EmptyState';

const Grades: React.FC = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [gradesBySubject, setGradesBySubject] = useState<Record<string, Grade[]>>({});
  const [averages, setAverages] = useState<Record<string, number>>({});
  const [globalAverage, setGlobalAverage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [gradeName, setGradeName] = useState('');
  const [gradeScore, setGradeScore] = useState('');
  const [gradePercentage, setGradePercentage] = useState('');
  const [present] = useIonToast();

  useEffect(() => { loadData(); }, [user]);

  const loadData = () => {
    if (!user) return;
    const subs = SubjectService.getAll(user.id);
    setSubjects(subs);

    const gbs: Record<string, Grade[]> = {};
    const avgs: Record<string, number> = {};

    subs.forEach(s => {
      gbs[s.id] = GradeService.getBySubject(user.id, s.id);
      avgs[s.id] = GradeService.getSubjectAverage(user.id, s.id);
    });

    setGradesBySubject(gbs);
    setAverages(avgs);
    setGlobalAverage(GradeService.getGlobalAverage(user.id, subs.map(s => s.id)));
  };

  const handleAddGrade = () => {
    if (!gradeName || !gradeScore || !gradePercentage || !selectedSubjectId || !user) {
      present({ message: 'Completa todos los campos.', duration: 2000, color: 'warning' });
      return;
    }

    const score = parseFloat(gradeScore);
    const percentage = parseFloat(gradePercentage);

    if (isNaN(score) || isNaN(percentage) || score < 0 || score > 5 || percentage < 0 || percentage > 100) {
      present({ message: 'Valores inválidos. Nota: 0-5, Porcentaje: 0-100.', duration: 2000, color: 'danger' });
      return;
    }

    GradeService.create({
      subjectId: selectedSubjectId,
      name: gradeName,
      score,
      percentage,
      userId: user.id,
    });

    setShowModal(false);
    setGradeName(''); setGradeScore(''); setGradePercentage(''); setSelectedSubjectId('');
    present({ message: 'Nota registrada.', duration: 1500, color: 'success' });
    loadData();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="gradient-header">
          <IonTitle>Calificaciones</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Promedio Global */}
        <IonCard style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#ffffff' }}>
          <IonCardContent>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 4px', fontSize: '14px', opacity: 0.85 }}>Promedio Global</p>
              <p style={{ margin: 0, fontSize: '48px', fontWeight: 800 }}>
                {globalAverage > 0 ? globalAverage.toFixed(2) : '—'}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', opacity: 0.7 }}>
                {subjects.length} materias registradas
              </p>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Notas por materia */}
        {subjects.length > 0 ? (
          <IonAccordionGroup>
            {subjects.map(subject => {
              const grades = gradesBySubject[subject.id] || [];
              const avg = averages[subject.id] || 0;
              const totalPct = grades.reduce((sum, g) => sum + g.percentage, 0);

              return (
                <IonAccordion key={subject.id} value={subject.id}>
                  <IonItem slot="header" color="light">
                    <span className="color-dot" style={{ background: subject.color, marginRight: '12px' }} />
                    <IonLabel>
                      <h2 style={{ fontWeight: 600 }}>{subject.name}</h2>
                      <p>{grades.length} notas • {totalPct}% evaluado</p>
                    </IonLabel>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: avg >= 3 ? '#22C55E' : '#EF4444' }}>
                      {avg > 0 ? avg.toFixed(1) : '—'}
                    </span>
                  </IonItem>
                  <div slot="content">
                    {grades.length > 0 ? (
                      <>
                        <IonList>
                          {grades.map(g => <GradeItem key={g.id} grade={g} />)}
                        </IonList>
                        <div style={{ padding: '8px 16px 16px' }}>
                          <AverageChart value={avg} label="Promedio" color={subject.color} />
                        </div>
                      </>
                    ) : (
                      <p style={{ padding: '16px', textAlign: 'center', color: 'var(--uni-text-secondary)' }}>
                        Sin notas registradas
                      </p>
                    )}
                  </div>
                </IonAccordion>
              );
            })}
          </IonAccordionGroup>
        ) : (
          <EmptyState
            icon={trophyOutline}
            title="Sin materias"
            message="Agrega materias para registrar calificaciones."
          />
        )}

        <IonFab slot="fixed" vertical="bottom" horizontal="end" style={{ marginBottom: '8px', marginRight: '8px' }}>
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Modal Agregar Nota */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => setShowModal(false)}>Cancelar</IonButton>
              </IonButtons>
              <IonTitle>Registrar Nota</IonTitle>
              <IonButtons slot="end">
                <IonButton strong onClick={handleAddGrade}>Guardar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList style={{ padding: '16px' }}>
              <IonItem>
                <IonLabel position="stacked">Materia</IonLabel>
                <IonSelect value={selectedSubjectId} onIonChange={(e) => setSelectedSubjectId(e.detail.value)} placeholder="Seleccionar materia">
                  {subjects.map(s => (
                    <IonSelectOption key={s.id} value={s.id}>{s.name}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
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
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Grades;

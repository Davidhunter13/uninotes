// ============================================
// Profile - Perfil del usuario
// ============================================

import React, { useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonList,
  IonItem, IonLabel, IonIcon, IonToggle, IonInput, IonButton,
  IonCard, IonCardContent, useIonToast, useIonAlert,
} from '@ionic/react';
import {
  personOutline, mailOutline, schoolOutline, ribbonOutline,
  moonOutline, settingsOutline, logOutOutline, chevronForwardOutline,
  createOutline, saveOutline, calendarOutline, informationCircleOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SubjectService } from '../services/subject.service';
import { TaskService } from '../services/task.service';
import { GradeService } from '../services/grade.service';
import { ThemeService } from '../services/theme.service';

const Profile: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const history = useHistory();
  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [career, setCareer] = useState(user?.career || '');
  const [semester, setSemester] = useState(user?.semester || '');
  const [darkMode, setDarkMode] = useState(ThemeService.isDarkMode());

  const handleSave = () => {
    updateProfile({ name, career, semester });
    setEditing(false);
    present({ message: 'Perfil actualizado.', duration: 1500, color: 'success' });
  };

  const handleToggleDarkMode = () => {
    const newVal = ThemeService.toggle();
    setDarkMode(newVal);
  };

  const handleLogout = () => {
    presentAlert({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Cerrar Sesión',
          role: 'destructive',
          handler: () => {
            logout();
            history.replace('/login');
          },
        },
      ],
    });
  };

  // Estadísticas
  const totalSubjects = user ? SubjectService.getAll(user.id).length : 0;
  const totalTasks = user ? TaskService.getAll(user.id).length : 0;
  const completedTasks = user ? TaskService.getCompleted(user.id).length : 0;
  const subjects = user ? SubjectService.getAll(user.id) : [];
  const globalAvg = user ? GradeService.getGlobalAverage(user.id, subjects.map(s => s.id)) : 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="gradient-header">
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Avatar y info principal */}
        <div style={{ textAlign: 'center', padding: '24px 16px 16px' }}>
          <div
            className="user-avatar"
            style={{ background: user?.avatarColor || '#2563EB' }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          {editing ? (
            <div style={{ maxWidth: '300px', margin: '0 auto' }}>
              <IonItem style={{ marginBottom: '8px', '--border-radius': '12px' }}>
                <IonIcon icon={personOutline} slot="start" color="medium" />
                <IonInput value={name} onIonInput={(e) => setName(e.detail.value || '')} placeholder="Nombre" />
              </IonItem>
              <IonItem style={{ marginBottom: '8px', '--border-radius': '12px' }}>
                <IonIcon icon={schoolOutline} slot="start" color="medium" />
                <IonInput value={career} onIonInput={(e) => setCareer(e.detail.value || '')} placeholder="Carrera" />
              </IonItem>
              <IonItem style={{ marginBottom: '8px', '--border-radius': '12px' }}>
                <IonIcon icon={ribbonOutline} slot="start" color="medium" />
                <IonInput value={semester} onIonInput={(e) => setSemester(e.detail.value || '')} placeholder="Semestre" />
              </IonItem>
              <IonButton expand="block" onClick={handleSave} style={{ marginTop: '12px' }}>
                <IonIcon icon={saveOutline} slot="start" />
                Guardar
              </IonButton>
            </div>
          ) : (
            <>
              <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700 }}>{user?.name}</h2>
              <p style={{ margin: '0 0 2px', fontSize: '14px', color: 'var(--uni-text-secondary)' }}>
                <IonIcon icon={mailOutline} style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }} />
                {user?.email}
              </p>
              {user?.career && (
                <p style={{ margin: '2px 0', fontSize: '14px', color: 'var(--uni-text-secondary)' }}>
                  <IonIcon icon={schoolOutline} style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }} />
                  {user.career}
                </p>
              )}
              {user?.semester && (
                <p style={{ margin: '2px 0', fontSize: '14px', color: 'var(--uni-text-secondary)' }}>
                  <IonIcon icon={ribbonOutline} style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }} />
                  {user.semester}
                </p>
              )}
              <IonButton fill="outline" size="small" onClick={() => setEditing(true)} style={{ marginTop: '12px' }}>
                <IonIcon icon={createOutline} slot="start" />
                Editar Perfil
              </IonButton>
            </>
          )}
        </div>

        {/* Stats mini */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '0 16px 16px' }}>
          {[
            { label: 'Materias', value: totalSubjects, color: '#2563EB' },
            { label: 'Tareas', value: `${completedTasks}/${totalTasks}`, color: '#22C55E' },
            { label: 'Promedio', value: globalAvg > 0 ? globalAvg.toFixed(1) : '—', color: '#7C3AED' },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '12px 8px', borderRadius: '12px',
              background: `${s.color}15`,
            }}>
              <p style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</p>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--uni-text-secondary)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Opciones */}
        <IonList style={{ padding: '0 16px' }}>
          <IonItem lines="inset" style={{ '--border-radius': '12px', marginBottom: '4px' }}>
            <IonIcon icon={moonOutline} slot="start" color="primary" />
            <IonLabel>Modo Oscuro</IonLabel>
            <IonToggle checked={darkMode} onIonChange={handleToggleDarkMode} />
          </IonItem>

          <IonItem button lines="inset" onClick={() => history.push('/app/calendar')} style={{ '--border-radius': '12px', marginBottom: '4px' }}>
            <IonIcon icon={calendarOutline} slot="start" color="primary" />
            <IonLabel>Calendario Académico</IonLabel>
            <IonIcon icon={chevronForwardOutline} slot="end" color="medium" />
          </IonItem>

          <IonItem button lines="inset" onClick={() => history.push('/app/settings')} style={{ '--border-radius': '12px', marginBottom: '4px' }}>
            <IonIcon icon={settingsOutline} slot="start" color="primary" />
            <IonLabel>Configuración</IonLabel>
            <IonIcon icon={chevronForwardOutline} slot="end" color="medium" />
          </IonItem>

          <IonItem button lines="inset" onClick={() => history.push('/app/reminders')} style={{ '--border-radius': '12px', marginBottom: '4px' }}>
            <IonIcon icon={informationCircleOutline} slot="start" color="primary" />
            <IonLabel>Recordatorios</IonLabel>
            <IonIcon icon={chevronForwardOutline} slot="end" color="medium" />
          </IonItem>
        </IonList>

        {/* Cerrar sesión */}
        <div style={{ padding: '24px 16px 48px' }}>
          <IonButton expand="block" fill="outline" color="danger" onClick={handleLogout}>
            <IonIcon icon={logOutOutline} slot="start" />
            Cerrar Sesión
          </IonButton>
        </div>

        {/* Footer */}
        <IonCard>
          <IonCardContent style={{ textAlign: 'center', color: 'var(--uni-text-secondary)', fontSize: '12px' }}>
            UniNotes v1.0.0 • Gestión Académica Universitaria
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Profile;

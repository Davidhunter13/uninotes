// ============================================
// Settings - Configuración de la aplicación
// ============================================

import React, { useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonBackButton, IonList, IonItem, IonLabel, IonIcon, IonToggle,
  useIonAlert, useIonToast, IonCard, IonCardContent,
} from '@ionic/react';
import {
  moonOutline, trashOutline, informationCircleOutline,
  shieldCheckmarkOutline, schoolOutline,
} from 'ionicons/icons';
import { ThemeService } from '../services/theme.service';
import { STORAGE_KEYS } from '../services/storage.service';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(ThemeService.isDarkMode());
  const [presentAlert] = useIonAlert();
  const [present] = useIonToast();

  const handleToggleDarkMode = () => {
    const newVal = ThemeService.toggle();
    setDarkMode(newVal);
  };

  const handleClearData = () => {
    presentAlert({
      header: '¿Eliminar todos los datos?',
      message: 'Esta acción eliminará todas tus materias, tareas, notas y horarios. No se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar Todo',
          role: 'destructive',
          handler: () => {
            Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
            present({ message: 'Todos los datos han sido eliminados.', duration: 2000, color: 'danger' });
            window.location.reload();
          },
        },
      ],
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/profile" />
          </IonButtons>
          <IonTitle>Configuración</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList style={{ padding: '16px' }}>
          {/* Apariencia */}
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--uni-text-secondary)', padding: '0 16px', textTransform: 'uppercase' }}>
            Apariencia
          </p>
          <IonItem lines="inset" style={{ '--border-radius': '12px', marginBottom: '8px' }}>
            <IonIcon icon={moonOutline} slot="start" color="primary" />
            <IonLabel>
              <h3>Modo Oscuro</h3>
              <p>Cambiar entre tema claro y oscuro</p>
            </IonLabel>
            <IonToggle checked={darkMode} onIonChange={handleToggleDarkMode} />
          </IonItem>

          {/* Datos */}
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--uni-text-secondary)', padding: '16px 16px 0', textTransform: 'uppercase' }}>
            Datos
          </p>
          <IonItem button lines="inset" onClick={handleClearData} style={{ '--border-radius': '12px', marginBottom: '8px' }}>
            <IonIcon icon={trashOutline} slot="start" color="danger" />
            <IonLabel>
              <h3 style={{ color: 'var(--ion-color-danger)' }}>Eliminar Todos los Datos</h3>
              <p>Borrar materias, tareas, notas y horarios</p>
            </IonLabel>
          </IonItem>

          {/* Acerca de */}
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--uni-text-secondary)', padding: '16px 16px 0', textTransform: 'uppercase' }}>
            Acerca de
          </p>
        </IonList>

        <IonCard>
          <IonCardContent>
            <div style={{ textAlign: 'center' }}>
              <IonIcon icon={schoolOutline} style={{ fontSize: '48px', color: 'var(--ion-color-primary)', marginBottom: '8px' }} />
              <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 700 }}>UniNotes</h2>
              <p style={{ margin: '0 0 8px', color: 'var(--uni-text-secondary)', fontSize: '14px' }}>
                Versión 1.0.0
              </p>
              <p style={{ margin: '0 0 4px', color: 'var(--uni-text-secondary)', fontSize: '13px' }}>
                Gestión Académica Universitaria
              </p>
              <p style={{ margin: 0, color: 'var(--uni-text-secondary)', fontSize: '12px' }}>
                Desarrollado con Ionic React + TypeScript
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--uni-text-secondary)', fontSize: '12px' }}>
                  <IonIcon icon={shieldCheckmarkOutline} />
                  Datos locales
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--uni-text-secondary)', fontSize: '12px' }}>
                  <IonIcon icon={informationCircleOutline} />
                  Multiplataforma
                </div>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Settings;

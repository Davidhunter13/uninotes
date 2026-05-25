// ============================================
// RecoverPassword - Recuperar contraseña
// ============================================

import React, { useState } from 'react';
import {
  IonPage, IonContent, IonItem, IonInput, IonButton, IonIcon,
  useIonToast, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
} from '@ionic/react';
import { mailOutline, keyOutline, sendOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

const RecoverPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [present] = useIonToast();

  const handleRecover = () => {
    if (!email) {
      present({ message: 'Ingresa tu correo electrónico.', duration: 2000, color: 'warning' });
      return;
    }

    const result = AuthService.recoverPassword(email);
    present({ message: result.message, duration: 3000, color: result.success ? 'success' : 'danger' });

    if (result.success) {
      setSent(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Recuperar Contraseña</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="auth-container">
          <div className="auth-header">
            <IonIcon icon={keyOutline} className="auth-icon" />
            <h1>¿Olvidaste tu contraseña?</h1>
            <p>Ingresa tu correo y te enviaremos instrucciones</p>
          </div>

          {!sent ? (
            <div className="auth-form">
              <IonItem>
                <IonIcon icon={mailOutline} slot="start" color="medium" />
                <IonInput
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value || '')}
                />
              </IonItem>

              <IonButton expand="block" onClick={handleRecover}>
                <IonIcon icon={sendOutline} slot="start" />
                Enviar Instrucciones
              </IonButton>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <IonIcon icon={mailOutline} style={{ fontSize: '64px', color: 'var(--ion-color-success)' }} />
              <h2>¡Correo Enviado!</h2>
              <p style={{ color: 'var(--uni-text-secondary)' }}>
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RecoverPassword;

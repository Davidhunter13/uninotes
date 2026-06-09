// ============================================
// Login - Inicio de sesión
// ============================================

import React, { useState } from 'react';
import {
  IonPage, IonContent, IonItem, IonInput, IonButton, IonIcon,
  IonText, useIonToast, IonSpinner,
} from '@ionic/react';
import { schoolOutline, mailOutline, lockClosedOutline, logInOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();
  const history = useHistory();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      present({ message: 'Completa todos los campos.', duration: 2000, color: 'warning' });
      return;
    }

    setLoading(true);
    // Simular un pequeño delay
    await new Promise(r => setTimeout(r, 500));
    const result = login(email, password);
    setLoading(false);

    if (result.success) {
      present({ message: result.message, duration: 1500, color: 'success' });
      history.replace('/app/dashboard');
    } else {
      present({ message: result.message, duration: 2000, color: 'danger' });
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="auth-container">
          <div className="auth-header">
            <IonIcon icon={schoolOutline} className="auth-icon" />
            <h1>UniNotes</h1>
            <p>Inicia sesión en tu cuenta</p>
          </div>

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

            <IonItem>
              <IonIcon icon={lockClosedOutline} slot="start" color="medium" />
              <IonInput
                type="password"
                placeholder="Contraseña"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value || '')}
              />
            </IonItem>

            <IonButton expand="block" onClick={handleLogin} disabled={loading}>
              {loading ? <IonSpinner name="crescent" /> : (
                <>
                  <IonIcon icon={logInOutline} slot="start" />
                  Iniciar Sesión
                </>
              )}
            </IonButton>
          </div>

          <div className="auth-links">
            <p>
              <IonText color="primary" onClick={() => history.push('/recover-password')} style={{ cursor: 'pointer' }}>
                ¿Olvidaste tu contraseña?
              </IonText>
            </p>
            <p style={{ marginTop: '8px' }}>
              ¿No tienes cuenta?{' '}
              <IonText color="primary" onClick={() => history.push('/register')} style={{ cursor: 'pointer', fontWeight: 600 }}>
                Regístrate
              </IonText>
            </p>
          </div>

          {/* Credenciales demo */}
          <div style={{ textAlign: 'center', marginTop: '32px', padding: '16px', background: 'var(--ion-card-background)', borderRadius: '12px', boxShadow: 'var(--uni-card-shadow)' }}>
            <p style={{ fontSize: '12px', color: 'var(--uni-text-secondary)', margin: '0 0 8px' }}>
              <strong>Cuenta demo:</strong>
            </p>
            <p style={{ fontSize: '13px', color: 'var(--uni-text-secondary)', margin: '0' }}>
              davidparrra13@gmail.com / 123456
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

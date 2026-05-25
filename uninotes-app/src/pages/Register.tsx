// ============================================
// Register - Registro de usuario
// ============================================

import React, { useState } from 'react';
import {
  IonPage, IonContent, IonItem, IonInput, IonButton, IonIcon,
  IonText, useIonToast, IonSpinner,
} from '@ionic/react';
import { personAddOutline, personOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();
  const history = useHistory();
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      present({ message: 'Completa todos los campos.', duration: 2000, color: 'warning' });
      return;
    }

    if (password !== confirmPassword) {
      present({ message: 'Las contraseñas no coinciden.', duration: 2000, color: 'danger' });
      return;
    }

    if (password.length < 6) {
      present({ message: 'La contraseña debe tener al menos 6 caracteres.', duration: 2000, color: 'warning' });
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = register(name, email, password);
    setLoading(false);

    if (result.success) {
      present({ message: result.message, duration: 2000, color: 'success' });
      history.replace('/login');
    } else {
      present({ message: result.message, duration: 2000, color: 'danger' });
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="auth-container">
          <div className="auth-header">
            <IonIcon icon={personAddOutline} className="auth-icon" />
            <h1>Crear Cuenta</h1>
            <p>Regístrate para comenzar</p>
          </div>

          <div className="auth-form">
            <IonItem>
              <IonIcon icon={personOutline} slot="start" color="medium" />
              <IonInput
                placeholder="Nombre completo"
                value={name}
                onIonInput={(e) => setName(e.detail.value || '')}
              />
            </IonItem>

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

            <IonItem>
              <IonIcon icon={lockClosedOutline} slot="start" color="medium" />
              <IonInput
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onIonInput={(e) => setConfirmPassword(e.detail.value || '')}
              />
            </IonItem>

            <IonButton expand="block" onClick={handleRegister} disabled={loading}>
              {loading ? <IonSpinner name="crescent" /> : (
                <>
                  <IonIcon icon={personAddOutline} slot="start" />
                  Registrarse
                </>
              )}
            </IonButton>
          </div>

          <div className="auth-links">
            <p>
              ¿Ya tienes cuenta?{' '}
              <IonText color="primary" onClick={() => history.push('/login')} style={{ cursor: 'pointer', fontWeight: 600 }}>
                Inicia sesión
              </IonText>
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;

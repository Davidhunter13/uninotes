// ============================================
// Splash Screen - Pantalla de bienvenida
// ============================================

import React, { useEffect } from 'react';
import { IonPage, IonIcon } from '@ionic/react';
import { schoolOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SplashScreen: React.FC = () => {
  const history = useHistory();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        history.replace('/app/dashboard');
      } else {
        history.replace('/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [history, isAuthenticated]);

  return (
    <IonPage>
      <div className="splash-container">
        <IonIcon icon={schoolOutline} className="logo" />
        <h1>UniNotes</h1>
        <p>Gestión Académica Inteligente</p>
      </div>
    </IonPage>
  );
};

export default SplashScreen;

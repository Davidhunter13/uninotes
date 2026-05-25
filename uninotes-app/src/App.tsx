// ============================================
// UniNotes - App Root con Routing y Tabs
// ============================================

import { Redirect, Route } from 'react-router-dom';
import {
  IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton,
  IonIcon, IonLabel, setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  homeOutline, bookOutline, clipboardOutline,
  timeOutline, personOutline,
} from 'ionicons/icons';

// Contexto de autenticación
import { AuthProvider } from './context/AuthContext';

// Páginas públicas (auth)
import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import RecoverPassword from './pages/RecoverPassword';

// Páginas protegidas (tabs)
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import SubjectDetail from './pages/SubjectDetail';
import Tasks from './pages/Tasks';
import CreateTask from './pages/CreateTask';
import Grades from './pages/Grades';
import Schedule from './pages/Schedule';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Reminders from './pages/Reminders';

// Mock data
import { initializeMockData } from './data/mockData';

// Theme
import { ThemeService } from './services/theme.service';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Ionic Dark Mode via body.dark class */
import '@ionic/react/css/palettes/dark.class.css';

/* Theme variables */
import './theme/variables.css';

/* Global custom styles */
import './theme/global.css';

setupIonicReact({
  mode: 'ios', // Estilo iOS para apariencia moderna consistente
});

// Inicializar mock data y tema al arrancar
initializeMockData();
ThemeService.initialize();

// Componente de Tabs para rutas protegidas
const AppTabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/app/dashboard" component={Dashboard} />
      <Route exact path="/app/subjects" component={Subjects} />
      <Route exact path="/app/subject/:id" component={SubjectDetail} />
      <Route exact path="/app/tasks" component={Tasks} />
      <Route exact path="/app/create-task" component={CreateTask} />
      <Route exact path="/app/create-task/:id" component={CreateTask} />
      <Route exact path="/app/grades" component={Grades} />
      <Route exact path="/app/schedule" component={Schedule} />
      <Route exact path="/app/calendar" component={Calendar} />
      <Route exact path="/app/profile" component={Profile} />
      <Route exact path="/app/settings" component={Settings} />
      <Route exact path="/app/reminders" component={Reminders} />
      <Route exact path="/app">
        <Redirect to="/app/dashboard" />
      </Route>
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="dashboard" href="/app/dashboard">
        <IonIcon icon={homeOutline} />
        <IonLabel>Inicio</IonLabel>
      </IonTabButton>
      <IonTabButton tab="subjects" href="/app/subjects">
        <IonIcon icon={bookOutline} />
        <IonLabel>Materias</IonLabel>
      </IonTabButton>
      <IonTabButton tab="tasks" href="/app/tasks">
        <IonIcon icon={clipboardOutline} />
        <IonLabel>Tareas</IonLabel>
      </IonTabButton>
      <IonTabButton tab="schedule" href="/app/schedule">
        <IonIcon icon={timeOutline} />
        <IonLabel>Horarios</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile" href="/app/profile">
        <IonIcon icon={personOutline} />
        <IonLabel>Perfil</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Rutas públicas */}
          <Route exact path="/splash" component={SplashScreen} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/recover-password" component={RecoverPassword} />

          {/* Rutas protegidas con tabs */}
          <Route path="/app" component={AppTabs} />

          {/* Redireccionamiento inicial */}
          <Route exact path="/">
            <Redirect to="/splash" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;

import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/AuthGuards';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Ejercicio 2
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage'; // Ejercicio 3

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

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Rutas Públicas */}
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} /> {/* Ejercicio 2 */}
          
          {/* Rutas Protegidas (Requieren Login) */}
          <Route exact path="/home">
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          </Route>
          
          <Route exact path="/profile"> {/* Ejercicio 3 */}
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          </Route>

          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;

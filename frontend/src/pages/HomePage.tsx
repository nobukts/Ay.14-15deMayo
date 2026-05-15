import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { personCircleOutline, logOutOutline, shieldCheckmarkOutline } from "ionicons/icons";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router-dom";
import { RoleGuard } from "../components/AuthGuards";

const HomePage = () => {
  const { user, logout } = useAuth();
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Inicio</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={logout}>
              <IonIcon icon={logOutOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Bienvenido, {user?.email}</h1>
        
        <IonList>
          {/* Enlace al perfil para probar el Ejercicio 3 */}
          <IonItem button onClick={() => history.push("/profile")}>
            <IonIcon icon={personCircleOutline} slot="start" />
            <IonLabel>Ver mi Perfil (Ejercicio 3)</IonLabel>
          </IonItem>

          {/* EJERCICIO 5: Interfaz Basada en Roles (EP 2.5 d) */}
          {/* El componente RoleGuard se encarga de mostrar esto solo si el usuario es admin */}
          <RoleGuard roles={["admin"]}>
            <IonItem color="light">
              <IonIcon icon={shieldCheckmarkOutline} slot="start" color="primary" />
              <IonLabel color="primary">
                <h2>Panel de Administración</h2>
                <p>Este menú solo es visible para Administradores</p>
              </IonLabel>
            </IonItem>
          </RoleGuard>
        </IonList>

        <div style={{ marginTop: '20px' }}>
          <p>Esta es una ruta protegida. Has iniciado sesión con el rol: <strong>{user?.role}</strong></p>
        </div>

        {/* EJERCICIO 4: Gestión de Sesión y Logout (EP 2.5 c) */}
        {/* Este botón llama a la función logout() que limpia Preferences y el estado global */}
        <IonButton expand="block" color="danger" fill="outline" onClick={logout} style={{ marginTop: '40px' }}>
          Cerrar Sesión (Ejercicio 4)
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;

import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
} from "@ionic/react";
import api from "../api/axiosConfig";

// --- EJERCICIO 3: Consumo de Datos Protegidos - Frontend (EP 2.4) ---
// Esta página carga los datos del perfil del usuario haciendo una petición autenticada.
const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // El Interceptor de Axios añadirá automáticamente el Header Authorization: Bearer <token>
        const response = await api.get("/profile");
        setProfile(response.data);
      } catch (err) {
        console.error("Error al cargar perfil", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message="Cargando perfil..." />
        
        {profile && (
          <IonList>
            <IonItem>
              <IonLabel>
                <h2>Email</h2>
                <p>{profile.email}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Rol</h2>
                <p>{profile.role}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>ID de Usuario</h2>
                <p>{profile.id}</p>
              </IonLabel>
            </IonItem>
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;

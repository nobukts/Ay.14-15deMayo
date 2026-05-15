import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonToast,
  IonLoading,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import api from "../api/axiosConfig";
import { useHistory } from "react-router-dom";

// --- EJERCICIO 2: Implementación del Registro (EP 2.5 a) ---
// Esta página gestiona el registro de nuevos usuarios capturando Email y Password.
const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const history = useHistory();

  const handleRegister = async () => {
    // Validación básica de campos vacíos y coincidencia de contraseña
    if (!email || !password || !confirmPassword) {
      setErrorMsg("Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }

    setShowLoading(true);
    try {
      // Llamada al endpoint de registro del backend
      await api.post("/register", { email, password, role: "user" });
      setSuccessMsg("Registro exitoso. Redirigiendo al login...");
      
      // Tras 2 segundos, redirigimos al login para que el usuario entre
      setTimeout(() => {
        history.push("/login");
      }, 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Error al registrarse");
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Registro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Crear Cuenta</h2>
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Contraseña</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Confirmar Contraseña</IonLabel>
          <IonInput
            type="password"
            value={confirmPassword}
            onIonChange={(e) => setConfirmPassword(e.detail.value ?? "")}
          />
        </IonItem>
        <IonButton expand="block" onClick={handleRegister} style={{ marginTop: '20px' }}>
          Registrarse
        </IonButton>

        <IonLoading isOpen={showLoading} message={"Creando cuenta..."} />
        <IonToast
          isOpen={!!errorMsg}
          message={errorMsg}
          duration={2000}
          color="danger"
          onDidDismiss={() => setErrorMsg("")}
        />
        <IonToast
          isOpen={!!successMsg}
          message={successMsg}
          duration={2000}
          color="success"
          onDidDismiss={() => setSuccessMsg("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;

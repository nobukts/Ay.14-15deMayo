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
} from "@ionic/react";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
  const history = useHistory();

  const handleLogin = async () => {
    console.log("Botón de login clickeado");
    // --- EP 2.6 (a): Validación básica en frontend ---
    if (!email || !password) {
      setErrorMsg("Por favor completa todos los campos");
      return;
    }

    setShowLoading(true);
    console.log("Intentando iniciar sesión con:", email);
    try {
      const response = await api.post("/login", { email, password });
      console.log("Respuesta del servidor:", response.data);
      const { token, user } = response.data;

      // EP 2.5 (c): Manejo de sesión
      await login(user, token);
      console.log("Sesión guardada, redirigiendo a /home");
      history.replace("/home");
    } catch (err) {
      console.error("Error en login:", err);
      const errorMessage = err.response?.data?.error || "Error al conectar con el servidor";
      setErrorMsg(errorMessage);
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Iniciar Sesión</h2>
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
        <IonButton expand="block" onClick={handleLogin} style={{ marginTop: '20px' }}>
          Entrar
        </IonButton>

        {/* Enlace para ir a la página de Registro (Ejercicio 2) */}
        <p style={{ textAlign: 'center' }}>
          ¿No tienes cuenta? <a onClick={() => history.push("/register")} style={{ cursor: 'pointer', color: 'var(--ion-color-primary)' }}>Regístrate aquí</a>
        </p>

        <IonLoading isOpen={showLoading} message={"Iniciando sesión..."} />
        <IonToast
          isOpen={!!errorMsg}
          message={errorMsg}
          duration={2000}
          onDidDismiss={() => setErrorMsg("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;

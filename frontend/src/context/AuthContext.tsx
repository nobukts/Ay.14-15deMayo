import React, { createContext, useContext, useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";

type User = {
  email: string;
  role: string;
};

type AuthContextValue = {
  user: User | null;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- EP 2.5 (c): Validación de sesión al cargar ---
    const loadSession = async () => {
      try {
        const [{ value: storedUser }, { value: storedToken }] = await Promise.all([
          Preferences.get({ key: "user" }),
          Preferences.get({ key: "token" }),
        ]);

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error cargando sesión:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  const login = async (userData, token) => {
    console.log("Guardando datos de usuario y token...");
    setUser(userData);
    await Preferences.set({ key: "token", value: token });
    await Preferences.set({ key: "user", value: JSON.stringify(userData) });
    console.log("Datos persistidos.");
  };

  const logout = async () => {
    setUser(null);
    await Preferences.remove({ key: "token" });
    await Preferences.remove({ key: "user" });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

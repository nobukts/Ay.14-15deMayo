const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Middleware de Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const JWT_SECRET =
  "fb237d354518f46208913045d17aac6bb666dc210c947a66fe9f6830e0b2e919715a569ebae55edb65aa5f12e916cdfbe27f994ee2d285771198f829605785a4";

// Simulación de Base de Datos
const users = [];

// --- EJERCICIO 1: Validación de Inputs con Zod ---
// TAREA: Mejorar este esquema para requerir 8 caracteres, una mayúscula y un número.
const registerSchema = z.object({
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["user", "admin"]).default("user"),
});

// --- Middleware de Autorización ---
const authorize = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(403).json({ error: "No token provided" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (roles.length && !roles.includes(decoded.role)) {
        return res
          .status(401)
          .json({ error: "No tienes permiso para acceder aquí" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }
  };
};

// --- Rutas ---

app.post("/register", async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    if (users.find((u) => u.email === validatedData.email)) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = {
      id: users.length + 1,
      email: validatedData.email,
      password: hashedPassword,
      role: validatedData.role,
    };

    users.push(newUser);
    res.status(201).json({ message: "Usuario creado con éxito" });
  } catch (error) {
    // TAREA: Refactorizar para usar un manejador de errores centralizado (Ejercicio 4)
    res.status(400).json({
      error: error.errors ? error.errors[0].message : "Error en el registro",
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ error: "Credenciales inválidas" });

  // --- GENERACIÓN DEL JWT ---
  // jwt.sign() toma 3 parámetros:
  // 1. Payload: Los datos del usuario (id, email, role)
  // 2. Secret: La llave maestra del servidor (JWT_SECRET)
  // 3. Options: Configuraciones como la expiración (1h)
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.json({ token, user: { email: user.email, role: user.role } });
});

// --- EJERCICIO 2: Implementar GET /profile aquí ---

// --- EJERCICIO 3: Implementar GET /users aquí ---

app.get("/admin-data", authorize(["admin"]), (req, res) => {
  res.json({ data: "Datos confidenciales para administradores" });
});

// --- EJERCICIO 4: Implementar Middleware de Manejo de Errores aquí ---

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Servidor educativo corriendo en http://localhost:${PORT}`),
);

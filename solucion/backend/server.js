const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const JWT_SECRET =
  "fb237d354518f46208913045d17aac6bb666dc210c947a66fe9f6830e0b2e919715a569ebae55edb65aa5f12e916cdfbe27f994ee2d285771198f829605785a4";

const users = [];

const registerSchema = z.object({
  email: z.string().email("Email no válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
  role: z.enum(["user", "admin"]).default("user"),
});

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

app.post("/register", async (req, res, next) => {
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
    next(error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ error: "Credenciales inválidas" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.json({ token, user: { email: user.email, role: user.role } });
});

app.get("/profile", authorize(), (req, res) => {
  res.json({
    email: req.user.email,
    role: req.user.role,
  });
});

app.get("/users", authorize(["admin"]), (req, res) => {
  res.json(users.map((u) => ({ email: u.email, role: u.role })));
});

app.get("/admin-data", authorize(["admin"]), (req, res) => {
  res.json({ data: "Datos confidenciales para administradores" });
});

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: "Error de validación",
      details: err.errors.map((e) => e.message),
    });
  }

  res.status(500).json({
    error: "Error interno del servidor",
  });
};

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Servidor de SOLUCIÓN corriendo en http://localhost:${PORT}`),
);

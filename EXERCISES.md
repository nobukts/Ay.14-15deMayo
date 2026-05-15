# 📝 Ejercicios Prácticos: Diseño y Seguridad de APIs (Backend)

Estos ejercicios están enfocados exclusivamente en el desarrollo del servidor (Node.js/Express) para fortalecer la seguridad, robustez y funcionalidad de la API. El frontend ya está configurado para consumir estos endpoints.

---

### Ejercicio 1: Validación Avanzada de Seguridad (Zod)

**Objetivo:** Implementar reglas de validación más estrictas para el registro de usuarios.

- **Tarea:** Modifica el `registerSchema` en `backend/server.js`.
- **Requisito:**
  1. La contraseña debe tener al menos 8 caracteres.
  2. Debe contener al menos una letra mayúscula.
  3. Debe contener al menos un número.
- **Pista:** Utiliza el método `.regex()` de Zod o validaciones encadenadas.

### Ejercicio 2: Implementación del Endpoint de Perfil

**Objetivo:** Permitir que el frontend obtenga los datos del usuario logueado.

- **Tarea:** Crea el endpoint GET `/profile`.
- **Requisito:**
  1. Debe usar el middleware `authorize()` para asegurar que solo usuarios autenticados accedan.
  2. Debe devolver un objeto JSON con el `email` y el `role` del usuario (extraídos de `req.user`).
- **Validación:** Una vez implementado, inicia sesión en el frontend y navega a la página de "Perfil" para ver tus datos.

### Ejercicio 3: Control de Acceso por Roles (Admin Only)

**Objetivo:** Restringir el acceso a datos sensibles basándose en el rol del JWT.

- **Tarea:** Crea el endpoint GET `/users`.
- **Requisito:**
  1. Solo los usuarios con rol `admin` deben poder acceder.
  2. Debe devolver la lista completa de usuarios (simulada por el array `users`).
- **Validación:** Intenta acceder a este endpoint con un usuario normal y verifica que recibas un error `401` o `403`.

### Ejercicio 4: Manejo de Errores Centralizado

**Objetivo:** Limpiar el código de las rutas y asegurar respuestas consistentes ante fallos.

- **Tarea:** Implementar un middleware global de error en Express.
- **Requisito:**
  1. Crea una función middleware que reciba `(err, req, res, next)`.
  2. Captura los errores de validación de Zod y devuelve un formato amigable.
  3. Usa este middleware al final de todas las definiciones de rutas (`app.use(errorHandler)`).
  4. Refactoriza al menos una ruta para que use `next(error)` en lugar de enviar la respuesta de error directamente en el `catch`.

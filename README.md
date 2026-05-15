Este proyecto es un entorno de aprendizaje enfocado en el diseño de APIs seguras utilizando Node.js, Express y JWT. El frontend (Ionic/React) se proporciona como una herramienta funcional para validar y probar la implementación del servidor.

---

## Arquitectura del Servidor (Backend)

El backend es el corazón de la seguridad y lógica de negocio. Se estructura siguiendo estos principios:

### 1. Validación de Datos (Zod)

Antes de procesar cualquier petición, se validan los esquemas de datos. Esto previene datos malformados y ataques básicos de inyección.

### 2. Seguridad de Credenciales (Bcrypt)

Las contraseñas nunca se almacenan en texto plano. Se utiliza hashing con salt para asegurar que, incluso en caso de una brecha de seguridad, las credenciales originales sean inaccesibles.

### 3. Autenticación Apátrida (JWT)

Tras un inicio de sesión exitoso, el servidor emite un JSON Web Token. Este token permite al cliente realizar peticiones protegidas sin que el servidor necesite almacenar estados de sesión.

### 4. Middleware de Autorización y Roles

Se utilizan middlewares para interceptar las peticiones a rutas protegidas, verificando la validez del token y los permisos (roles) del usuario antes de ejecutar la lógica del endpoint.

---

## Interacción con el Frontend

El frontend está desarrollado en Ionic/React y ya incluye:

- **Interceptores de Axios**: Añaden automáticamente el token JWT en el header `Authorization`.
- **Manejo de Sesión**: Persistencia del token en el dispositivo.
- **Rutas Protegidas**: Bloqueo visual de páginas si el usuario no está logueado.
- **Vistas Basadas en Roles**: Elementos que aparecen o desaparecen según el rol del usuario.

---

## Instrucciones de Ejecución

### 1) Ejecutar el Backend

```bash
cd backend
npm install
node server.js
```

Servidor disponible en: `http://localhost:3000`

### 2) Ejecutar el Frontend

```bash
cd frontend
npm install
ionic serve
```

La aplicación se abrirá en tu navegador (normalmente en `http://localhost:8100`).

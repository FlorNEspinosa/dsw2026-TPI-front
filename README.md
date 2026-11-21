# Sistema de Gestión de Turnos Médicos

Frontend del Trabajo Práctico Integrador de **Desarrollo de Software 2026, UTN Facultad Regional Tucumán**. La aplicación permite a los pacientes reservar y cancelar turnos médicos, y a los administradores gestionar especialidades, profesionales y horarios de atención. Está desarrollada en React y se conecta con la API REST en ASP.NET Core del grupo.

## Integrantes

| Apellido y nombre | Legajo | Comisión |
| --- | --- | --- |
| Díaz Montivero, Luisina | 60317 | 3K3 |
| Espinosa, Florencia Noelia | 60521 | 3K3 |
| Ortega Fernández, Victoria | 60847 | 3K3 |
| Torres Gauffin, Tadeo | 60232 | 3K3 |

## Ejecución local

### 1. Iniciar el backend

Seguir las instrucciones del [repositorio del backend](https://github.com/tadeotorresg/dsw2026-tpi/blob/adaptacion-frontend/README.md) para configurar la base de datos, aplicar las migraciones e iniciar la API. Ese README también explica cómo registrar un administrador para el primer ingreso.

Con la configuración de desarrollo, se puede comprobar que la API está en ejecución abriendo [Swagger](http://localhost:5278/swagger/index.html). El backend debe seguir ejecutándose mientras se usa el frontend.

### 2. Instalar las dependencias del frontend

Se necesita Git, Node.js y npm. La versión de Vite del proyecto admite Node.js 20 desde la versión 20.19.0 dentro de esa serie, o Node.js 22.12.0 en adelante.

Para obtener la rama de integración e instalar las versiones de dependencias registradas en `package-lock.json`:

```bash
git clone --branch development https://github.com/FlorNEspinosa/dsw2026-TPI-front.git
cd dsw2026-TPI-front
npm ci
```v

Si el repositorio ya está clonado, ejecutar `npm ci` desde la carpeta que contiene `package.json`.

### 3. Verificar la dirección de la API

El repositorio incluye `.env.development` con la dirección que usa el frontend:

```dotenv
VITE_BACKEND_URL=http://localhost:5278/
```

Si la API se ejecuta en otra dirección, crear `.env.development.local` junto a `package.json` y definir allí `VITE_BACKEND_URL` con el protocolo y el puerto correspondientes. Luego reiniciar Vite para que tome el cambio.

### 4. Abrir la aplicación

Desde la carpeta del frontend, ejecutar:

```bash
npm run dev -- --port 5173 --strictPort
```

| Portal | Acceso local | Credenciales |
| --- | --- | --- |
| Paciente | [Ingresar como paciente](http://localhost:5173/login) | Correo electrónico y DNI. En el primer acceso se registra el paciente. |
| Administrador | [Ingresar como administrador](http://localhost:5173/admin/login) | Correo y contraseña de un administrador registrado en el backend. |

La configuración CORS del backend admite `http://localhost:5173`. La opción `--strictPort` evita que Vite abra el frontend en `5174` si el puerto está ocupado. Si ya hay una instancia de este proyecto en `5173`, se puede usar esa misma ventana.

## Funcionalidades

### Portal del paciente

- **Reservar un turno.** El paciente elige una especialidad y un médico, consulta los días y horarios disponibles, revisa el resumen e ingresa el motivo de consulta. La reserva se envía con el identificador del turno concreto elegido (`availabilitySlotId`).
- **Resolver un conflicto de horario.** Mientras se confirma la reserva, la selección queda bloqueada. Si otro paciente ocupa ese horario, la pantalla informa el conflicto y vuelve a consultar la disponibilidad del médico.
- **Gestionar mis turnos.** El paciente puede consultar sus próximas reservas y solicitar una cancelación. La aplicación pide confirmación y actualiza el listado cuando la API confirma la operación.

### Portal del administrador

- **Tablero.** Muestra un resumen de la actividad, los turnos confirmados para el día y el directorio de profesionales.
- **Especialidades y médicos.** Permite consultar listados paginados, buscar por nombre, registrar altas y dar de baja registros con confirmación.
- **Disponibilidad horaria.** Permite configurar las franjas de atención de cada médico para el mes actual. Un día puede tener varias franjas. El formulario valida su duración y evita superposiciones. A partir de esas franjas, el backend genera los turnos que podrá elegir el paciente.
- **Búsqueda de citas.** Permite buscar por nombre o DNI del paciente y filtrar por especialidad, médico y fecha para consultar el detalle de una cita.

## Organización del código

El frontend está organizado por funcionalidad dentro de `src/modules`. Los módulos son `auth`, `patients`, `appointments`, `doctors`, `specialties`, `availabilities`, `dashboard` y `shared`.

Dentro de cada módulo, `pages` contiene las pantallas, `components` sus elementos reutilizables, `hooks` la lógica de estado y `services` las llamadas a la API. `shared` reúne los componentes comunes, como `Button`, `Alert`, `Snackbar` y `TablePagination`, y la instancia de Axios que incorpora el token JWT a las solicitudes.

React Router define las rutas y restringe el acceso según los roles `PACIENTE` y `ADMINISTRADOR`. Los formularios utilizan React Hook Form y los estilos se implementan con Tailwind CSS.

## Comandos disponibles

Ejecutar desde la raíz del frontend:

| Comando | Función |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite. |
| `npm run lint` | Analiza el código con ESLint. |
| `npm run format:check` | Comprueba el formato con Prettier. |
| `npm run format` | Aplica el formato de Prettier a los archivos del proyecto. |
| `npm run build` | Genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la compilación generada con `build`. |
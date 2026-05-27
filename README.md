# SkySync

## Autores

Julian Jimenez

Simon Vargas Celada

## 🚀 Inicio Rápido

¿Quieres empezar ahora mismo? Sigue estos pasos según la parte que quieras levantar.

### Frontend Angular

```powershell
Set-Location "c:\proyecto herramientas 3\Frontend\SkySync"
npm install
npm run start
```

Abre `http://localhost:4200/` en tu navegador.

### Backend .NET

```powershell
Set-Location "c:\proyecto herramientas 3\SkySync_Solutions\SkySync.API"
dotnet restore
dotnet run
```

### Linux / Mac

```bash
cd Frontend/SkySync
npm install
npm run start

cd ../../SkySync_Solutions/SkySync.API
dotnet restore
dotnet run
```

## Documentación importante

- 📖 Guía de inicio rápido
- 🗄️ Configuración de PostgreSQL
- 🔌 API endpoints con ejemplos
- 📋 Plan de sprints

SkySync es una plataforma de gestión aeronáutica desarrollada con .NET 10 y Angular 21. El sistema está dividido en un frontend moderno y una API REST que administra usuarios, aeropuertos, vuelos, reservas, pilotos, prácticas, clases y horas de vuelo.

## ¿Qué es la arquitectura por capas?

La solución está organizada por responsabilidades separadas para que el código sea más fácil de mantener, extender y probar.

```text
+-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |
|     DOMINIO       | <---- |      API         | <---- |     FRONTEND      |
|                   |       |                   |       |    (Angular)      |
|  - Entidades      |       |  - Recibe HTTP    |       |                   |
|  - Reglas de      |       |  - Valida datos   |       |  Componentes UI   |
|    negocio        |       |  - Delega a      |       |  Servicios        |
|  - DTOs           |       |    servicios      |       |                   |
+-------------------+       +-------------------+       +-------------------+
```

## Las capas en SkySync

| Capa            | Proyecto(s)            | Responsabilidad                         |
| --------------- | ---------------------- | --------------------------------------- |
| Dominio         | SkySync.Domain         | Entidades, reglas y modelo del negocio  |
| Aplicación      | SkySync.Application    | Servicios y contratos de negocio        |
| Infraestructura | SkySync.Infrastructure | Acceso a datos con EF Core y PostgreSQL |
| API             | SkySync.API            | Endpoints REST y orquestación HTTP      |
| Frontend        | Frontend/SkySync       | Interfaz Angular para el usuario        |

## Flujo de una solicitud

```text
Angular (navegador)
	│  GET /api/vuelos
	▼
VuelosController          ← Recibe la petición HTTP
	│  llama a
	▼
VuelosService             ← Aplica la lógica de negocio
	│  llama a
	▼
SkySyncDbContext          ← Acceso a datos con EF Core
	│  devuelve datos
	▼
VuelosService             ← Transforma y valida resultados
	▼
VuelosController          ← HTTP 200 OK + JSON
	▼
Angular (navegador)       ← Renderiza la información
```

## Estructura del proyecto

```text
SkySync.slnx
├── SkySync.Domain
├── SkySync.Application
├── SkySync.Infrastructure
├── SkySync.API
├── SkySync.Tests
└── Frontend/SkySync
```

## Dependencias entre proyectos

```text
Frontend/SkySync
    └── HttpClient → SkySync.API

SkySync.API
    ├── → SkySync.Application
    └── → SkySync.Infrastructure

SkySync.Application
    └── → SkySync.Domain

SkySync.Infrastructure
    └── → SkySync.Domain

SkySync.Domain
    (sin dependencias externas)
```

## Detalle de cada proyecto

### SkySync.Domain

| Carpeta   | Contenido                                                                       |
| --------- | ------------------------------------------------------------------------------- |
| Entidades | Usuario, Aeropuerto, Vuelo, Reserva, Piloto, Practica, HorasVuelo, Clase, Avion |

### SkySync.Application

| Carpeta    | Contenido                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| Interfaces | Contratos de servicios para aeropuertos, vuelos, usuarios, reservas, pilotos, prácticas, horas de vuelo, aviones y agenda |
| Services   | Implementaciones de la lógica de negocio                                                                                  |

### SkySync.Infrastructure

| Carpeta    | Contenido                               |
| ---------- | --------------------------------------- |
| Contexto   | SkySyncDbContext                        |
| Migrations | Migración inicial y snapshot del modelo |

### SkySync.API

| Carpeta     | Contenido                                                                                                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Controllers | AeropuertosController, AvionesController, ClasesController, HorasVueloController, PilotosController, PracticasController, ReservasController, UsuariosController, VuelosController |
| appsettings | Configuración de conexión, CORS y entorno                                                                                                                                          |

### Frontend/SkySync

| Carpeta            | Contenido                                                                   |
| ------------------ | --------------------------------------------------------------------------- |
| src/app/components | Dashboard, guía de usuario, agenda, piloto, vuelo y componentes compartidos |
| src/app/services   | Cliente API, auth y utilidades de estado                                    |

## Tecnologías

| Tecnología            | Versión | Uso                     |
| --------------------- | ------- | ----------------------- |
| .NET                  | 10      | Framework principal     |
| ASP.NET Core Web API  | 10      | API REST                |
| Angular               | 21      | Frontend                |
| TypeScript            | 5.9     | Lógica del frontend     |
| Entity Framework Core | 10      | Acceso a datos          |
| PostgreSQL            | 15+     | Base de datos           |
| Swagger               | -       | Documentación de la API |

## Plan de sprints

| Sprint   | Capa            | Estado        | Objetivo                          |
| -------- | --------------- | ------------- | --------------------------------- |
| Sprint 0 | Solución        | ✅ Completado | Estructura base del proyecto      |
| Sprint 1 | Dominio         | ✅ Completado | Entidades, DTOs e interfaces      |
| Sprint 2 | Aplicación      | ✅ Completado | Servicios de negocio              |
| Sprint 3 | API             | ✅ Completado | Endpoints REST y validaciones     |
| Sprint 4 | Infraestructura | ✅ Completado | EF Core + PostgreSQL              |
| Sprint 5 | Integración     | 🔜 Siguiente  | Pruebas end-to-end y refinamiento |

## Cómo ejecutar y probar la aplicación

### Requisitos previos

- .NET 10 SDK
- Node.js y npm
- PostgreSQL 15 o superior
- Navegador moderno

### Paso 1 — Clonar y restaurar

```bash
git clone <url-del-repositorio>
cd proyecto-herramientas-3
dotnet restore SkySync_Solutions/SkySync.API/SkySync.API.csproj
```

### Paso 2 — Ejecutar la API

```powershell
Set-Location "c:\proyecto herramientas 3\SkySync_Solutions\SkySync.API"
dotnet run
```

La API queda disponible en el puerto configurado por `launchSettings.json` y documentada con Swagger.

### Paso 3 — Ejecutar el frontend Angular

```powershell
Set-Location "c:\proyecto herramientas 3\Frontend\SkySync"
npm install
npm run start
```

El frontend se abre en `http://localhost:4200/`.

### Paso 4 — Probar el flujo completo

1. Inicia sesión o crea un usuario.
2. Revisa el dashboard y la guía de usuario.
3. Registra horas de vuelo usando los aeropuertos cargados desde la API.
4. Crea y administra vuelos, reservas, prácticas y clases.
5. Valida los endpoints directamente desde Swagger.

## API endpoints con ejemplos

> Las rutas siguen el patrón `api/[controller]`, salvo `horas-vuelo`.

| Método | Ruta                                   | Descripción                      |
| ------ | -------------------------------------- | -------------------------------- |
| GET    | `/api/aeropuertos`                     | Listar aeropuertos               |
| GET    | `/api/aeropuertos/{id}`                | Obtener aeropuerto por ID        |
| POST   | `/api/aeropuertos`                     | Crear aeropuerto                 |
| PUT    | `/api/aeropuertos/{id}`                | Actualizar aeropuerto            |
| PUT    | `/api/aeropuertos/{id}/estado`         | Cambiar estado del aeropuerto    |
| GET    | `/api/vuelos`                          | Listar vuelos                    |
| GET    | `/api/vuelos/{id}`                     | Obtener vuelo por ID             |
| POST   | `/api/vuelos`                          | Crear vuelo                      |
| GET    | `/api/usuarios`                        | Listar usuarios                  |
| GET    | `/api/usuarios/{id}`                   | Obtener usuario por ID           |
| POST   | `/api/usuarios/login`                  | Iniciar sesión                   |
| POST   | `/api/usuarios/registro`               | Registrar usuario                |
| PUT    | `/api/usuarios/{id}/perfil`            | Actualizar perfil                |
| PUT    | `/api/usuarios/{id}/contrasena`        | Cambiar contraseña               |
| POST   | `/api/usuarios/recuperar`              | Recuperar contraseña             |
| POST   | `/api/reservas`                        | Crear reserva                    |
| GET    | `/api/reservas/usuario/{usuarioId}`    | Ver reservas de un usuario       |
| PUT    | `/api/reservas/{id}/estado`            | Actualizar estado de reserva     |
| GET    | `/api/practicas/usuario/{usuarioId}`   | Ver prácticas de un usuario      |
| POST   | `/api/practicas`                       | Crear práctica                   |
| PUT    | `/api/practicas/{id}`                  | Editar práctica                  |
| DELETE | `/api/practicas/{id}`                  | Eliminar práctica                |
| GET    | `/api/horas-vuelo/usuario/{usuarioId}` | Ver horas de vuelo de un usuario |
| GET    | `/api/horas-vuelo`                     | Listar horas de vuelo            |
| POST   | `/api/horas-vuelo`                     | Registrar horas de vuelo         |
| DELETE | `/api/horas-vuelo/{id}`                | Eliminar registro de horas       |
| GET    | `/api/clases`                          | Listar clases                    |
| POST   | `/api/clases/agendar`                  | Agendar clase                    |
| GET    | `/api/pilotos`                         | Listar pilotos                   |
| GET    | `/api/pilotos/{id}`                    | Obtener piloto por ID            |
| POST   | `/api/pilotos`                         | Crear piloto                     |
| GET    | `/api/aviones`                         | Listar aviones                   |
| GET    | `/api/aviones/{id}`                    | Obtener avión por ID             |
| POST   | `/api/aviones`                         | Crear avión                      |
| PUT    | `/api/aviones/{id}/capacidad`          | Actualizar capacidad             |

## Datos de ejemplo

La base de datos incluye datos iniciales para desarrollo y pruebas, con usuarios, aeropuertos, vuelos, reservas, pilotos, prácticas y horas de vuelo.

## Cadena de conexión

Configura la base de datos en `SkySync_Solutions/SkySync.API/appsettings.json`.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=SkySyncDB;Username=postgres;Password=TU_PASSWORD"
  }
}
```

## Estado del proyecto

SkySync ya cuenta con frontend Angular, API .NET, servicios de negocio y persistencia con PostgreSQL. El siguiente paso recomendado es consolidar pruebas de integración, endurecer validaciones y seguir refinando la experiencia visual del frontend.

## Notas importantes

- El frontend se sirve en el puerto 4200.
- El formulario de registrar horas de vuelo ya usa aeropuertos cargados desde la API.
- El destino excluye el origen para evitar selecciones inválidas.
- Si quieres, luego separo este contenido en `QUICK_START.md` y `SPRINTS.md`.

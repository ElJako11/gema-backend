# ⚙️ GEMA Backend — Sistema de Gestión y Mantenimiento de Activos

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.44-C5F74F?logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Azure](https://img.shields.io/badge/Deploy-Azure_Web_Apps-0078D4?logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)
[![Swagger](https://img.shields.io/badge/OpenAPI-Swagger_3.0-85EA2D?logo=swagger&logoColor=black)](https://swagger.io/)

> **API RESTful de nivel empresarial** desarrollada con **Node.js, TypeScript y Express 5**, respaldada por **PostgreSQL** y **Drizzle ORM**. Diseñada para digitalizar, planificar y automatizar el ciclo de vida de mantenimientos preventivos, inspecciones técnicas, cuadrillas de trabajo y gestión jerárquica de activos (CMMS / EAM) en infraestructuras y campus universitarios (UCAB).

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo & Valor de Negocio](#-resumen-ejecutivo--valor-de-negocio)
2. [Puntos Clave de Ingeniería & Decisiones Técnicas](#-puntos-clave-de-ingeniería--decisiones-técnicas)
3. [Arquitectura del Sistema](#-arquitectura-del-sistema)
4. [Módulos Funcionales del Dominio](#-módulos-funcionales-del-dominio)
5. [Stack Tecnológico](#-stack-tecnológico)
6. [Base de Datos & Gestión del Esquema](#-base-de-datos--gestión-del-esquema)
7. [Puesta en Marcha Local](#-puesta-en-marcha-local)
8. [Scripts Disponibles](#-scripts-disponibles)
9. [Pruebas Automatizadas y Calidad](#-pruebas-automatizadas-y-calidad)
10. [Contenedorización con Docker](#-contenedorización-con-docker)
11. [CI/CD y Despliegue](#-cicd-y-despliegue)
12. [Documentación API (Swagger)](#-documentación-api-swagger)
13. [Flujo de Trabajo y Contribución](#-flujo-de-trabajo-y-contribución)
14. [Autor y Contacto](#-autor-y-contacto)

---

## 🎯 Resumen Ejecutivo & Valor de Negocio

**GEMA (Gestión y Mantenimiento de Activos)** centraliza y moderniza las operaciones de mantenimiento en instalaciones complejas. El sistema resuelve la desconexión operativa entre supervisores, directores y técnicos en campo, proporcionando:

- **Trazabilidad total de órdenes de trabajo**: Registro unificado de mantenimientos preventivos e inspecciones técnicas vinculadas a ubicaciones físicas.
- **Automatización de rutinas**: Planificador en segundo plano que proyecta y genera automáticamente órdenes de trabajo según frecuencias preestablecidas.
- **Estandarización de calidad**: Modelado de plantillas reutilizables que generan listas de verificación dinámicas con seguimiento por ítem.
- **Documentación legal y operativa**: Emisión instantánea de reportes y actas de mantenimiento en PDF con maquetación profesional y exportación tabular en Excel.
- **Alta confiabilidad y consistencia**: Arquitectura desacoplada, tipado estricto y ejecución bajo transacciones ACID para evitar pérdidas o inconsistencias de datos.

---

## 🚀 Puntos Clave de Ingeniería & Decisiones Técnicas

| Aspecto de Ingeniería | Implementación Técnica | Impacto en Arquitectura y Negocio |
| :--- | :--- | :--- |
| **Arquitectura en Capas & Patrón Fachada** | Controladores ligeros, Servicios de dominio y `TrabajoFacade` | Centraliza transacciones multi-entidad coordinando 5+ tablas de forma atómica y limpia. |
| **Integridad Transaccional (ACID)** | Uso estricto de transacciones (`db.transaction()`) con Drizzle ORM | Rollback automático ante cualquier fallo: garantiza cero registros huérfanos en la base de datos. |
| **Type-Safety End-to-End** | TypeScript 5.8 estricto + Tipado DDL con Drizzle + Inferencia con Zod | Detección de errores en tiempo de compilación y contratos de datos autoverificables. |
| **Validación y Sanitización Robusta** | Esquemas declarativos con **Zod** en cada ruta | Blindaje contra inyecciones y cargas útiles (`payloads`) malformadas antes de tocar la lógica de negocio. |
| **Seguridad y Control de Acceso (RBAC)** | Autenticación JWT en **HTTP-Only Cookies**, `bcrypt` y middleware de autorización | Protección contra ataques XSS/CSRF y restricción granular de recursos según rol (Director, Supervisor). |
| **Motor de Automatización (Scheduler)** | Tareas programadas con `node-cron` + cálculo temporal con `date-fns` | Generación automática e idempotente de mantenimientos futuros según frecuencias configuradas. |
| **Motor de Reportes Headless** | `Puppeteer` + `Handlebars` (HBS) compilando plantillas HTML/CSS | Generación server-side de PDFs vectoriales listos para imprimir y firmar con control de paginación (`page-break`). |
| **Contenedorización & CI/CD** | `Dockerfile` multi-stage (Node 22 Alpine) + GitHub Actions -> Azure | Imágenes de producción ultralivianas, entornos reproducibles y despliegue continuo sin downtime. |

---

## 🏛️ Arquitectura del Sistema

El proyecto sigue una estructura limpia, modular y orientada al dominio de negocio:

```
src/
├── config/              # Configuraciones centrales (Base de datos PostgreSQL, Swagger UI, envs)
├── controllers/         # Adaptadores HTTP (procesamiento de peticiones y respuestas REST)
├── middleware/          # Autenticación JWT, verificación de roles (RBAC) y manejo de errores
├── routes/              # Definición declarativa de endpoints agrupados por recurso
├── services/            # Lógica de negocio y reglas del dominio
│   ├── facades/         # Orquestadores transaccionales (Patrón Facade: trabajoFacade.service.ts)
│   ├── cron/            # Tareas programadas en background (scheduler de mantenimientos)
│   └── pdfEngine/       # Motor de renderizado de reportes PDF con Puppeteer y plantillas
├── tables/              # Definición de esquemas relacionales Drizzle ORM (DDL tipado)
├── templates/           # Plantillas visuales Handlebars (.hbs) para reportes PDF
├── types/               # Tipos TypeScript, interfaces y contratos de dominio
├── utils/               # Utilidades de fechas (UTC), encriptación (bcrypt) y formateo
└── validations/         # Esquemas de validación con Zod para cada payload
```

### 💡 Caso Destacado: El Patrón Fachada (`TrabajoFacade`)
La creación de una orden de trabajo completa requiere coordinar múltiples pasos relacionales:
1. Crear el registro maestro del trabajo asociado a la ubicación técnica.
2. Calcular la fecha de próxima generación basándose en la frecuencia configurada.
3. Instanciar el mantenimiento preventivo o la inspección correspondiente.
4. Duplicar dinámicamente los ítems de la plantilla seleccionada hacia un nuevo checklist.
5. Inicializar la tabla intermedia de estados (`estadoItemChecklist`) para cada ítem.
6. Asignar la cuadrilla o grupo de trabajo responsable.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Cliente / Frontend
    participant Facade as TrabajoFacade
    participant DB as PostgreSQL (Drizzle tx)
    participant Cron as Cron Service

    Client->>Facade: POST /work-creation (Datos del Trabajo)
    activate Facade
    Facade->>DB: Iniciar Transacción Atómica (db.transaction)
    Facade->>DB: 1. INSERT en tabla "Trabajo"
    Facade->>DB: 2. INSERT en "Mantenimiento" o "Inspección"
    Facade->>DB: 3. Clona ítems de Plantilla a nuevo "Checklist"
    Facade->>DB: 4. Inicializa estados en "estadoItemChecklist"
    Facade->>DB: 5. Asigna grupo en "grupoXtrabajo"
    DB-->>Facade: Transacción confirmada (COMMIT)
    deactivate Facade
    Facade-->>Client: 201 Created (Trabajo instanciado completamente)
    Note over Cron,DB: El Cron Service revisa periódicamente<br/>las próximas fechas y reclona órdenes recurrentes.
```

Toda esta operativa se ejecuta dentro de **una única transacción atómica**. Si cualquier paso falla, se realiza un **Rollback total**, garantizando la coherencia e integridad de los datos.

---

## 🧩 Módulos Funcionales del Dominio

```mermaid
flowchart TD
    UT["🏢 Ubicaciones Técnicas<br/>(Jerarquía de infraestructura)"] --> T["🛠️ Trabajos / Órdenes"]
    T --> MP["📅 Mantenimientos Preventivos"]
    T --> INS["🔍 Inspecciones Técnicas"]
    PL["📑 Plantillas Reutilizables"] --> CHK["📋 Checklists Dinámicos"]
    CHK --> EIC["✔️ Estados de Ítems"]
    T --> CHK
    GT["👥 Grupos de Trabajo"] --> TEC["👷 Técnicos Especialistas"]
    GT --> T
    CRON["⏰ Node-Cron Scheduler"] -.->|"Calcula próxima fecha y auto-genera"| T
    T -.-> PDF["📄 PDF Engine (Puppeteer + HBS)"]
```

1. **Ubicaciones Técnicas (Assets Hierarchy):**
   - Modelado jerárquico multinivel de instalaciones, plantas y áreas operativas con códigos únicos y estado de habilitación.
2. **Mantenimientos Preventivos & Inspecciones:**
   - Planificación de rutinas operativas con fecha límite, criticidad, área y tipo de trabajo.
3. **Plantillas y Checklists Dinámicos:**
   - Creación de listas de verificación reutilizables que se instancian en tiempo real para cada trabajo, permitiendo registrar el estado individual de cada ítem.
4. **Gestión de Recursos Humanos & Cuadrillas:**
   - Agrupación de técnicos especializados bajo supervisores responsables, permitiendo un balanceo eficiente de la carga de trabajo.
5. **Calendario y Monitoreo Operativo:**
   - Vistas y consultas optimizadas para representación en calendarios interactivos de mantenimientos activos por área.
6. **Reportes Ejecutivos & Actas Oficiales:**
   - Exportación de resúmenes de mantenimiento y checklists de inspección en **PDF de alta fidelidad** mediante Chromium headless y hojas de cálculo **Excel (.xlsx)**.

---

## 🛠️ Stack Tecnológico

### Core & Framework
- **Node.js 22 LTS**: Entorno de ejecución asíncrono y de alto rendimiento.
- **TypeScript 5.8**: Superset tipado para un código seguro y mantenible.
- **Express 5.1**: Framework HTTP con manejo nativo de errores asíncronos y arquitectura middleware.

### Persistencia & Modelado de Datos
- **PostgreSQL 16**: Base de datos relacional de nivel empresarial con soporte ACID.
- **Drizzle ORM 0.44 & Drizzle Kit**: ORM moderno, liviano y type-safe con definición de esquemas en TypeScript y migraciones automatizadas.

### Validación, Seguridad & Documentación
- **Zod 4.1**: Validación de esquemas y parseo estricto de payloads con inferencia de tipos estática.
- **JWT (jsonwebtoken) & Cookie-Parser**: Sesiones sin estado almacenadas de forma segura en cookies `HttpOnly` (`SameSite`, `Secure`).
- **Bcrypt**: Hashing de contraseñas mediante funciones criptográficas con salt.
- **Swagger / OpenAPI 3.0 (`swagger-ui-express`)**: Especificación y documentación interactiva de la API.

### Automatización & Generación de Documentos
- **Node-Cron & date-fns**: Planificador de cron jobs para el cálculo automático de fechas y generación de órdenes recurrentes.
- **Puppeteer 24**: Motor de navegación headless para renderizado server-side de PDFs basados en HTML/CSS.
- **Handlebars 4.7**: Motor de plantillas semántico para compilación de reportes dinámicos.
- **ExcelJS**: Generador y formateador de libros de cálculo Excel.

### Calidad, DevOps & Infraestructura
- **Newman & Newman Reporter HTML Extra**: Ejecutor de pruebas de integración y generación de reportes HTML para colecciones Postman.
- **Docker**: Imagen multi-etapa basada en `node:22-alpine` para producción.
- **GitHub Actions**: Flujo de integración continua y despliegue automatizado a **Azure Web Apps**.

---

## 🗄️ Base de Datos & Gestión del Esquema

El proyecto utiliza **PostgreSQL** orquestado mediante **Drizzle ORM**. Al iniciar el servidor, la aplicación realiza un `SELECT 1` para verificar la conectividad activa antes de abrir el puerto de escucha.

### Migraciones con Drizzle Kit
Para sincronizar el esquema definido en TypeScript con la base de datos PostgreSQL:
```bash
npm run pushdb
```
Este comando ejecuta `drizzle-kit push` y aplica automáticamente los scripts de post-migración correspondientes.

### Inicialización de Datos Maestros
Antes de consumir la API, es necesario inicializar el usuario master/director inicial:
```bash
npm run initDB
```
Para poblar la base de datos con un conjunto representativo de datos de prueba (usuarios, cuadrillas, técnicos, plantillas y ubicaciones técnicas):
```bash
npm run fillDB
```

---

## 💻 Puesta en Marcha Local

### Prerrequisitos
- **Node.js 20+ o 22+**
- **npm 10+**
- **PostgreSQL 14+** corriendo localmente o mediante contenedor Docker

### 1. Clonar el repositorio
```bash
git clone https://github.com/ElJako11/gema-backend.git
cd gema-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`:
```env
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/gemadb
PGNAME=gemadb
PGSERVER=localhost
PGUSER=postgres
PGPASSWORD=tu_contraseña_postgres
PGPORT=5432
SSL=false
PRODUCTION_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=tu_secreto_jwt_seguro
```

### 4. Sincronizar e inicializar la base de datos
```bash
# 1. Empujar el esquema a la base de datos
npm run pushdb

# 2. Crear el usuario master/director inicial
npm run initDB

# 3. (Opcional) Cargar datos de prueba
npm run fillDB
```

### 5. Iniciar la aplicación
```bash
# Modo desarrollo con recarga en caliente (nodemon + ts-node)
npm run dev

# Modo producción (compilación a JavaScript y ejecución con Node)
npm run build
npm start
```

- Servidor disponible en: `http://localhost:3000`
- Documentación interactiva Swagger: `http://localhost:3000/api-docs`

---

## 📜 Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo con `nodemon` y `ts-node`. |
| `npm run build` | Compila el código TypeScript a JavaScript en el directorio `dist/`. |
| `npm start` | Ejecuta la aplicación compilada en producción (`node dist/src/index.js`). |
| `npm run pushdb` | Empuja los esquemas de Drizzle ORM directamente a PostgreSQL. |
| `npm run initDB` | Inicializa la base de datos y crea el usuario Director master. |
| `npm run fillDB` | Ejecuta el seeder con datos de prueba realistas para todos los módulos. |
| `npm run test:GrupoDeTrabajo` | Ejecuta las pruebas automatizadas de integración de Grupos de Trabajo con Newman. |
| `npm run test:Tecnicos` | Ejecuta las pruebas de integración del módulo de Técnicos. |
| `npm run test:AsignarTecnicos` | Ejecuta las pruebas de asignación de técnicos a cuadrillas. |

---

## 🧪 Pruebas Automatizadas y Calidad

El proyecto implementa pruebas de integración de extremo a extremo mediante colecciones de **Postman** ejecutadas por **Newman** con reportería visual `htmlextra`:

```bash
# Ejecutar suite de pruebas de Grupos de Trabajo
npm run test:GrupoDeTrabajo

# Ejecutar suite de pruebas de Técnicos
npm run test:Tecnicos

# Ejecutar suite de pruebas de Asignación de Cuadrillas
npm run test:AsignarTecnicos
```

Estas pruebas verifican:
- Autenticación correcta y persistencia de token JWT en variables de entorno de prueba.
- Códigos de respuesta HTTP (200, 201, 400, 401, 403, 404).
- Estructura y validación de esquemas en las respuestas JSON.
- Consistencia del estado en la base de datos tras operaciones CRUD.

---

## 🐳 Contenedorización con Docker

El proyecto incluye un `dockerfile` con construcción en múltiples etapas para garantizar imágenes ligeras y seguras en entornos de producción:

```dockerfile
# Etapa 1: Builder (compilación de TypeScript)
FROM node:22-alpine AS builder
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./tsconfig.json ./
COPY ./src ./
RUN npm run build

# Etapa 2: Runner de producción
FROM node:22-alpine
WORKDIR /app
COPY ./package*.json ./
RUN npm install --production
COPY --from=builder /app/dist/ ./dist/src
EXPOSE 3000
CMD ["npm", "start"]
```

### Construcción y ejecución del contenedor
```bash
# Construir la imagen
docker build -t gema-backend:latest .

# Ejecutar el contenedor pasando las variables de entorno
docker run -p 3000:3000 --env-file .env gema-backend:latest
```

---

## 🚀 CI/CD y Despliegue

El pipeline de integración y despliegue continuo está implementado mediante **GitHub Actions** (`.github/workflows/main_gemita.yml`):

1. **Disparador:** Cada `push` a la rama `main` o ejecución manual (`workflow_dispatch`).
2. **Build Job:**
   - Configuración de entorno Node.js 22.x sobre `ubuntu-latest`.
   - Instalación de dependencias y compilación TypeScript (`npm run build`).
   - Empaquetado de artefactos en `release.zip`.
3. **Deploy Job:**
   - Autenticación segura en Microsoft Azure mediante OIDC / JWT (`azure/login@v2`).
   - Despliegue automatizado sobre **Azure Web Apps** (`gemita`).

---

## 📖 Documentación API (Swagger)

La API cuenta con documentación viva generada mediante **Swagger / OpenAPI 3.0** (`swagger-jsdoc` y `swagger-ui-express`).

Al iniciar la aplicación, accede a la interfaz interactiva en:
```
http://localhost:3000/api-docs
```
Desde la interfaz se pueden explorar e interactuar con todos los endpoints disponibles:
- `/auth`: Login, logout y estado de sesión.
- `/usuarios`: Administración de usuarios y roles.
- `/ubicaciones-tecnicas`: Gestión de activos e infraestructura física.
- `/work-creation`: Endpoint de fachada para la creación transaccional de órdenes.
- `/trabajos`, `/mantenimientos`, `/inspecciones`: Operaciones CRUD sobre órdenes de trabajo.
- `/plantillas`, `/item-plantilla`: Catálogo de inspecciones base.
- `/checklists`, `/item-checklist`, `/estado-item`: Listas de control y seguimiento de estados.
- `/grupos`, `/tecnicos`, `/grupoXtrabajo`: Asignación y administración de personal técnico.
- `/pdf-checklists`, `/pdf-mantenimientos`: Generación y descarga de informes PDF.
- `/calendario`: Endpoints agregados para vistas de calendario.

---

## 🤝 Flujo de Trabajo y Contribución

El repositorio sigue las mejores prácticas de colaboración y versionado:

- **Estrategia de ramas (GitFlow):**
  - `main`: Código estable listo para despliegue en producción.
  - `develop`: Rama principal de integración y desarrollo.
  - Ramas de funcionalidad/corrección: `feat/nombre-feature`, `fix/descripcion-bug`, `refactor/modulo`.
- **Estandarización de commits (Conventional Commits):**
  - `feat:` Nuevas funcionalidades.
  - `fix:` Corrección de errores.
  - `chore:` Mantenimiento de dependencias y herramientas.
  - `refactor:` Reestructuración interna sin cambio de comportamiento externo.
- **Pull Requests obligatorios:** Toda integración hacia `develop` o `main` se realiza mediante PR con descripción detallada y revisión de cambios.

---

## 👨‍💻 Autor y Contacto

- **Desarrollador:** Jacobo — [@ElJako11](https://github.com/ElJako11)
- **Repositorio Backend:** [github.com/ElJako11/gema-backend](https://github.com/ElJako11/gema-backend)
- **Frontend SPA Vinculado:** Desplegado en Vercel
- **Backend en Producción:** Azure Web Apps

---
*Proyecto desarrollado con altos estándares de arquitectura de software, patrones de diseño limpios y pruebas automatizadas.*

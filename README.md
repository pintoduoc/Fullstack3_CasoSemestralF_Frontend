# Frontend - Sistema de Emergencias Valle del Sol

Aplicación Vue 3 + Vite para la gestión de emergencias. Proporciona vistas para ciudadanos (reportar incidentes, ver mapa y alertas) y administradores/brigadistas (dashboard, gestión de reportes, emisión de alertas).

## Requisitos

- Node.js >= 20.19.0 o >= 22.12.0
- Los microservicios del backend ejecutándose (ver `Fullstack3/docker-compose.yml`)

## Instalación

```sh
npm install
```

## Desarrollo local

```sh
npm run dev
```

El frontend se conecta al API Gateway en `http://localhost:8080` mediante proxy de Vite.

## Patrones de Diseño

1. **Repository / Service Layer**: `src/services/api.js` encapsula llamadas HTTP en servicios (`reporteService`, `alertaService`, `usuarioService`), desacoplando la lógica de red de los componentes Vue.
2. **Strategy**: `src/services/validacionStrategy.js` define estrategias de validación (`login`, `registro`, `reporte`) con interfaz común y contexto (`ejecutarValidacion`) que selecciona la estrategia según el formulario.

## Tests

```sh
npm test
```

### Tests incluidos

| Archivo | Componente/Vista | Assertions clave |
|---|---|---|
| `MapaInteractivo.test.js` | MapaInteractivo | Loading, error, leyenda, `getColorPorEstado` |
| `GestorReportes.test.js` | GestorReportes | Loading, error, tabla, modal, actualización |
| `Dashboard.test.js` | Dashboard | Loading, error, KPIs, gráfico |
| `AdminVista.test.js` | AdminVista | Navbar, badge, logout, secciones |
| `CiudadanoVista.test.js` | CiudadanoVista | Navbar, logout, footer |
| `LoginRegistro.test.js` | LoginRegistro | Modos login/registro, validación, toggle |
| `FormularioReporte.test.js` | FormularioReporte | Validación, submit, geolocalización |
| `MuroAlertas.test.js` | MuroAlertas | Loading, error, alertas, niveles de riesgo |
| `Home.test.js` | Home | LoginRegistro, MuroAlertas, separador |
| `setup.js` | — | Mock global de `localStorage` para Node 26 |

## Docker

```sh
docker build -t frontend .
docker run -p 80:80 frontend
```

O usando docker-compose desde el repositorio de orquestación:

```bash
docker compose up --build -d frontend
```

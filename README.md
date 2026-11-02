# Decisión Segura

MVP web gamificado para el proyecto universitario **“Gamificación aplicada a la alfabetización en seguridad digital”**. La experiencia recorre consentimiento, pre-test, ocho desafíos educativos, post-test, resultados y exportación local.

## Funcionalidades

- Instrumentos A y B de 12 preguntas, con corrección separada y sin revelar respuestas durante la evaluación.
- Cuatro niveles: phishing, contraseñas, ingeniería social e información personal.
- Tres desafíos originales por nivel (12 en total), retroalimentación inmediata y 100 puntos por acierto.
- Rachas de decisiones seguras, cuatro insignias temáticas y cierre de nivel con resumen.
- Persistencia automática en `localStorage`, incluido el avance tras una recarga.
- Resultados totales y por categoría; diferencia individual post-test menos pre-test.
- Cuestionario opcional de percepción (1 a 5).
- Exportación completa en JSON, resumen CSV y resumen copiable.
- Reinicio con confirmación y recomendación de exportar primero.
- Diseño responsive y accesible en español.

## Requisitos

- Node.js 22.13 o superior.
- npm 10 o superior.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abrí la URL local que muestra la terminal (normalmente `http://127.0.0.1:5173`).

## Verificaciones

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Para probar el build de producción:

```bash
npm run start
```

## Despliegue

El repositorio incluye la configuración de Sites en `.openai/hosting.json` y se publica mediante el flujo de Sites. La aplicación también conserva una arquitectura de Next.js App Router y no depende de claves de API ni servicios pagos.

### GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` genera y publica automáticamente una exportación estática. Detecta el nombre del repositorio para configurar correctamente `basePath` y `assetPrefix`.

1. Creá un repositorio en GitHub y subí este proyecto a la rama `main`.
2. En **Settings → Pages**, seleccioná **GitHub Actions** como fuente.
3. Ejecutá el workflow **Deploy to GitHub Pages** o realizá un nuevo push a `main`.

Para comprobar localmente la exportación con una ruta de repositorio simulada:

```powershell
$env:GITHUB_ACTIONS="true"
$env:GITHUB_REPOSITORY="usuario/decision-segura"
npm run build:pages
```

La salida estática se genera en `out/`.

## Datos y privacidad

No se recopilan nombres, correos, documentos ni credenciales. El identificador de sesión es aleatorio. Los datos permanecen en el navegador hasta que la persona los exporta o reinicia la experiencia; `localStorage` no es una base de datos centralizada.

El JSON exportado utiliza el esquema `1.0` y la versión de instrumento `POC-SD-2026-02`. Incluye identificador, fechas, respuestas individuales, corrección, métricas por categoría, puntaje de desafíos y percepción opcional.

## Alcance metodológico

La comparación pre/post es exploratoria e individual. Una diferencia positiva no demuestra causalidad, una mejora general del aprendizaje ni un cambio sostenido del comportamiento. El instrumento todavía requiere pilotaje con participantes reales.

## Evolución futura

La lógica de datos, evaluación y persistencia está separada de la interfaz. Una versión posterior puede reemplazar `localStorage` por una API con PostgreSQL y Prisma sin reescribir los componentes de evaluación. Autenticación, almacenamiento central y análisis grupal quedaron fuera de este MVP.

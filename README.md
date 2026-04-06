# Backend - Sistema Integral de Gestión (Inventario y Ventas)

### **API RESTful Empresarial con Integración Omnicanal y Tiempo Real**

Este repositorio contiene el núcleo del backend para el sistema de gestión interna (Back-office) enfocado en la administración de inventarios, recursos humanos y facturación. Desarrollado en **Node.js** con **Express** y **MongoDB**, el sistema está diseñado para procesar grandes volúmenes de datos, orquestar la generación de documentos y mantener sincronizados múltiples puntos de venta físicos y digitales.

---

## 🚀 Retos de Ingeniería y Soluciones Aplicadas

El desarrollo de sistemas de planificación de recursos empresariales (ERP) requiere una arquitectura capaz de manejar procesos pesados sin comprometer los tiempos de respuesta. Se aplicaron metodologías de **Ingeniería de Software** e **Integración de Sistemas**:

* **Comunicación Eficiente en Tiempo Real (SSE):** En lugar de sobrecargar el servidor con WebSockets bidireccionales para simples notificaciones de estado, se implementó un administrador de **Server-Sent Events** (`sseManager.js`). Esto permite enviar flujos de eventos unidireccionales (Server-to-Client) de manera altamente eficiente, ideal para alertar al dashboard sobre nuevos pedidos o alertas de stock crítico.
* **Procesamiento de Archivos y Orquestación de Datos:** Se desarrollaron controladores específicos (`excel.js`, `dataPDF.js`) junto con un motor de subidas (`upload.js`) para manejar la ingesta masiva de inventarios desde hojas de cálculo. Esto abstrae la complejidad del cliente y centraliza la sanitización de datos antes de impactar la base de datos no relacional.
* **Integración B2B y Omnicanalidad:** Implementación del módulo `woocommerce.js` para sincronizar bidireccionalmente el catálogo interno de repuestos/productos con plataformas de e-commerce externas, asegurando la consistencia del inventario a través de todos los canales de venta.
* **Seguridad y Trazabilidad:** Diseño de un *pipeline* de *middlewares* robusto (`isAuth.js`, `validateJwt.js`, `checkTime.js`) para proteger rutas sensibles. Se garantizó que cada movimiento de inventario quede registrado con una firma criptográfica (JWT) que identifica al operador responsable.

---

## 🛠️ Stack Tecnológico

* **Entorno de Ejecución:** Node.js con Express.js.
* **Base de Datos:** [MongoDB](https://www.mongodb.com/) con **Mongoose** para el modelado de esquemas estrictos (`models/product.js`, `models/user.js`, `models/movimiento.js`).
* **Autenticación:** JSON Web Tokens (JWT) y encriptación *Bcrypt* para gestión de accesos.
* **Comunicaciones:** * `Nodemailer` (`config/emailer.js`) para el envío transaccional de correos y comprobantes.
  * API nativa de **SSE** para telemetría y notificaciones push al navegador.
* **Infraestructura Cloud:** Configuración adaptada para despliegue *Serverless* en **Vercel** (`vercel.json`), transformando endpoints de Express en funciones lambda optimizadas.

---

## 📦 Características Principales

* **Motor de Inventario Transaccional:** Registro inmutable de entradas y salidas (`movimiento-verificado.js`) para prevenir discrepancias de stock y facilitar auditorías.
* **Generación y Retención de Documentos:** Almacenamiento seguro y entrega de cotizaciones y comprobantes en formato PDF generados dinámicamente (`app/uploads/`).
* **Control de Asistencia (Time Tracking):** Controladores (`time.js`) para gestionar los horarios del personal operativo, calculando horas trabajadas e integrando restricciones de acceso por horario comercial (`checkTime.js`).
* **Gestión de Presupuestos:** Módulo para la creación y conversión de cotizaciones (`budget.js`) directamente a órdenes de venta (`orders.js`).

---

## ⚙️ Configuración y Despliegue

### Requisitos Previos
* Node.js 16+
* Instancia de MongoDB (Local o MongoDB Atlas)

### Instalación Local

1. Clonar el repositorio:
```bash
git clone [https://github.com/mdemedina/backend-ldmbm.git](https://github.com/mdemedina/backend-ldmbm.git)
cd backend-ldmbm
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno (`.env`):
```env
PORT=3000
DB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/tu_base_datos
JWT_SECRET=clave_secreta_super_segura
EMAIL_USER=tu_correo@empresa.com
EMAIL_PASS=tu_contraseña_app
```

4. Iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

### Despliegue en Producción (Vercel)
El proyecto incluye un archivo `vercel.json` preconfigurado que enruta todo el tráfico a través del punto de entrada `index.js`, permitiendo que la aplicación Express se ejecute sin problemas en el entorno serverless de Vercel.

```bash
vercel --prod
```

---

## 🏗️ Topología del Proyecto (Arquitectura MVC)

```text
/
├── app/
│   ├── controllers/      # Lógica de negocio por dominio (excel, orders, products)
│   ├── helpers/          # Utilidades globales (manejo de errores, parseo de fechas)
│   ├── middleware/       # Capas de seguridad, validación JWT y control horario
│   ├── models/           # Esquemas de base de datos de Mongoose
│   ├── routes/           # Definición de endpoints y asociación con controladores
│   └── uploads/          # Almacenamiento temporal de PDFs y archivos
├── config/               # Conexiones a BD, configuración de SMTP (emailer) y Auth
├── sseManager.js         # Orquestador global de Server-Sent Events (Tiempo real)
├── vercel.json           # Reglas de enrutamiento para despliegue Serverless
└── index.js              # Punto de entrada principal y configuración de Express
```

# Appointment Calendar

## 📋 Descripción

**Appointment Calendar** present una interfaz responsive que incluye vistas diaria y semanal, filtros por estado, etc

## 🎯 Características Principales

- **Vistas de Calendario**: Navegación entre vista diaria y semanal
- **Gestión de Citas**: Crear, editar y eliminar appointments
- **Filtros por Estado**: Filtrado por Confirmed, Pending y Cancelled
- **Diseño Responsive**: Se adapta a diferentes pantallas
- **Validaciones**: 
  - Prevención de solapamiento de horarios para el mismo team member
  - Validación de que el end time sea mayor que el start time
- **Persistencia**: Almacenamiento en localStorage
- **Arquitectura DDD**: Implementación del patrón Domain-Driven Design con Facade

## 🏗️ Arquitectura

El proyecto sigue una arquitectura basada en **Domain-Driven Design (DDD)** con el uso de un **Facade** que centraliza la lógica principal de negociopara mantener los componentes limpios y con encapsuland la logica compleja encapsulada. Esto permite:
- Separación clara entre lógica de presentación y lógica de negocio
- Componentes más simples y reutilizables
- Facilidad de testing y mantenimiento


### Decisiones

1. **Un único dominio**: Se identificó que el problema tiene baja complejidad, por lo que se consolidó en un solo dominio `appointment` con su modelo correspondiente.

2. **Constantes separadas**: Las claves de `localStorage` se extrajeron a una carpeta dedicada (`constants/storage.keys.ts`) dentro de un objeto. Esto facilita la manipulación y evita errores por strings mágicos dispersos en el código.

3. **Sin abstracción del servicio**: Dada la baja complejidad del problema, no se requirió una capa de abstracción adicional para el `appointment.service`. El servicio maneja directamente el acceso a datos (mock/localStorage).

4. **Shared Components**: Se creó una carpeta `shared/components` para estandarizar componentes reutilizables y mantener la consistencia visual.

5. **Standalone Components**: El uso de componente standalone aumenta el rendiminto y mejora el flujo de trabajo.

6. **Standarizacion de estilos**: Esto permite componentes mas reutilizacion de componentes


## 🛠️ Tecnologías
- **Angular 21**
- **Tailwind 4**

## 📦 Instalación y Ejecución

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Pedro-31072/prueba-monorepo
   cd .\prueba-monorepo\
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npx nx serve appointment-calendar
   ```

4. **Abrir en el navegador(No tener el puerto en uso)**
   ```
   http://localhost:4200
   ```

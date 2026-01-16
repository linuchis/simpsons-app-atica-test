# Simpsons App - React Native (Expo)

Una aplicación móvil interactiva inspirada en el universo de Los Simpson. Este proyecto fue desarrollado como una prueba técnica, demostrando habilidades en el manejo de estados globales, persistencia de datos local, animaciones fluidas y consumo de APIs REST.

<img width="1249" height="881" alt="image" src="https://github.com/user-attachments/assets/3377b614-14a3-4cec-8a99-cc7c212f712e" />
<img width="1203" height="888" alt="image" src="https://github.com/user-attachments/assets/13d1c83a-fe28-42d4-990e-4c0e6d8fdc01" />



## 🚀 Características Principales
**Autenticación Personalizada:** Sistema de Login y Registro con validación de usuarios.

**Exploración de Personajes:** Listado dinámico consumiendo la API de The Simpsons.

**Sistema de Favoritos:** Posibilidad de marcar personajes con persistencia por usuario (AsyncStorage).

**CRUD de Notas:**

- Create: Agregar múltiples notas a cada personaje.

- Read: Visualizar el historial de notas personal.

- Update/Rate: Calificar personajes con un sistema de 1 a 5 estrellas.

- Delete: Eliminar anotaciones del expediente.

**Interfaz Temática:** Fondo "Azul Springfield" con nubes animadas y tipografía e iconografía acorde a la serie.

## 🛠️ Requisitos Técnicos

Para ejecutar este proyecto localmente, asegúrate de tener instaladas las siguientes versiones:

- Node.js: v18.x o superior (se recomienda v20 LTS).

- npm: 9.x o superior.

- Expo CLI: Latest (utilizando npx expo).

- Dispositivo Móvil: App Expo Go (Android/iOS) o un emulador configurado.

## 📦 Instalación y Uso
1. Clonar el repositorio:

```
git clone https://github.com/linuchis/simpsons-app-atica-test.git
cd simpsons-app-atica-test
```
2. Instalar dependencias:
```
npm install
```
3. Iniciar el proyecto:
```
npx expo start
```
4. Ejecutar: Escanea el código QR con la app Expo Go en tu celular o presiona a para Android o i para iOS si tienes emuladores abiertos.

## 📂 Estructura del Proyecto
El proyecto utiliza Expo Router con una estructura organizada por módulos:

```
├── app/                      # Rutas principales (File-based routing)
│   ├── (auth)/               # Grupo de rutas de autenticación
│   │   └── login.tsx         # Pantalla de Login con nubes animadas
│   ├── (tabs)/               # Navegación por pestañas (Bottom Tabs)
│   │   ├── index.tsx         # Listado principal de personajes
│   │   └── explore.tsx       # Pantalla de Favoritos
│   ├── character/            # Rutas dinámicas
│   │   └── [id].tsx          # Detalle del personaje y CRUD de Notas
│   └── _layout.tsx           # Configuración del Stack principal
├── assets/                   # Recursos estáticos (Imágenes, Logos, Nubes)
├── components/               # Componentes reutilizables
│   ├── CharacterCard.tsx     # Tarjeta de personaje con lógica de favoritos
│   ├── themed-text.tsx       # Componentes de texto con soporte de temas
│   └── ...
├── src/                      # Lógica de negocio y utilidades
│   ├── context/              # Contexto de Autenticación (AuthContext)
│   └── services/             # Configuración de API (Fetch/Axios)
└── package.json              # Dependencias y scripts
```

## 🧪 Tecnologías Utilizadas
- React Native & Expo (SDK 50+)

- Expo Router (Navegación nativa)

- AsyncStorage (Persistencia local de datos)

- Animated API (Efectos visuales en el Login)

- Ionicons (Librería de iconos)

## 👤 Autor
Lina María Castañeda Cárdenas

[LinkedIn!](https://www.linkedin.com/in/linacast)




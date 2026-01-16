import { Redirect } from 'expo-router';

export default function Index() {
  // Cambiamos /(tabs) por / (la raíz) o forzamos el tipo
  // Esto engaña a TypeScript para que acepte la ruta
  return <Redirect href={"/(tabs)" as any} />;
}
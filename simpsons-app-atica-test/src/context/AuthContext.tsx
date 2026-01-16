import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Definición dequé datos tiene un usuario
interface User {
  email: string;
  password?: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signUp: (email: string, pass: string) => Promise<boolean>;
  signOut: () => void;
}

// Inicializamos como undefined para detectar si falta el Provider :D
const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storageUser = await AsyncStorage.getItem('@AticaSimpsons:user');
      if (storageUser) {
        setUser(JSON.parse(storageUser));
      }
    } catch (e) {
      console.error("Error cargando sesión:", e);
    } finally {
      setLoading(false);
    }
  }

  const signUp = async (email: string, pass: string) => {
    try {
      const usersJSON = await AsyncStorage.getItem('@AticaSimpsons:all_users');
      const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];

      if (users.find(u => u.email === email)) {
        alert("El usuario ya existe");
        return false;
      }

      const newUser = { email, password: pass };
      users.push(newUser);
      
      await AsyncStorage.setItem('@AticaSimpsons:all_users', JSON.stringify(users));
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      return true;
    } catch (e) {
      return false;
    }
  };

  const signIn = async (email: string, pass: string) => {
    try {
      const usersJSON = await AsyncStorage.getItem('@AticaSimpsons:all_users');
      const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];

      const foundUser = users.find(u => u.email === email && u.password === pass);

      if (foundUser) {
        const loggedUser = { email: foundUser.email };
        setUser(loggedUser);
        await AsyncStorage.setItem('@AticaSimpsons:user', JSON.stringify(loggedUser));
        return true;
      } else {
        alert("Credenciales incorrectas");
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('@AticaSimpsons:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  
  // Si el contexto no está listo aún, devolvemos valores por defecto 
  if (!context) {
    return {
      user: null,
      loading: true,
      signIn: async () => false,
      signUp: async () => false,
      signOut: () => {},
    };
  }
  
  return context;
}
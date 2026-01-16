import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  // Animación para las nubes
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    
    const moveClouds = () => {
      scrollY.setValue(-height); 
      Animated.loop(
        Animated.timing(scrollY, {
          toValue: height, 
          duration: 15000, // 15 segundos para un movimiento lento y suave
          useNativeDriver: true, // Optimización de rendimiento
        })
      ).start();
    };
    moveClouds();
  }, [scrollY]);

  const handleSignIn = async () => {
    if (!email || !password) return Alert.alert("Error", "Llena todos los campos");
    await signIn(email, password);
  };

  const handleSignUp = async () => {
    if (!email || !password) return Alert.alert("Error", "Llena todos los campos");
    const success = await signUp(email, password);
    if (success) {
      setPassword('');
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* CAPA DE NUBES ANIMADAS */}
      <Animated.Image
        source={require('@/assets/images/Clouds.png')}
        style={[
          styles.clouds,
          {
            transform: [{ translateY: scrollY }],
          },
        ]}
        resizeMode="cover" 
      />

      {/* CONTENIDO DEL LOGIN (Logo y Formulario) */}
      <View style={styles.innerContent}>
        <Image 
          source={require('@/assets/images/The_Simpsons_Logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#666"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#666"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <ThemedText style={styles.buttonText}>Entrar</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={handleSignUp}>
            <ThemedText style={styles.buttonTextSecondary}>Registrarse</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#87CEEB' // Azul Cielo de fondo base
  },
  clouds: {
  position: 'absolute',
  width: '300%', 
  left: '-10%',  
  height: height * 2, 
  opacity: 0.6,
},
  innerContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    zIndex: 1, 
  },
  logo: {
    width: '100%',
    height: 150,
    marginBottom: 40,
    alignSelf: 'center'
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    padding: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000'
  },
  button: {
    backgroundColor: '#FFD700', 
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonSecondary: { 
    backgroundColor: 'transparent', 
    borderWidth: 2, 
    borderColor: '#000' 
  },
  buttonText: { 
    fontWeight: 'bold', 
    color: '#000',
    fontSize: 16 
  },
  buttonTextSecondary: { 
    color: '#000', 
    fontWeight: 'bold' 
  }
});
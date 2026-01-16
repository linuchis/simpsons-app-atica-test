import { useAuth } from '@/src/context/AuthContext';
import { Character } from '@/src/services/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';

const IMAGE_BASE_URL = 'https://cdn.thesimpsonsapi.com/500';

export const CharacterCard = ({ character }: { character: Character }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);

  // Clave única de favoritos por usuario
  const FAV_KEY = `@favs_${user?.email}`;

  // 1. Cargar el estado inicial de la estrella
  useEffect(() => {
    const checkFavorite = async () => {
      const favsRaw = await AsyncStorage.getItem(FAV_KEY);
      const favs = favsRaw ? JSON.parse(favsRaw) : [];
      setIsFav(favs.includes(character.id));
    };
    checkFavorite();
  }, [user, character.id]);

  // 2. Lógica para agregar o quitar (con advertencia)
  const toggleFavorite = async () => {
    try {
      const favsRaw = await AsyncStorage.getItem(FAV_KEY);
      let favs = favsRaw ? JSON.parse(favsRaw) : [];

      if (isFav) {
        // Si ya es favorito, preguntar antes de quitar.
        Alert.alert(
          "Remover de favoritos",
          `¿Estás seguro que deseas remover a ${character.name} de tus favoritos?`,
          [
            { text: "Cancelar", style: "cancel" },
            { 
              text: "Sí, remover", 
              style: "destructive", 
              onPress: async () => {
                const newFavs = favs.filter((id: number) => id !== character.id);
                await AsyncStorage.setItem(FAV_KEY, JSON.stringify(newFavs));
                setIsFav(false);
              } 
            }
          ]
        );
      } else {
        // Agregar el personaje a favoritos
        favs.push(character.id);
        await AsyncStorage.setItem(FAV_KEY, JSON.stringify(favs));
        setIsFav(true);
      }
    } catch (e) {
      console.error("Error al gestionar favoritos", e);
    }
  };

  if (!character) return null;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push({
        pathname: "/character/[id]",
        params: { id: character.id }
      } as any)}
    >
      <Image 
        source={{ uri: `${IMAGE_BASE_URL}${character.portrait_path}` }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" style={styles.name}>
          {character.name}
        </ThemedText>
        <ThemedText style={styles.occupation} numberOfLines={1}>
          {character.occupation}
        </ThemedText>
        <ThemedText style={styles.status}>
          {character.status} - {character.gender}
        </ThemedText>
      </View>

      {/* BOTÓN DE ESTRELLA ★ */}
      <TouchableOpacity 
        style={styles.favButton} 
        onPress={toggleFavorite}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={isFav ? "star" : "star-outline"} 
          size={26} 
          color={isFav ? "#FFD700" : "#ccc"} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative', // Necesario para posicionar la estrella :D
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  info: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
    paddingRight: 35, // Espacio para que el texto no choque con la estrella, muy importante jujuju
  },
  name: { fontSize: 18, color: '#333' },
  occupation: { fontSize: 14, color: '#666' },
  status: { fontSize: 12, color: '#999', marginTop: 4 },
  favButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  }
});
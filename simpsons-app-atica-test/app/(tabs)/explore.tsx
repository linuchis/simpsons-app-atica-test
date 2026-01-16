import { CharacterCard } from '@/components/CharacterCard';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/src/context/AuthContext';
import { Character } from '@/src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

export default function FavoritesScreen() {
  const { user } = useAuth();
  const [favCharacters, setFavCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const FAV_KEY = `@favs_${user.email}`;
      const favsRaw = await AsyncStorage.getItem(FAV_KEY);
      const favIds: number[] = favsRaw ? JSON.parse(favsRaw) : [];

      if (favIds.length > 0) {
        // Pide los detalles de cada ID guardado
        const promises = favIds.map((id) =>
          fetch(`https://thesimpsonsapi.com/api/characters/${id}`).then((res) => res.json())
        );
        const results = await Promise.all(promises);
        // Filtra por si alguno devolvió error o null
        setFavCharacters(results.filter(char => char && char.id));
      } else {
        setFavCharacters([]);
      }
    } catch (error) {
      console.error("Error cargando favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Esto hace que la lista se refresque CADA VEZ que se entra a la pestaña
  // vital si acabas de marcar un favorito en la otra pantalla, ñomi. No modificar.
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [user])
  );

  if (loading && favCharacters.length === 0) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={favCharacters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CharacterCard character={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes personajes favoritos aún.</Text>
            <Text style={styles.emptySubtext}>¡Presiona la estrella en la lista principal!</Text>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingBottom: 20 },
  emptyContainer: { 
    marginTop: 100, 
    alignItems: 'center', 
    paddingHorizontal: 40 
  },
  emptyText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center',
    color: '#333'
  },
  emptySubtext: { 
    fontSize: 14, 
    color: '#666', 
    textAlign: 'center', 
    marginTop: 10 
  },
});
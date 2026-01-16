import { CharacterCard } from '@/components/CharacterCard';
import { ThemedView } from '@/components/themed-view';
import { Character, getCharacters } from '@/src/services/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput } from 'react-native';
export default function HomeScreen() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  



  // Función para cargar datos
const loadCharacters = async (reset = false) => {
  if (loading) return;
  setLoading(true);

  try {
    const currentPage = reset ? 1 : page;
    const data = await getCharacters(currentPage, search);

    // Verrificamos data.results
    if (data && Array.isArray(data.results)) {
      setCharacters(prev => reset ? data.results : [...prev, ...data.results]);
      setPage(currentPage + 1);
    } else {
      console.warn("La API no devolvió 'results'", data);
    }
  } catch (error) {
    console.error("Error cargando personajes:", error);
  } finally {
    setLoading(false);
  }
};

  // A. CARGA INICIAL: Se ejecuta una sola vez cuando se abre la pantalla
  useEffect(() => {
    loadCharacters(true);
  }, []);

  // B. SINCRONIZACIÓN Y FILTRADO: Se ejecuta cuando cambia el texto o llegan nuevos datos
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredCharacters(characters);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = characters.filter(char => 
        char.name.toLowerCase().includes(lowerSearch)
      );
      setFilteredCharacters(filtered);
    }
  }, [search, characters]);
  // C. BÚSQUEDA: Se ejecuta cuando el usuario envía la búsqueda
  const handleSearch = () => {
  setCharacters([]); // Limpiamos la lista visualmente de inmediato
  setPage(1);        // Reiniciamos el contador de páginas
  loadCharacters(true); // Llamamos a la API con reset = true
};

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar personaje..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={(text) => setSearch(text)}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />

      <FlatList
        data={filteredCharacters} // <-- IMPORTANTE: Usar la lista filtrada :D
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <CharacterCard character={item} />}
        onEndReached={() => loadCharacters()} 
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#FFD700" /> : null}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  searchBar: { height: 40, backgroundColor: '#eee', margin: 10, padding: 10, borderRadius: 8 },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});
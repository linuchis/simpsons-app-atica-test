import { useAuth } from '@/src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Character } from '@/src/services/api';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet } from 'react-native';

const IMAGE_BASE_URL = 'https://cdn.thesimpsonsapi.com/500';

// Define la estructura de la nota
interface NoteItem {
  id: string;
  text: string;
  rating: number;
}

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // ESTADOS PARA EL CRUD DE NOTAS
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [rating, setRating] = useState(5);

  const STORAGE_KEY = `@notes_list_${user?.email}_${id}`;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`https://thesimpsonsapi.com/api/characters/${id}`);
        const data = await response.json();
        setCharacter(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    loadNotes(); // Cargamos las notas al iniciar
  }, [id, user]);

  const loadNotes = async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) setNotes(JSON.parse(saved));
  };

  const handleAddNote = async () => {
    if (inputText.trim() === '') return;

    const newNote: NoteItem = {
      id: Date.now().toString(),
      text: inputText,
      rating: rating,
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    
    setInputText(''); // Limpiar input
    setRating(5);     // Resetear rating
    Alert.alert("¡Éxito!", "Nota agregada al expediente.");
  };

  const deleteNote = async (noteId: string) => {
    const updated = notes.filter(n => n.id !== noteId);
    setNotes(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  if (loading) return <ActivityIndicator style={{flex: 1}} />;

  return (
    <>
      {/* BARRA SUPERIOR */}
      <Stack.Screen 
        options={{ 
          title: character?.name || 'Detalle',
          headerShown: true, 
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={{ padding: 10, marginLeft: -5 }} 
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }} 
      />
    
      <ScrollView style={styles.container}>
        
        <Image 
          source={{ uri: `${IMAGE_BASE_URL}${character?.portrait_path}` }} 
          style={styles.headerImage} 
        />
        
        <ThemedView style={styles.content}>
          <ThemedText type="title">{character?.name}</ThemedText>
          
          <View style={styles.infoRow}>
              <ThemedText type="defaultSemiBold">Ocupación: </ThemedText>
              <ThemedText>{character?.occupation}</ThemedText>
          </View>

          {/* --- SECCIÓN DE NOTAS (CRUD) --- */}
          <View style={styles.noteSection}>
            <ThemedText style={styles.noteTitle}>Expediente de Notas 📝</ThemedText>
            
            <View style={styles.ratingRow}>
              <Text>Calificación: </Text>
              {[1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity key={num} onPress={() => setRating(num)}>
                  <Ionicons 
                    name={rating >= num ? "star" : "star-outline"} 
                    size={20} 
                    color="#FBC02D" 
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.noteInput}
                placeholder="Nueva anotación..."
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
                <Ionicons name="add-circle" size={40} color="#000" />
              </TouchableOpacity>
            </View>

            {/* LISTADO DE NOTAS AGREGADAS */}
            {notes.map((item) => (
              <View key={item.id} style={styles.noteItem}>
                <View style={styles.noteTextContainer}>
                  <Text style={styles.noteItemText}>{item.text}</Text>
                  <View style={styles.itemRating}>
                      <Ionicons name="star" size={12} color="#FBC02D" />
                      <Text style={styles.ratingText}>{item.rating}/5</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => deleteNote(item.id)}>
                  <Ionicons name="trash-outline" size={22} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerImage: { width: '100%', height: 350, resizeMode: 'contain', backgroundColor: '#f9f9f9' },
  content: { padding: 20 },
  infoRow: { marginVertical: 5 },
  label: { color: '#FFD700' },

  // Estilos de la Libreta
  noteSection: {
    marginTop: 25,
    padding: 15,
    backgroundColor: '#FFF9C4', 
    borderRadius: 12,
    borderLeftWidth: 8,
    borderLeftColor: '#FBC02D',
  },
  noteTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  noteInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addButton: { justifyContent: 'center' },
  
  // Estilos de cada item de la lista :P
  noteItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  noteTextContainer: { flex: 1 },
  noteItemText: { fontSize: 14, color: '#333' },
  itemRating: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { fontSize: 11, marginLeft: 3, color: '#666' },
});
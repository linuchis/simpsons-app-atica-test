import { useAuth } from '@/src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  const { signOut } = useAuth();
  const router = useRouter(); 

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTintColor: '#000',
        headerStyle: {
          backgroundColor: '#FFD700',
        },
        
        headerRight: () => (
          <View style={styles.headerRightContainer}>

          {/* BOTONES DE ARRIBAAAAAAAAAAA */}

            {/* Botón de Favoritos */}
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/explore' as any)}
              style={styles.favHeaderButton}
            >
              <Ionicons name="star" size={22} color="#000" />
            </TouchableOpacity>

            {/* Botón de Salir */}
            <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Salir</Text>
            </TouchableOpacity>
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Personajes',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Favoritos', // Cambié el título a Favoritos para que sea coherente xd
          tabBarIcon: ({ color }) => <Ionicons name="star" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  favHeaderButton: {
    marginRight: 15,
    padding: 5,
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  logoutText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
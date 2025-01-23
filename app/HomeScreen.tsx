import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const fetchHabits = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await api.get('/habits', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHabits(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHabits();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.habitItem}>{item.name}</Text>
        )}
      />
      <Button
        title="Добавить привычку"
        onPress={() => navigation.navigate('AddHabit')}
      />
      <Button
        title="Выйти"
        onPress={logout}
        color="red"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  habitItem: {
    fontSize: 16,
    marginVertical: 5,
  },
});
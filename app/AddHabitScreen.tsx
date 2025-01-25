import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "../services/api";
import { useRoute } from "@react-navigation/native";

// Add to route params type
type AddHabitScreenParams = {
  type: "good" | "bad";
};

export default function AddHabitScreen() {
  const route = useRoute();
  const { type } = route.params as AddHabitScreenParams;

  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");

  const addHabit = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await api.post(
        "/habits",
        { name: habitName, description, frequency },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Успех", "Привычка добавлена");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Ошибка",
        error.response?.data?.error || "Не удалось добавить привычку"
      );
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Название привычки"
        value={habitName}
        onChangeText={setHabitName}
        style={styles.input}
      />
      <TextInput
        placeholder="Описание"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Частота (например, ежедневно)"
        value={frequency}
        onChangeText={setFrequency}
        style={styles.input}
      />
      <Button title="Сохранить привычку" onPress={addHabit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

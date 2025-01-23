import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import api, { loginUser } from "../services/api";
import { useNavigation } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Войти"
          onPress={() =>
            loginUser({
              email: email,
              password: password,
              loginCallback: () => {
                navigation.navigate('Home');
              },
              errorCallback: (error) => {
                Alert.alert(
                  "Ошибка",
                  error.response?.data?.error || "Н е удалось войти"
                );
              },
            })
          }
        />
        <Button
          title="Нет аккаунта? Зарегистрироваться"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
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
  buttonContainer: {
    marginTop: 10,
  },
});

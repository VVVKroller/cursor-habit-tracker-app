import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import api from "../services/api";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { CheckIcon, Icon } from "@/components/ui/icon";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");

  const registerUser = async () => {
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        phone,
        region,
      });
      Alert.alert("Успех", "Регистрация прошла успешно");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert(
        "Ошибка",
        error.response?.data?.error || "Не удалось зарегистрироваться"
      );
      console.error(error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Имя"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Input
        variant="outline"
        size="md"
        isDisabled={false}
        // isInvalid={true}
        isReadOnly={false}
      >
        <InputField placeholder="Enter Text here.." />
      </Input>

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
      <TextInput
        placeholder="Телефон"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Регион"
        value={region}
        onChangeText={setRegion}
        style={styles.input}
      />

      <Checkbox size="md" isInvalid={false} isDisabled={false} value={"false"}>
        <CheckboxIndicator>
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel>Label</CheckboxLabel>
      </Checkbox>
      <View style={styles.buttonContainer}>
        <Button title="Зарегистрироваться" onPress={registerUser} />
        <Button
          title="Уже есть аккаунт? Войти"
          onPress={() => navigation.navigate("Login")}
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

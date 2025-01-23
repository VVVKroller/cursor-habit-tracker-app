import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://localhost:3000"; // Замените YOUR_SERVER_IP на IP вашего сервера

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const loginUser = async ({
  email,
  password,
  loginCallback,
  errorCallback,
}: {
  email: string;
  password: string;
  loginCallback: () => void;
  errorCallback: (error:any) => void;
}) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    const token = response.data.token;
    await AsyncStorage.setItem("token", token);
    loginCallback()
  } catch (error) {
    errorCallback(error)
    console.error(error);
  }
};

export default api;

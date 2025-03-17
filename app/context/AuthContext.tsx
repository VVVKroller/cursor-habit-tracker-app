import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
    expoClientId: "YOUR_EXPO_CLIENT_ID",
  });

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      // Handle successful authentication
      handleSignInSuccess(authentication);
    }
  }, [response]);

  const checkLoginStatus = async () => {
    try {
      const userJson = await AsyncStorage.getItem("@user");
      if (userJson) {
        setUser(JSON.parse(userJson));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSuccess = async (authentication: any) => {
    try {
      // Here you would typically make an API call to get user details
      // For now, we'll just store the token
      const userInfo = { token: authentication.accessToken };
      await AsyncStorage.setItem("@user", JSON.stringify(userInfo));
      setUser(userInfo);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error handling sign in:", error);
    }
  };

  const login = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("@user");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

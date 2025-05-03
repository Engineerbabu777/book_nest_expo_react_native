import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;

  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  // REGISTER NEW USER!
  register: async (username, email, password) => {
    set({ isLoading: true });

    try {
      const response = await fetch("https://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      await AsyncStorage.setItem("token", data?.token);
      await AsyncStorage.setItem("user", JSON.stringify(data?.user));

      // Example of updating store with response
      set({
        user: data.user,
        token: data.token,
        isLoading: false,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("Registration failed", error);
      set({ isLoading: false });

      return {
        success: false,
      };
    }
  },
}));

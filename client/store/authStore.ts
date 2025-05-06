import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  checkAuth: () => Promise<boolean>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string | any }>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string | any }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  // REGISTER NEW USER!
  register: async (username, email, password) => {
    set({ isLoading: true });

    try {
      const response = await fetch(
        "http://192.168.250.216:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();

      console.log({ data });

      if (data.message) {
        if (data.message.includes("exists")) {
          set({ isLoading: false });

          return {
            success: false,
            error: "User already exists!",
          };
        }
      }

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
        error: error,
      };
    }
  },
  // REGISTER NEW USER!
  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await fetch(
        "http://192.168.250.216:3000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      console.log({ data });

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
      console.error("Login failed", error);
      set({ isLoading: false });

      return {
        success: false,
        error: error,
      };
    }
  },
  checkAuth: async () => {
    const token = await AsyncStorage.getItem("token");
    const user = await AsyncStorage.getItem("user");

    if (!token || !user) {
      console.log("AUTH CHECK FAILED");
      return false;
    } else {
      set({
        token,
        user: JSON.parse(user!),
      });

      return true;
    }
  },
  logout: async () => {
    const token = await AsyncStorage.removeItem("token");
    const user = await AsyncStorage.removeItem("user");

    set({
      token: null,
      user: null,
    });

    return true;
  },
}));

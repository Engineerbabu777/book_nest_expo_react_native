import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import styles from "../../assets/styles/profile.style";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
export default function LogoutButton() {
  const { logout } = useAuthStore();

  const router = useRouter();
  const handleLogout = async () => {
    if (await logout()) {
      router.push("/(auth)");
    }
  };
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <MaterialCommunityIcons name="logout" size={24} color="white" />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}

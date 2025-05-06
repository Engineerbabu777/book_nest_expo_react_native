


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import styles from "../../assets/styles/profile.style";
import { useAuthStore } from '@/store/authStore';

export default function LogoutButton() {
      const { token } = useAuthStore();
    
  return (
    <View>
      <Text>LogoutButton</Text>
    </View>
  )
}

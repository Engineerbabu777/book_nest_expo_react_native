import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function Index() {
  const { user, token, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  console.log({ loading ,user,token});
  useEffect(() => {
    const checkAuthentication = async () => {
      await checkAuth();
      setLoading(false);
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#e17055" />
      </View>
    );
  } else {
    return <Redirect href={"/(auth)"} />;
  }
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ede1d1", // optional: gives a clean background
  },
});

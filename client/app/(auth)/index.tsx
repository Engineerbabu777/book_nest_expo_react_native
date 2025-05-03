import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import styles from "../../assets/styles/login.styles";

type Props = {};

const index = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const handleLogin = async () => {};

  return (
    <View style={styles.container}>
      {/* ILLUSTRATION! */}
      <View style={styles.topIllustration}>
        <Image
          source={require("../../assets/images/reading-home.png")}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default index;

import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuthStore } from "@/store/authStore";
import styles from "../../assets/styles/profile.style";
import moment from "moment";

type Props = {};

const ProfileHeader = (props: Props) => {
  const { user } = useAuthStore();

  return (
    <View style={styles.profileHeader}>
      <Image
        source={{
          uri: "https://hips.hearstapps.com/hmg-prod/images/elon-musk-gettyimages-2147789844-web-675b2c17301ea.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=640:*",
        }}
        style={styles.profileImage}
      />

      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.memberSince}>
          Member Since {moment(new Date(user?.createdAt)).format("l")}
        </Text>
      </View>
    </View>
  );
};

export default ProfileHeader;

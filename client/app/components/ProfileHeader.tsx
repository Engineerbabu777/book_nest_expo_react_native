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
          uri: "https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?semt=ais_hybrid&w=740",
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

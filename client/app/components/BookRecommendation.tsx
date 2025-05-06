import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import styles from "../../assets/styles/profile.style";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "@/constants/colors";
import moment from "moment";
import { useAuthStore } from "@/store/authStore";

type Props = {
  item: any;
  handleRemoveBook:any
};

const BookRecommendation = ({ item ,handleRemoveBook}: Props) => {
  const { token } = useAuthStore();

  const renderStarts = (rating: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
        />
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };
  const handleDelete = async () => {
    console.log("delete");
    try {
      const response = await fetch(
        `http://192.168.250.216:3000/api/books/${item._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log({ response });

      const data = await response.json();

      if (!response?.ok)
        throw new Error(data?.message || "Failed to fetch books");

      if(data?.success){
        handleRemoveBook(item?._id)
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <View style={styles.bookItem}>
      <Image source={{ uri: item?.image }} style={styles.bookImage} />

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item?.title}</Text>
        <View style={styles.ratingContainer}>{renderStarts(item?.rating)}</View>
        <Text style={styles.bookCaption} numberOfLines={2}>
          {item?.caption}
        </Text>
        <Text style={styles.bookDate}>
          {moment(new Date(item?.createdAt)).format("lll")}
        </Text>
      </View>

      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default BookRecommendation;

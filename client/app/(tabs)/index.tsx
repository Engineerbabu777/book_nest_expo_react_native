import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import styles from "../../assets/styles/home.styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "@/constants/colors";
import moment from "moment";

type Props = {};

const index = (props: Props) => {
  const { token } = useAuthStore();

  const [books, setBooks] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = async (pageNum: number = 1, refresh = false) => {
    try {
      if (refreshing) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }

      const response = await fetch(
        `http://192.168.250.216:3000/api/books?page=${pageNum}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log({ response });

      const data = await response.json();
      console.log({ data: data?.books[0] });

      if (!response?.ok)
        throw new Error(data?.message || "Failed to fetch books");

      setBooks((prev) => [...prev, ...data?.books]);

      setHasMore(pageNum < data?.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {};

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: "https://hips.hearstapps.com/hmg-prod/images/elon-musk-gettyimages-2147789844-web-675b2c17301ea.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=640:*",
            }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item?.user?.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image source={{ uri: item?.image }} style={styles.bookImage} />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item?.title}</Text>
        <Text style={styles.ratingContainer}>{renderStarts(item?.rating)}</Text>
        <Text style={styles.caption}>{item?.caption}</Text>
        <Text style={styles.date}>
          {moment(new Date(item?.createdAt)).format("lll")}
        </Text>
      </View>
    </View>
  );

  const renderStarts = (rating: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={32}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
        />
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item?._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default index;

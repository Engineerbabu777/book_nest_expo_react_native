import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import styles from "../../assets/styles/profile.style";
import ProfileHeader from "../components/ProfileHeader";
import LogoutButton from "../components/LogoutButton";

type Props = {};

const profile = (props: Props) => {
  const [books, setBooks] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setIsRefreshing] = useState(false);

  const { token } = useAuthStore();

  const router = useRouter();

  const fetchBooks = async (pageNum: number = 1, refresh = false) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `http://192.168.250.216:3000/api/books/user`,
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

      setBooks((prev) => {
        const existingIds = new Set(prev.map((book) => book._id));
        const newUniqueBooks = data?.books.filter(
          (book) => !existingIds.has(book._id)
        );
        return [...prev, ...newUniqueBooks];
      });
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />
    </View>
  );
};

export default profile;

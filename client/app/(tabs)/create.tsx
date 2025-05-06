import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.style";
import COLORS from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/store/authStore";

type Props = {};

const create = (props: Props) => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState<any>(null);
  const [imageBase64, setImageBase64] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore();

  const router = useRouter();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);

      if (result.assets[0].base64) {
        setImageBase64(result.assets[0].base64);
      } else {
        // convert to base 64!
        const base64 = await FileSystem.readAsStringAsync(
          result.assets[0]?.uri,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );

        setImageBase64(base64);
      }
    }
  };
  const handleSubmit = async () => {
    if (!title || !caption || !imageBase64 || !rating) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // get file extension!
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType
        ? `image/${fileType.toLowerCase()}`
        : "image/jpeg";

      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      console.log({ token });
      const response = await fetch("http://192.168.250.216:3000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          caption: caption,
          image: imageDataUrl,
          rating: rating.toString(),
          category:"custom"
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response?.ok)
        throw new Error(data.message || "Something went wrong!");

      Alert.alert("Success", "you book recommendation has been posted!");

      // reset!
      setImage("");
      setTitle("");
      setCaption("");
      setRating(0);
      setImageBase64("");

      router.push("/");
    } catch (error: unknown | any) {
      console.log(error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderRatingPicker = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          {/* Header! */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>
              Share your favorite reads with others
            </Text>
          </View>

          {/*  */}
          <View style={styles.form}>
            {/* Book Title! */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter book Title"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Rating! */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Rating</Text>
              {renderRatingPicker()}
            </View>

            {/* Image! */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <>
                    <Image
                      source={{ uri: image }}
                      style={styles.previewImage}
                    />
                  </>
                ) : (
                  <>
                    <View style={styles.placeholderContainer}>
                      <Ionicons
                        name="image-outline"
                        size={40}
                        color={COLORS.textSecondary}
                      />
                      <Text style={styles.placeholderText}>
                        Tap to select image
                      </Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Caption! */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write your review or thoughts about this book...."
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

            {/* BUTTON! */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              {loading ? (
                <>
                  <ActivityIndicator color={COLORS.white} />
                </>
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Share</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default create;

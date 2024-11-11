import { ThemedCard } from "@/components/ThemedCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { User } from "@/type/user.interface";
import { Ionicons } from "@expo/vector-icons";
import { Chip } from "@rneui/base";
import { Avatar } from "@rneui/themed";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface UserCardProps {
  user: User;
  onPress: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  const {
    avatar,
    name,
    surname,
    username,
    age,
    description,
    interests,
    favorites = [],
  } = user;

  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedCard style={styles.card}>
        <ThemedView style={styles.header}>
          <Avatar
            size="medium"
            rounded
            source={{ uri: avatar || "https://via.placeholder.com/150" }}
          />
          <ThemedView style={styles.nameContainer}>
            <ThemedText style={styles.name}>
              {(name || "") + " " + (surname || "")}
            </ThemedText>
            {username && (
              <ThemedText style={styles.username}>@{username}</ThemedText>
            )}
          </ThemedView>
          {age !== undefined && (
            <ThemedText style={styles.age}>{age}</ThemedText>
          )}
        </ThemedView>

        <ThemedText style={styles.description} numberOfLines={2}>
          {description || "No description available"}
        </ThemedText>
        <ThemedView style={styles.interestsContainer}>
          {interests
            ?.slice(0, 3)
            .map((interest, index) => (
              <Chip
                key={index}
                title={interest}
                buttonStyle={styles.interestChip}
                titleStyle={styles.interestChipText}
              />
            ))}
          {interests?.length > 3 && (
            <ThemedText style={styles.moreInterests}>
              +{interests?.length - 3}
            </ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.favoritesContainer}>
          <Ionicons name="heart" size={16} color={Colors.light.tint} />
          <ThemedText style={styles.favorites}>
            {favorites} favorites
          </ThemedText>
        </ThemedView>
      </ThemedCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  nameContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "#888",
  },
  age: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  favoritesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  favorites: {
    fontSize: 12,
    color: "#888",
    marginLeft: 5,
  },
  interestChip: {
    backgroundColor: Colors.light.tint,
    marginRight: 5,
    marginBottom: 5,
  },
  interestChipText: {
    fontSize: 12,
    color: "white",
  },
  moreInterests: {
    fontSize: 12,
    color: Colors.light.tint,
    alignSelf: "center",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
});

export default UserCard;

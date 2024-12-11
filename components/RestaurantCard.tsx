import { ThemedCard } from "@/components/ThemedCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Restaurant } from "@/type/restaurant.interface";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Avatar } from "@rneui/themed";
import { StyleSheet, TouchableOpacity } from "react-native";

interface RestaurantCardProps {
    restaurant: Restaurant;
    onPress: () => void;
}

const RestaurantCard = ({restaurant, onPress}: RestaurantCardProps) => {
    const {
        avatar,
        name,
        description,
        category,
        rating,
        averagePrice,
        address,
    } = restaurant;
    return (
        <TouchableOpacity onPress={onPress}>
            <ThemedCard style={styles.card}>
                <ThemedView style={styles.header}>
                    <Avatar
                        size="medium"
                        rounded
                        source={{uri: avatar || "https://via.placeholder.com/150"}}
                    />
                    <ThemedView style={styles.nameContainer}>
                        <ThemedText style={styles.name}>{name || "No Name"}</ThemedText>
                        {category && (
                            <ThemedText style={styles.category}>{category}</ThemedText>
                        )}
                    </ThemedView>
                    {rating !== undefined && (
                        <ThemedView style={styles.ratingContainer}>
                            <Ionicons name="star" size={16} color={Colors.light.tint}/>
                            <ThemedText style={styles.rating}>{rating.toFixed(1)}</ThemedText>
                        </ThemedView>
                    )}
                </ThemedView>

                <ThemedText style={styles.description} numberOfLines={2}>
                    {description || "No description available"}
                </ThemedText>

                <ThemedView style={styles.additionalInfo}>
                    {address && (
                        <ThemedText style={styles.address} numberOfLines={1}>
                            {address}
                        </ThemedText>
                    )}
                    {averagePrice !== undefined && (
                        <ThemedText style={styles.price}>
                            Avg. Price: ${averagePrice}
                        </ThemedText>
                    )}
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
    category: {
        fontSize: 14,
        color: "#888",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rating: {
        fontSize: 14,
        color: Colors.light.tint,
        marginLeft: 5,
    },
    description: {
        fontSize: 14,
        marginBottom: 10,
    },
    additionalInfo: {
        marginTop: 5,
    },
    address: {
        fontSize: 12,
        color: "#888",
        marginBottom: 5,
    },
    price: {
        fontSize: 12,
        color: Colors.light.tint,
    },
});

export default RestaurantCard;
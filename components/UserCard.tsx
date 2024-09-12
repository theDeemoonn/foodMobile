import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Card, Chip } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import {ThemedCard} from "@/components/ThemedCard";
import {ThemedView} from "@/components/ThemedView";

interface UserCardProps {
    user: {
        id: string;
        surname: string;
        name: string;
        age: number;
        username: string;
        favorites: string[];
        description: string;
        interests: string[];
        avatar?: string;
    };
    onPress: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <ThemedCard style={styles.card}>
                <ThemedView style={styles.header}>
                    <Avatar
                        size="medium"
                        rounded
                        source={{ uri: user.avatar || 'https://via.placeholder.com/150' }}
                    />
                    <ThemedView style={styles.nameContainer}>
                        <ThemedText style={styles.name}>{`${user.name} ${user.surname}`}</ThemedText>
                        <ThemedText style={styles.username}>@{user.username}</ThemedText>
                    </ThemedView>
                    <ThemedText style={styles.age}>{user.age}</ThemedText>
                </ThemedView>
                <ThemedText style={styles.description} numberOfLines={2}>
                    {user.description}
                </ThemedText>
                <ThemedView style={styles.interestsContainer}>
                    {user.interests.slice(0, 3).map((interest, index) => (
                        <Chip
                            key={index}
                            title={interest}
                            buttonStyle={styles.interestChip}
                            titleStyle={styles.interestChipText}
                        />
                    ))}
                    {user.interests.length > 3 && (
                        <ThemedText style={styles.moreInterests}>+{user.interests.length - 3}</ThemedText>
                    )}
                </ThemedView>
                <ThemedView style={styles.favoritesContainer}>
                    <Ionicons name="heart" size={16} color={Colors.light.tint} />
                    <ThemedText style={styles.favorites}>{user.favorites.length} favorites</ThemedText>
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    nameContainer: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    username: {
        fontSize: 14,
        color: '#888',
    },
    age: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        marginBottom: 10,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    interestChip: {
        backgroundColor: Colors.light.tint,
        marginRight: 5,
        marginBottom: 5,
    },
    interestChipText: {
        fontSize: 12,
        color: 'white',
    },
    moreInterests: {
        fontSize: 12,
        color: Colors.light.tint,
        alignSelf: 'center',
    },
    favoritesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    favorites: {
        fontSize: 12,
        color: '#888',
        marginLeft: 5,
    },
});

export default UserCard;
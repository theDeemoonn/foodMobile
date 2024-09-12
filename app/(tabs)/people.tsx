import { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Button } from '@rneui/themed';
import { ThemedView } from '@/components/ThemedView';
import UserCard from '@/components/UserCard';
import { Colors } from '@/constants/Colors';
import UserFilters from "@/components/UserFilters";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";
import {I18n} from "i18n-js";
import {getLocales} from "expo-localization";
import SearchBar from "@/components/SearchBar";

// Mock data for users
const mockUsers = [
    {
        id: '1',
        surname: 'Doe',
        name: 'John',
        age: 30,
        gender: 'male',
        username: 'johndoe',
        favorites: ['Music', 'Sports'],
        description: 'I love hiking and playing guitar.',
        interests: ['Hiking', 'Guitar', 'Photography'],
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },    {
        id: '2',
        surname: 'Doe',
        name: 'John',
        age: 30,
        gender: 'male',
        username: 'johndoe',
        favorites: ['Music', 'Sports'],
        description: 'I love hiking and playing guitar.',
        interests: ['Hiking', 'Guitar', 'Photography'],
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },    {
        id: '3',
        surname: 'Doe',
        name: 'John',
        age: 30,
        gender: 'male',
        username: 'johndoe',
        favorites: ['Music', 'Sports'],
        description: 'I love hiking and playing guitar.',
        interests: ['Hiking', 'Guitar', 'Photography'],
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },    {
        id: '4',
        surname: 'Doe',
        name: 'John',
        age: 30,
        gender: 'male',
        username: 'johndoe',
        favorites: ['Music', 'Sports'],
        description: 'I love hiking and playing guitar.',
        interests: ['Hiking', 'Guitar', 'Photography'],
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    // Add more mock users here
];

const PeopleScreen = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState(mockUsers);
    const translations = {
        en: en,
        ru: ru,
    };
    const i18n = new I18n(translations);
    i18n.locale = getLocales()[0].languageCode ?? 'en';
    i18n.enableFallback = true;




    const applyFilters = (filters: {
        ageRange: [number, number];
        gender: string;
        interests: string[];
    }) => {
        // Implement filter logic here
        console.log('Applying filters:', filters);
        // For now, let's just filter by age as an example
        const filteredUsers = mockUsers.filter(user =>
            user.age >= filters.ageRange[0] && user.age <= filters.ageRange[1] &&
            (filters.gender === 'all' || user.gender === filters.gender) &&
            (filters.interests.length === 0 || filters.interests.some(interest => user.interests.includes(interest)))
        );
        setFilteredUsers(filteredUsers);
        setShowFilters(false);
    };

    const renderUserCard = ({ item }: { item: typeof mockUsers[0] }) => (
        <UserCard user={item} onPress={() => console.log('User pressed:', item.id)} />
    );


    const handleSearch = (text: string) => {
        const lowercasedText = text.toLowerCase();
        const filtered = mockUsers.filter(user =>
            user.name.toLowerCase().includes(lowercasedText) ||
            user.surname.toLowerCase().includes(lowercasedText) ||
            user.username.toLowerCase().includes(lowercasedText)
        );
        setFilteredUsers(filtered);
    };


    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} >
        <ThemedView style={styles.container}>

            <SearchBar placeholder={i18n.t('search.placeholder')} onSearch={handleSearch} />
            <Button
                title={showFilters ? `${i18n.t('userFilters.hideFilters')}` : `${i18n.t('userFilters.showFilters')}`}
                onPress={() => setShowFilters(!showFilters)}
                buttonStyle={styles.filterButton}
            />
            {showFilters && <UserFilters onApplyFilters={applyFilters} />}
            {!showFilters && <FlatList
                style={styles.container}
                data={filteredUsers}
                renderItem={renderUserCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />}
        </ThemedView>
        </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    filterButton: {
        backgroundColor: Colors.light.tint,
        marginHorizontal: 15,
        marginBottom: 10,
    },
    listContainer: {
        paddingHorizontal: 15,
    },
});

export default PeopleScreen;
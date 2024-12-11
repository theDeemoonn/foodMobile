import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, ListRenderItem } from "react-native";
import { Button } from "@rneui/themed";
import { ThemedView } from "@/components/ThemedView";
import UserCard from "@/components/UserCard";
import { Colors } from "@/constants/Colors";
import UserFilters from "@/components/UserFilters";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";
import { I18n } from "i18n-js";
import { getLocales } from "expo-localization";
import SearchBar from "@/components/SearchBar";
import usersStore from "@/store/users.store";
import { User } from "@/type/user.interface";

interface FilterOptions {
    ageRange: [number, number];
    gender: string;
    interests: string[];
}

//
const PeopleScreen: React.FC = () => {
    const mockUsers: User[] = usersStore.Users;

    const [showFilters, setShowFilters] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);

    const translations = {
        en: en,
        ru: ru,
    };

    const i18n = new I18n(translations);
    i18n.locale = getLocales()[0].languageCode ?? "en";
    i18n.enableFallback = true;

    const applyFilters = (filters: FilterOptions) => {
        console.log("Applying filters:", filters);
        const filtered = mockUsers.filter(
            (user) =>
                filters.ageRange[0] <= (user.age ?? 0) &&
                (user.age ?? 0) <= filters.ageRange[1] &&
                (filters.gender === "all" || user.gender === filters.gender) &&
                (!filters.interests.length ||
                    filters.interests.some((interest) =>
                        user.interests?.includes(interest),
                    )),
        );
        setFilteredUsers(filtered);
        setShowFilters(false);
    };

    const handleSearch = (text: string) => {
        const lowercasedText = text.toLowerCase();
        const filtered = mockUsers.filter(
            (user) =>
                user.name?.toLowerCase().includes(lowercasedText) ||
                user.surname?.toLowerCase().includes(lowercasedText) ||
                user.user_name?.toLowerCase().includes(lowercasedText),
        );
        setFilteredUsers(filtered);
    };

    useEffect(() => {
        void usersStore.fetchUsers().then(() => {
            setFilteredUsers(usersStore.Users);
        });
    }, []);

    const renderUserCard: ListRenderItem<User> = ({item}) => (
        <UserCard
            user={item}
            onPress={() => console.log("User pressed:", item.id)}
        />
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1}}>
                <ThemedView style={styles.container}>
                    <SearchBar
                        placeholder={i18n.t("search.placeholder")}
                        onSearch={handleSearch}
                    />
                    <Button
                        title={
                            showFilters
                                ? `${i18n.t("userFilters.hideFilters")}`
                                : `${i18n.t("userFilters.showFilters")}`
                        }
                        onPress={() => setShowFilters(!showFilters)}
                        buttonStyle={styles.filterButton}
                    />
                    {showFilters && <UserFilters onApplyFilters={applyFilters}/>}
                    {!showFilters && (
                        <FlatList
                            style={styles.container}
                            data={filteredUsers}
                            renderItem={renderUserCard}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContainer}
                        />
                    )}
                </ThemedView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

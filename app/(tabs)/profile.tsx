import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { observer } from "mobx-react-lite";
import { Button, Divider } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import authStore from "@/store/auth.store";
import { BaseStyles, Colors } from "@/constants/Colors";
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";
import { I18n } from "i18n-js";
import { getLocales } from "expo-localization";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import usersStore from "@/store/users.store";
import { useEffect } from "react";
import { router } from "expo-router";
import UserAvatar from "@/components/UserAvatar";

const UserProfile = observer(() => {
    useEffect(() => {
        void usersStore.fetchMe();
        console.log(usersStore.currentUser, "usersStore.currentUser");
    }, []);

    const handleLogout = () => {
        void authStore.logout();
    };

    const handleEditProfile = () => {
        router.push("/profile-edit");
        // router.push("/profile-started");
    };

    const translations = {
        en: en,
        ru: ru,
    };
    const i18n = new I18n(translations);
    i18n.locale = getLocales()[0].languageCode ?? "en";
    i18n.enableFallback = true;

    const renderInfoItem = (
        icon: string,
        title: string,
        value: string | number | undefined,
    ) => (
        <ThemedView style={styles.infoItem}>
            <Ionicons
                name={icon as any}
                size={24}
                color={Colors.light.tint}
                style={styles.infoIcon}
            />
            <ThemedView style={styles.infoTextContainer}>
                <ThemedText style={styles.infoTitle}>{title}</ThemedText>
                <ThemedText style={styles.infoValue}>
                    {value || i18n.t("profile.noData")}
                </ThemedText>
            </ThemedView>
        </ThemedView>
    );
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView style={styles.scrollView}>
                    <ThemedView style={styles.container}>
                        <ThemedView style={styles.header}>
                            <UserAvatar
                                rounded
                                size="large"
                                containerStyle={styles.avatar}
                                imageUrl={usersStore.currentUser?.avatar}
                                initials={
                                    usersStore.currentUser?.name?.charAt(0).toUpperCase() +
                                    " " +
                                    usersStore.currentUser?.surname?.charAt(0).toUpperCase()
                                }
                            />

                            <ThemedView style={styles.headerText}>
                                <ThemedText style={styles.name}>
                                    {usersStore.currentUser?.name || "User Name"}{" "}
                                    {usersStore.currentUser?.surname || "User Surname"}
                                </ThemedText>
                                <ThemedText style={styles.username}>
                                    @
                                    {usersStore.currentUser?.user_name
                                        ? usersStore.currentUser?.user_name
                                        : usersStore.currentUser?.email?.split("@")[0]}
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>

                        <TouchableOpacity
                            onPress={handleEditProfile}
                            style={styles.editButton}
                        >
                            <ThemedText style={styles.editButtonText}>
                                {i18n.t("profile.button.editProfile")}
                            </ThemedText>
                        </TouchableOpacity>

                        <ThemedView style={styles.infoContainer}>
                            {renderInfoItem(
                                "mail-outline",
                                i18n.t("profile.email"),
                                usersStore.currentUser?.email,
                            )}
                            <Divider style={styles.divider}/>
                            {renderInfoItem(
                                "calendar-outline",
                                i18n.t("profile.age"),
                                usersStore.currentUser?.age,
                            )}
                            <Divider style={styles.divider}/>
                            {renderInfoItem(
                                "call-outline",
                                i18n.t("profile.phone"),
                                usersStore.currentUser?.phone,
                            )}
                            <Divider style={styles.divider}/>
                            {renderInfoItem(
                                "people-outline",
                                i18n.t("profile.interests"),
                                usersStore.currentUser?.interests?.join(", "),
                            )}
                            <Divider style={styles.divider}/>
                            {renderInfoItem(
                                "receipt-outline",
                                i18n.t("profile.description"),
                                usersStore.currentUser?.description,
                            )}
                            <Divider style={styles.divider}/>
                            {renderInfoItem(
                                "thumbs-up-outline",
                                i18n.t("profile.favorites"),
                                usersStore.currentUser?.favorites?.length,
                            )}
                        </ThemedView>

                        <Button
                            title={i18n.t("auth.button.logout")}
                            onPress={handleLogout}
                            buttonStyle={BaseStyles.logoutButton}
                            icon={
                                <Ionicons
                                    name="log-out-outline"
                                    size={20}
                                    color="white"
                                    style={styles.logoutIcon}
                                />
                            }
                        />
                    </ThemedView>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
});

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        marginRight: 20,
    },
    headerText: {
        flex: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
    },
    username: {
        fontSize: 16,
        color: "#888",
    },
    editButton: {
        backgroundColor: Colors.light.tint,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: "flex-start",
        marginBottom: 20,
    },
    editButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    infoContainer: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    infoIcon: {
        marginRight: 15,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        color: "#888",
    },
    infoValue: {
        fontSize: 16,
        fontWeight: "bold",
    },
    divider: {
        marginVertical: 10,
    },

    logoutIcon: {
        marginRight: 10,
    },
});

export default UserProfile;

import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, BaseStyles } from "@/constants/Colors";
import { useLocalizedData } from "@/hooks/fetchLocalizedData";
import usersStore from "@/store/users.store";
import { Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Button, CheckBox } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { getLocales } from "expo-localization";
import { useRouter } from "expo-router";
import { I18n } from "i18n-js";
import en from "locales/en/en.json";
import ru from "locales/ru/ru.json";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const {width} = Dimensions.get("window");

// Определение схемы валидации с использованием Zod
const ProfileSchema = z.object({
    user_name: z
        .string()
        .min(3, "Имя пользователя должно содержать минимум 3 символа"),
    surname: z.string().min(1, "Фамилия обязательна"),
    name: z.string().min(1, "Имя обязательно"),
    age: z
        .number()
        .min(18, "Возраст должен быть не менее 18")
        .max(120, "Возраст должен быть не более 120"),
    phone: z
        .string()
        .regex(/^[0-9]+$/, "Телефон должен содержать только цифры")
        .optional(),
    gender: z.enum(["male", "female"]),
    interests: z
        .array(z.string())
        .min(1, "Необходимо выбрать хотя бы один интерес"),
    favorites: z.array(z.string()).optional(),
    description: z.string().optional(),
    avatar: z.string().optional(),
});

const CompleteProfile = () => {
    const router = useRouter();

    // Основные состояния профиля
    const [user_name, setUsername] = useState("");
    const [surname, setSurname] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState<number>(18);
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState<string>("all");
    const [interests, setInterests] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [description, setDescription] = useState("");
    const [avatar, setAvatar] = useState(""); // Используем для хранения URI аватара

    // Модальные окна
    const [isInterestsModalVisible, setInterestsModalVisible] = useState(false);
    const [isFavoritesModalVisible, setFavoritesModalVisible] = useState(false);

    const translations = {
        en: en,
        ru: ru,
    };
    const i18n = new I18n(translations);
    i18n.locale = getLocales()[0].languageCode ?? "en";
    i18n.enableFallback = true;

    // Данные для интересов и избранных с бэка
    const [interestOptions, isLoadingInterests, interestsError] =
        useLocalizedData<string[]>(`/categories/${i18n.locale}`, true);
    const [favoriteOptions, isLoadingFavorites, favoritesError] =
        useLocalizedData<{ id: string; name: string }[]>(
            `/categories/favorites`,
            true,
        );

    // Состояние для ошибок
    const [errors, setErrors] = useState<Record<string, string>>({});


    // Функция выбора аватара
    const handleAvatarPick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets?.[0].uri) {
            setAvatar(result.assets[0].uri); // Устанавливаем URI выбранного изображения
        }
    };

    // Обработчики выбора интересов и избранных
    const toggleInterest = (interest: string) => {
        setInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest],
        );
    };

    const toggleFavorite = (favoriteId: string) => {
        setFavorites((prev) =>
            prev.includes(favoriteId)
                ? prev.filter((id) => id !== favoriteId)
                : [...prev, favoriteId],
        );
    };

    // Валидация и сохранение профиля
    const handleSaveProfile = () => {
        const profileData = {
            user_name,
            surname,
            name,
            age,
            phone,
            gender,
            interests,
            favorites,
            description,
            avatar,
        };

        const validationResult = ProfileSchema.safeParse(profileData);

        if (!validationResult.success) {
            // Обработка ошибок валидации
            const newErrors: Record<string, string> = {};
            validationResult.error.errors.forEach((error) => {
                if (error.path[0]) {
                    newErrors[error.path[0] as string] = error.message;
                }
            });
            setErrors(newErrors);
        } else {
            // Если валидация прошла успешно, сохраняем профиль
            console.log("Profile saved:", validationResult.data);
            void usersStore.updateUserProfile(
                `${usersStore.currentUser?.id}`,
                validationResult.data,
            );
            router.replace("/profile"); // Переход на следующий экран
        }
    };

    useEffect(() => {
        void usersStore.fetchMe();
        console.log(usersStore.currentUser, "usersStore.currentUser");
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView style={styles.scrollView}>
                    <ThemedView style={styles.container}>
                        <ThemedText style={styles.title}>
                            {i18n.t("startedProfile.title")}
                        </ThemedText>

                        {/* Кнопка для выбора аватара */}
                        <Button
                            title={i18n.t("startedProfile.changePhoto")}
                            onPress={handleAvatarPick}
                            buttonStyle={BaseStyles.baseButton}
                        />
                        {avatar ? (
                            <Image source={{uri: avatar}} style={styles.avatar}/>
                        ) : null}
                        {errors.avatar && (
                            <ThemedText style={styles.errorText}>{errors.avatar}</ThemedText>
                        )}

                        {/* Поля ввода и отображение ошибок */}
                        <ThemedInput
                            style={styles.input}
                            placeholder={i18n.t("startedProfile.username")}
                            value={user_name}
                            onChangeText={setUsername}
                            errorMessage={errors.userName}
                        />

                        <ThemedInput

                            style={styles.input}
                            placeholder={i18n.t("startedProfile.surname")}
                            value={surname}
                            onChangeText={setSurname}
                            errorMessage={errors.surname}
                        />

                        <ThemedInput
                            style={styles.input}
                            placeholder={i18n.t("startedProfile.name")}
                            value={name}
                            onChangeText={setName}
                            errorMessage={errors.name}
                        />

                        <ThemedText style={styles.label}>
                            {i18n.t("startedProfile.age")}: {age}
                        </ThemedText>
                        <MultiSlider
                            containerStyle={styles.sliderContainer}
                            values={[age]}
                            sliderLength={width - 60}
                            onValuesChange={(values) => setAge(values[0])}
                            min={18}
                            max={120}
                            step={1}
                            selectedStyle={{
                                backgroundColor: Colors.categorySelected.primary,
                            }}
                            markerStyle={{
                                backgroundColor: Colors.light.tint,
                                height: 20,
                                width: 20,
                                borderRadius: 10,
                            }}
                        />
                        {errors.age && (
                            <ThemedText style={styles.errorText}>{errors.age}</ThemedText>
                        )}

                        <ThemedInput
                            style={styles.input}
                            placeholder={i18n.t("startedProfile.phone")}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            errorMessage={errors.phone}
                        />

                        <ThemedText style={styles.label}>
                            {i18n.t("startedProfile.gender.gender")}
                        </ThemedText>
                        <CheckBox
                            title={i18n.t("startedProfile.gender.male")}
                            checked={gender === "male"}
                            onPress={() => setGender("male")}
                            containerStyle={styles.checkboxContainer}
                        />
                        <CheckBox
                            title={i18n.t("startedProfile.gender.female")}
                            checked={gender === "female"}
                            onPress={() => setGender("female")}
                            containerStyle={styles.checkboxContainer}
                        />
                        {errors.gender && (
                            <ThemedText style={styles.errorText}>{errors.gender}</ThemedText>
                        )}

                        <Button
                            title={i18n.t("startedProfile.interests")}
                            onPress={() => setInterestsModalVisible(true)}
                            buttonStyle={BaseStyles.baseButton}
                        />
                        {errors.interests && (
                            <ThemedText style={styles.errorText}>
                                {errors.interests}
                            </ThemedText>
                        )}

                        <Button
                            title={i18n.t("startedProfile.favorites")}
                            onPress={() => setFavoritesModalVisible(true)}
                            buttonStyle={BaseStyles.baseButton}
                        />

                        <ThemedInput
                            style={[styles.input]}
                            placeholder={i18n.t("startedProfile.description")}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            errorMessage={errors.description}
                        />

                        <Button
                            title={i18n.t("button.save")}
                            onPress={handleSaveProfile}
                            buttonStyle={BaseStyles.baseButton}
                            icon={
                                <Ionicons
                                    name="save-outline"
                                    size={20}
                                    color="white"
                                    style={styles.saveIcon}
                                />
                            }
                        />

                        {/* Модальное окно для интересов */}
                        <Modal
                            visible={isInterestsModalVisible}
                            animationType="slide"
                            transparent={true}
                        >
                            <SafeAreaProvider>
                                <ThemedView style={{flex: 1}}>
                                    <SafeAreaView style={{flex: 1}}>
                                        <ScrollView contentContainerStyle={styles.modalContent}>
                                            <ThemedText style={styles.modalTitle}>
                                                {i18n.t("startedProfile.interests")}
                                            </ThemedText>
                                            <ThemedView style={styles.interestsContainer}>
                                                {isLoadingInterests ? <ActivityIndicator/> : null}
                                                {interestsError ? (
                                                    <ThemedText>{interestsError}</ThemedText>
                                                ) : null}
                                                {interestOptions?.map((interest, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        style={[
                                                            styles.categoryButton,
                                                            interests.includes(interest) &&
                                                            styles.categoryButtonSelected,
                                                        ]}
                                                        onPress={() => toggleInterest(interest)}
                                                    >
                                                        <ThemedText>{interest}</ThemedText>
                                                    </TouchableOpacity>
                                                ))}
                                            </ThemedView>
                                            <Button
                                                buttonStyle={BaseStyles.baseButton}
                                                title={i18n.t("button.close")}
                                                onPress={() => setInterestsModalVisible(false)}
                                            />
                                        </ScrollView>
                                    </SafeAreaView>
                                </ThemedView>
                            </SafeAreaProvider>
                        </Modal>

                        {/* Модальное окно для избранного */}
                        <Modal visible={isFavoritesModalVisible} animationType="slide">
                            <SafeAreaProvider>
                                <ThemedView style={{flex: 1}}>

                                    <SafeAreaView style={{flex: 1}}>
                                        <ScrollView contentContainerStyle={styles.modalContent}>
                                            <ThemedText style={styles.modalTitle}>
                                                {i18n.t("startedProfile.favorites")}
                                            </ThemedText>
                                            {isLoadingFavorites ? <ActivityIndicator/> : null}
                                            {favoritesError ? (
                                                <ThemedText>{favoritesError}</ThemedText>
                                            ) : null}
                                            {favoriteOptions?.map((favorite) => (
                                                <TouchableOpacity
                                                    key={favorite.id}
                                                    style={[
                                                        styles.categoryButton,
                                                        favorites.includes(favorite.id) &&
                                                        styles.categoryButtonSelected,
                                                    ]}
                                                    onPress={() => toggleFavorite(favorite.id)}
                                                >
                                                    <ThemedText>{favorite.name}</ThemedText>
                                                </TouchableOpacity>
                                            ))}
                                            <Button
                                                buttonStyle={BaseStyles.baseButton}

                                                title={i18n.t("button.close")}
                                                onPress={() => setFavoritesModalVisible(false)}
                                            />
                                        </ScrollView>
                                    </SafeAreaView>
                                </ThemedView>
                            </SafeAreaProvider>
                        </Modal>
                    </ThemedView>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },

    container: {
        padding: 15,
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },

    input: {
        marginTop: 10,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },

    sliderContainer: {
        marginLeft: 20
    },

    label: {
        fontSize: 16,
        marginVertical: 10,

    },

    textArea: {
        height: 100,
        textAlignVertical: "top",
    },

    checkboxContainer: {
        backgroundColor: "transparent",
        borderWidth: 0,
        padding: 0,
        marginVertical: 5,
    },


    saveIcon: {
        marginRight: 10,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        margin: 15,
    },

    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
    },

    modalContent: {
        padding: 10,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },

    categoryButton: {
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.categorySelected.borderColor,
    },

    categoryButtonSelected: {
        backgroundColor: Colors.categorySelected.primary,
        borderColor: Colors.categorySelected.primary,
    },

    interestsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 10,
    },

    modal: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: Colors.dark.background
    }
});

export default CompleteProfile;

import { ThemedInput } from "@/components/ThemedInput";
import { BaseStyles } from "@/constants/Colors";
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";
import usersStore from "@/store/users.store";
import { User } from "@/type/user.interface";
import { Button } from "@rneui/themed";
import { getLocales } from "expo-localization";
import { useRouter } from "expo-router";
import { I18n } from "i18n-js";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { ScrollView, Image, StyleSheet, SafeAreaView } from "react-native";
import { z } from "zod";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const EditProfile = observer(() => {
    const router = useRouter();

    const [name, setName] = useState(usersStore.currentUser?.name || "");
    const [surname, setSurname] = useState(usersStore.currentUser?.surname || "");
    const [age, setAge] = useState(usersStore.currentUser?.age?.toString() || "");
    const [phone, setPhone] = useState(usersStore.currentUser?.phone || "");
    const [interests, setInterests] = useState(
        usersStore.currentUser?.interests || "",
    );
    const [notInterests, setNotInterests] = useState(
        usersStore.currentUser?.dontInterest || "",
    )
    const [avatar, setAvatar] = useState(""); // Используем для хранения URI аватара
    const [description, setDescription] = useState(
        usersStore.currentUser?.description || "",
    );
    const [errors, setErrors] = useState<Partial<Record<keyof User, string[]>>>(
        {},
    );
    const translations = {
        en: en,
        ru: ru,
    };
    const i18n = new I18n(translations);
    i18n.locale = getLocales()[0].languageCode ?? "en";
    i18n.enableFallback = true;

    const profileSchema = z.object({
        name: z.string().min(1, {message: i18n.t("validation.nameRequired")}),
        surname: z
            .string()
            .min(1, {message: i18n.t("validation.surnameRequired")}),
        age: z
            .number()
            .int({message: i18n.t("validation.ageInteger")})
            .positive({message: i18n.t("validation.agePositive")})
            .max(120, {message: i18n.t("validation.ageMax")}),
        phone: z
            .string()
            .min(10, {message: i18n.t("validation.phoneInvalid")})
            .regex(/^\+?\d{10,15}$/, {message: i18n.t("validation.phoneInvalid")}),
        interests: z.array(z.string()).optional(),
        description: z.string().optional(),
        avatar: z.string().optional(),
    });

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

    const handleSave = async () => {
        const interestsArray =
            typeof interests === "string"
                ? interests.split(",").map((interest) => interest.trim())
                : interests;

        const validationResult = profileSchema.safeParse({
            name,
            avatar,
            surname,
            age: Number(age),
            phone,
            interests: interestsArray,
            description,
        });

        if (!validationResult.success) {
            const zodErrors = validationResult.error.flatten().fieldErrors;
            setErrors(zodErrors);
            return;
        }

        setErrors({});

        await usersStore.updateUserProfile(usersStore.currentUser?.id || "", {
            name,
            avatar,
            surname,
            age: Number(age),
            phone,
            interests: interestsArray,
            description,
        });
        router.back();
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView style={styles.scrollView}>
                <ThemedView style={styles.container}>
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
                    <ThemedInput
                        label={i18n.t("profile.name")}
                        placeholder={i18n.t("profile.name")}
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        errorMessage={errors.name?.[0]}
                    />
                    <ThemedInput
                        placeholder={i18n.t("profile.surname")}
                        label={i18n.t("profile.surname")}
                        style={styles.input}
                        value={surname}
                        onChangeText={setSurname}
                        errorMessage={errors.surname?.[0]}
                    />
                    <ThemedInput
                        label={i18n.t("profile.age")}
                        placeholder={i18n.t("profile.age")}
                        style={styles.input}
                        value={age}
                        onChangeText={setAge}
                        keyboardType="numeric"
                        errorMessage={errors.age?.[0]}
                    />
                    <ThemedInput
                        label={i18n.t("profile.phone")}
                        placeholder={i18n.t("profile.phone")}
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        errorMessage={errors.phone?.[0]}
                    />
                    <ThemedInput
                        label={i18n.t("profile.interests")}
                        placeholder={i18n.t("profile.interests")}
                        style={styles.input}
                        value={Array.isArray(interests) ? interests.join(", ") : interests}
                        onChangeText={setInterests}
                        errorMessage={errors.interests?.[0]}
                    />
                    <ThemedInput
                        label={i18n.t("profile.dontInterest")}
                        placeholder={i18n.t("profile.dontInterest")}
                        style={styles.input}
                        value={Array.isArray(notInterests) ? notInterests.join(", ") : notInterests}
                        onChangeText={setNotInterests}
                        errorMessage={errors.dontInterest?.[0]}
                    />
                    <ThemedInput
                        label={i18n.t("profile.description")}
                        placeholder={i18n.t("profile.description")}
                        style={[styles.input]}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        errorMessage={errors.description?.[0]}
                    />
                    <Button
                        title={i18n.t("button.save")}
                        onPress={handleSave}
                        buttonStyle={BaseStyles.baseButton}
                        icon={{
                            name: "save-outline",
                            type: "ionicon",
                            color: "#fff",
                            size: 20,
                            style: {marginRight: 10},
                        }}
                        loading={usersStore.isLoading}
                    />
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
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

    input: {
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
    },

    textArea: {
        height: 100,
        textAlignVertical: "top",
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
        fontSize: 14,
        marginTop: 5,
    },


});

export default EditProfile;

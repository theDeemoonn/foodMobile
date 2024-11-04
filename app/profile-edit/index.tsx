import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
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
import { ScrollView, StyleSheet, TextInput } from "react-native";
import { z } from "zod";

const EditProfile = observer(() => {
    const router = useRouter();

    const [name, setName] = useState(usersStore.currentUser?.name || "");
    const [surname, setSurname] = useState(usersStore.currentUser?.surname || "");
    const [age, setAge] = useState(usersStore.currentUser?.age?.toString() || "");
    const [phone, setPhone] = useState(usersStore.currentUser?.phone || "");
    const [interests, setInterests] = useState(
        usersStore.currentUser?.interests || "",
    );
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
        name: z.string().min(1, { message: i18n.t("validation.nameRequired") }),
        surname: z
            .string()
            .min(1, { message: i18n.t("validation.surnameRequired") }),
        age: z
            .number()
            .int({ message: i18n.t("validation.ageInteger") })
            .positive({ message: i18n.t("validation.agePositive") })
            .max(120, { message: i18n.t("validation.ageMax") }),
        phone: z
            .string()
            .min(10, { message: i18n.t("validation.phoneInvalid") })
            .regex(/^\+?\d{10,15}$/, { message: i18n.t("validation.phoneInvalid") }),
        interests: z.array(z.string()).optional(),
        description: z.string().optional(),
    });

    const handleSave = async () => {
        const interestsArray =
            typeof interests === "string"
                ? interests.split(",").map((interest) => interest.trim())
                : interests;

        const validationResult = profileSchema.safeParse({
            name,
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
            surname,
            age: Number(age),
            phone,
            interests: interestsArray,
            description,
        });
        router.back();
    };

    return (
        <ScrollView style={styles.container}>
            <ThemedView style={styles.inputContainer}>
                <ThemedText style={styles.label}>{i18n.t("profile.name")}</ThemedText>
                <TextInput style={styles.input} value={name} onChangeText={setName} />
                {errors.name && (
                    <ThemedText style={styles.errorText}>{errors.name[0]}</ThemedText>
                )}
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
                <ThemedText style={styles.label}>
                    {i18n.t("profile.surname")}
                </ThemedText>
                <TextInput
                    style={styles.input}
                    value={surname}
                    onChangeText={setSurname}
                />
                {errors.surname && (
                    <ThemedText style={styles.errorText}>{errors.surname[0]}</ThemedText>
                )}
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
                <ThemedText style={styles.label}>{i18n.t("profile.age")}</ThemedText>
                <TextInput
                    style={styles.input}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                />
                {errors.age && (
                    <ThemedText style={styles.errorText}>{errors.age[0]}</ThemedText>
                )}
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
                <ThemedText style={styles.label}>{i18n.t("profile.phone")}</ThemedText>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                {errors.phone && (
                    <ThemedText style={styles.errorText}>{errors.phone[0]}</ThemedText>
                )}
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
                <ThemedText style={styles.label}>
                    {i18n.t("profile.interests")}
                </ThemedText>
                <TextInput
                    style={styles.input}
                    value={Array.isArray(interests) ? interests.join(", ") : interests}
                    onChangeText={setInterests}
                />
                {errors.interests && (
                    <ThemedText style={styles.errorText}>
                        {errors.interests[0]}
                    </ThemedText>
                )}
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
                <ThemedText style={styles.label}>
                    {i18n.t("profile.description")}
                </ThemedText>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                />
                {errors.description && (
                    <ThemedText style={styles.errorText}>
                        {errors.description[0]}
                    </ThemedText>
                )}
            </ThemedView>

            <Button
                title={i18n.t("button.save")}
                onPress={handleSave}
                buttonStyle={styles.saveButton}
                titleStyle={styles.saveButtonText}
                icon={{
                    name: "save-outline",
                    type: "ionicon",
                    color: "#fff",
                    size: 20,
                    style: { marginRight: 10 },
                }}
                loading={usersStore.isLoading}
            />
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: Colors.light.text,
        marginBottom: 5,
    },
    input: {
        backgroundColor: Colors.light.inputBackground || "#f0f0f0",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        color: Colors.light.text,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    saveButton: {
        flexDirection: "row",
        backgroundColor: Colors.light.tint,
        borderRadius: 25,
        paddingVertical: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    saveIcon: {
        marginRight: 10,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginTop: 5,
    },
});

export default EditProfile;

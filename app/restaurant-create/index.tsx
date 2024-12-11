import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, BaseStyles } from "@/constants/Colors";
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";
import restaurantStore from "@/store/restaurant.store";
import usersStore from "@/store/users.store";
import { Restaurant } from "@/type/restaurant.interface";
import { Button } from "@rneui/themed";
import { getLocales } from "expo-localization";
import { useRouter } from "expo-router";
import { I18n } from "i18n-js";
import { z } from "zod";
import React, { useState } from "react";
import { StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";


const CreateRestaurant = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        address: "",
        phone: "",
        averagePrice: "",
        avatar: "",
        email: "",
        ogrn: "",
        inn: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const translations = {
        en: en,
        ru: ru,
    };
    const i18n = new I18n(translations);
    i18n.locale = getLocales()[0].languageCode ?? "en";
    i18n.enableFallback = true;

    const RestaurantSchema = z.object({
        name: z.string().min(1, {message: i18n.t("validation.restaurantNameRequired")}),
        description: z.string().min(1, {message: i18n.t("validation.restaurantDescriptionRequired")}),
        category: z.string().min(1, {message: i18n.t("validation.restaurantCategoriesRequired")}),
        address: z.string().min(1, {message: i18n.t("validation.restaurantAddressRequired")}),
        phone: z
            .string()
            .regex(/^[0-9]+$/, {message: i18n.t("validation.phoneInvalid")})
            .min(10, {message: i18n.t("validation.phoneInvalid")}),
        averagePrice: z.number().min(1, {message: i18n.t("validation.restaurantAveragePriceRequired")}),
        avatar: z.string().optional(),
        email: z.string().email({message: i18n.t("validation.emailInvalid")}),
        ogrn: z.string().min(13, {message: i18n.t("validation.OGRNRequired")}),
        inn: z.string().min(10, {message: i18n.t("validation.INNRequired")}),
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({...prev, [field]: value}));
    };

    const handleAvatarPick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets?.[0].uri) {
            setFormData((prev) => ({...prev, avatar: result.assets[0].uri}));
        }
    };

    const handleSubmit = () => {
        const validationResult = RestaurantSchema.safeParse({
            ...formData,
            averagePrice: Number(formData.averagePrice),
        });
        if (validationResult.success) {
            void restaurantStore.createRestaurant(validationResult.data as Restaurant);
            router.replace("/profile");


        } else {
            const newErrors: Record<string, string> = {};
            validationResult.error.errors.forEach((error) => {
                if (error.path[0]) {
                    newErrors[error.path[0] as string] = error.message;
                }
            });
            setErrors(newErrors);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView style={styles.scrollView}>
                    <ThemedView style={styles.container}>
                        <TouchableOpacity onPress={handleAvatarPick} style={styles.avatarButton}>
                            <Ionicons name="camera" size={24} color={Colors.light.tint}/>
                            <ThemedText style={styles.avatarText}>{i18n.t("button.loadAvatar")}</ThemedText>
                        </TouchableOpacity>
                        {formData.avatar && (
                            <Image source={{uri: formData.avatar}} style={styles.avatar}/>
                        )}
                        {errors.avatar && (
                            <ThemedText style={styles.errorText}>{errors.avatar}</ThemedText>
                        )}

                        <ThemedInput
                            placeholder={i18n.t("restaurant.email")}
                            value={formData.email}
                            onChangeText={(value) => handleInputChange("email", value)}
                            errorMessage={errors.email}
                        />
                        <ThemedInput
                            placeholder={i18n.t("restaurant.name")}
                            value={formData.name}
                            onChangeText={(value) => handleInputChange("name", value)}
                            errorMessage={errors.name}
                        />

                        <ThemedInput
                            placeholder={i18n.t("restaurant.description")}
                            value={formData.description}
                            onChangeText={(value) => handleInputChange("description", value)}
                            multiline
                            numberOfLines={4}
                            errorMessage={errors.description}
                        />

                        <ThemedInput
                            placeholder={i18n.t("restaurant.categories")}
                            value={formData.category}
                            onChangeText={(value) => handleInputChange("category", value)}
                            errorMessage={errors.category}
                        />

                        <ThemedInput
                            placeholder={i18n.t("restaurant.address")}
                            value={formData.address}
                            onChangeText={(value) => handleInputChange("address", value)}
                            errorMessage={errors.address}
                        />

                        <ThemedInput
                            placeholder={i18n.t("restaurant.phone")}
                            value={formData.phone}
                            onChangeText={(value) => handleInputChange("phone", value)}
                            keyboardType="phone-pad"
                            errorMessage={errors.phone}
                        />
                        <ThemedInput
                            placeholder={i18n.t("restaurant.OGRN")}
                            value={formData.ogrn}
                            onChangeText={(value) => handleInputChange("ogrn", value)}
                            keyboardType="phone-pad"
                            errorMessage={errors.ogrn}
                        />
                        <ThemedInput
                            placeholder={i18n.t("restaurant.INN")}
                            value={formData.inn}
                            onChangeText={(value) => handleInputChange("inn", value)}
                            keyboardType="phone-pad"
                            errorMessage={errors.inn}
                        />

                        <ThemedInput
                            placeholder={i18n.t("restaurant.averagePrice")}
                            value={formData.averagePrice}
                            onChangeText={(value) => handleInputChange("averagePrice", value)}
                            keyboardType="numeric"
                            errorMessage={errors.averagePrice}
                        />

                        <Button
                            title={i18n.t("restaurant.button.create")}
                            onPress={handleSubmit}
                            buttonStyle={BaseStyles.baseButton}
                            icon={
                                <Ionicons
                                    name="add-circle-outline"
                                    size={20}
                                    color="white"
                                    style={styles.saveIcon}
                                />
                            }
                        />
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
    avatarButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    avatarText: {
        marginLeft: 10,
        color: Colors.light.tint,
        fontWeight: "bold",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginBottom: 15,
    },
    saveIcon: {
        marginRight: 10,
    },
});

export default CreateRestaurant;
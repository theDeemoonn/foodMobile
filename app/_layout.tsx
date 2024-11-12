import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { observer } from "mobx-react-lite";
import authStore from "@/store/auth.store";
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";
import { I18n } from "i18n-js";
import { getLocales } from "expo-localization";

void SplashScreen.preventAutoHideAsync();

const RootLayout = observer(() => {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const segments = useSegments();
    const [isReady, setIsReady] = useState(false);

    const translations = {
        en: en,
        ru: ru,
    };
    const i18n = new I18n(translations);
    i18n.locale = getLocales()[0].languageCode ?? "en";
    i18n.enableFallback = true;

    const [loaded, error] = useFonts({
        FiraCode: require("../assets/fonts/FiraCode-Regular.ttf"),
    });

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded && isReady) {
            void SplashScreen.hideAsync();
        }
    }, [loaded, isReady]);

    useEffect(() => {
        const checkAuthAndNavigate = async () => {
            await authStore.checkAuth();
            setIsReady(true);
        };

        void checkAuthAndNavigate();
    }, []);

    useEffect(() => {
        if (isReady) {
            const inAuthGroup = segments[0] === "(auth)";

            if (authStore.isAuthenticated && inAuthGroup) {
                router.replace("/(tabs)");
            } else if (!authStore.isAuthenticated && !inAuthGroup) {
                router.replace("/(auth)");
            }
        }
    }, [isReady, authStore.isAuthenticated, segments]);

    if (!loaded || !isReady) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                <Stack.Screen
                    name="profile-edit"
                    options={{
                        title: i18n.t("profile.editProfile"),
                        headerBackTitle: i18n.t("button.back"),
                        headerBackTitleVisible: true,
                    }}
                />
                <Stack.Screen
                    name="profile-started"
                    options={{
                        headerShown: false,
                        title: i18n.t("profile.startedProfile"),
                    }}
                />
            </Stack>
        </ThemeProvider>
    );
});

export default RootLayout;

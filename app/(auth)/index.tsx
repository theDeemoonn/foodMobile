import { useEffect, useState } from "react";
import { Button, Card } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedIcon } from "@/components/ThemedIcon";
import { observer } from "mobx-react-lite";
import authStore from "@/store/auth.store";
import EmailValidationComponent from "@/components/EmailValidationComponent";
import { I18n } from "i18n-js";
import { getLocales } from "expo-localization";
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";

const translations = {
    en: en,
    ru: ru,
};

const i18n = new I18n(translations);
i18n.locale = getLocales()[0].languageCode ?? "en";
i18n.enableFallback = true;

const AuthComponent = observer(() => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [isLogin, setIsLogin] = useState(true);

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        if (!authStore.needsEmailConfirmation) {
            authStore.setEmail("");
        }
        authStore.setPassword("");
        authStore.setConfirmPassword("");
        authStore.setEmailError("");
        authStore.setPasswordError("");
        authStore.setConfirmPasswordError("");
        authStore.needsEmailConfirmation = false;
    };

    useEffect(() => {
        if (
            !authStore.needsEmailConfirmation &&
            !authStore.isAuthenticated &&
            !isLogin
        ) {
            setIsLogin(true);
        }
    }, [authStore.needsEmailConfirmation, authStore.isAuthenticated]);

    return (
        <ThemedView style={styles.view}>
            <ThemedText type="title">{i18n.t("auth.welcome")}</ThemedText>
            {authStore.needsEmailConfirmation ? (
                <ThemedCard>
                    <Card.Title>
                        <ThemedText>{i18n.t("auth.confirmEmail")}</ThemedText>
                    </Card.Title>
                    <Card.Divider />
                    <View>
                        <ThemedInput
                            value={authStore.confirmationCode}
                            onChangeText={(text) => authStore.setConfirmationCode(text)}
                            errorMessage={authStore.confirmationCodeError}
                            label={i18n.t("auth.placeholder.confirmationCode")}
                            placeholder={i18n.t("auth.placeholder.confirmationCode")}
                        />
                        <Button
                            title={i18n.t("auth.button.confirmEmail")}
                            onPress={() => authStore.confirmEmail()}
                            loading={authStore.isLoading}
                            disabled={authStore.isLoading}
                        />
                    </View>
                </ThemedCard>
            ) : (
                <ThemedCard>
                    <Card.Title>
                        <ThemedText>
                            {isLogin ? i18n.t("auth.auth") : i18n.t("auth.register")}
                        </ThemedText>
                    </Card.Title>
                    <Card.Divider />
                    <View>
                        <EmailValidationComponent />
                        <ThemedInput
                            textContentType="password"
                            secureTextEntry={secureTextEntry}
                            value={authStore.password}
                            onChangeText={(text) => authStore.setPassword(text)}
                            errorMessage={authStore.passwordError}
                            label={i18n.t("auth.password")}
                            leftIcon={<ThemedIcon name="lock" size={20} />}
                            rightIcon={
                                <ThemedIcon
                                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                                    name={secureTextEntry ? "eye" : "eye-off"}
                                    size={20}
                                />
                            }
                            placeholder={i18n.t("auth.placeholder.password")}
                        />
                        {!isLogin && (
                            <ThemedInput
                                textContentType="password"
                                secureTextEntry={secureTextEntry}
                                value={authStore.confirmPassword}
                                onChangeText={(text) => authStore.setConfirmPassword(text)}
                                errorMessage={authStore.confirmPasswordError}
                                label={i18n.t("auth.placeholder.confirmPassword")}
                                leftIcon={<ThemedIcon name="lock" size={20} />}
                                placeholder={i18n.t("auth.placeholder.confirmPassword")}
                            />
                        )}
                        <Button
                            title={
                                isLogin
                                    ? i18n.t("auth.button.login")
                                    : i18n.t("auth.button.register")
                            }
                            onPress={() =>
                                isLogin ? authStore.login() : authStore.register()
                            }
                            loading={authStore.isLoading}
                            disabled={authStore.isLoading}
                        />
                        <Button
                            title={
                                isLogin
                                    ? i18n.t("auth.noAccount")
                                    : i18n.t("auth.alreadyHaveAccount")
                            }
                            onPress={toggleAuthMode}
                            type="clear"
                            containerStyle={styles.toggleButton}
                        />
                    </View>
                </ThemedCard>
            )}
        </ThemedView>
    );
});

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: "center",
    },
    toggleButton: {
        marginTop: 10,
    },
});

export default AuthComponent;

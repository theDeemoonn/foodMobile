import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Button } from '@rneui/themed';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedCard } from '@/components/ThemedCard';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedIcon } from '@/components/ThemedIcon';
import authStore from '@/store/auth.store';
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";
import {I18n} from "i18n-js";
import {getLocales} from "expo-localization";

const RegisterScreen = observer(() => {
    const [confirmPassword, setConfirmPassword] = useState('');

    const translations = {
        en: en,
        ru: ru,
    };
    const i18n = new I18n(translations);
    i18n.locale = getLocales()[0].languageCode ?? 'en';
    i18n.enableFallback = true;

    const handleRegister = async () => {
        if (authStore.password !== confirmPassword) {
            authStore.setConfirmPasswordError(i18n.t('error.passwordMismatch'));
            return;
        }
        await authStore.register();
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText  type="title">{i18n.t('auth.register')}</ThemedText>
            <ThemedCard>
                <View>
                    <ThemedInput
                        value={authStore.email}
                        onChangeText={(text) => authStore.setEmail(text)}
                        errorMessage={authStore.emailError}
                        label={i18n.t('auth.email')}
                        textContentType="emailAddress"
                        leftIcon={<ThemedIcon name="email" size={20} />}
                        placeholder={i18n.t('auth.placeholder.email')}
                    />
                    <ThemedInput
                        value={authStore.username}
                        onChangeText={(text) => authStore.setEmail(text)}
                        errorMessage={authStore.usernameError}
                        label={i18n.t('auth.username')}
                        textContentType="nickname"
                        leftIcon={<ThemedIcon name="shield-account-outline" size={20} />}
                        placeholder={i18n.t('auth.placeholder.username')}
                    />
                    <ThemedInput
                        value={authStore.password}
                        onChangeText={(text) => authStore.setPassword(text)}
                        errorMessage={authStore.passwordError}
                        label={i18n.t('auth.password')}
                        textContentType="newPassword"
                        secureTextEntry
                        leftIcon={<ThemedIcon name="lock" size={20} />}
                        placeholder={i18n.t('auth.placeholder.password')}
                    />
                    <ThemedInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        errorMessage={authStore.confirmPasswordError}
                        label={i18n.t('auth.placeholder.confirmPassword')}
                        textContentType="newPassword"
                        secureTextEntry
                        leftIcon={<ThemedIcon name="lock-check" size={20} />}
                        placeholder={i18n.t('auth.placeholder.confirmPassword')}
                    />
                    <Button
                        title={i18n.t('auth.button.register')}
                        onPress={handleRegister}
                        loading={authStore.isLoading}
                        disabled={authStore.isLoading}
                    />
                </View>
            </ThemedCard>
            <View style={styles.linkContainer}>
                <ThemedText>{i18n.t('auth.alreadyHaveAccount')} </ThemedText>
                <Link href="/auth/login">
                    <ThemedText style={styles.link}>{i18n.t('auth.button.login')}</ThemedText>
                </Link>
            </View>
        </ThemedView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    link: {
        color: '#0000FF',
    },
});

export default RegisterScreen;
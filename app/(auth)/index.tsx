import React, { useState } from "react";
import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';


import { Button, Card } from '@rneui/themed';

import { StyleSheet, View } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedIcon } from "@/components/ThemedIcon";
import { observer } from "mobx-react-lite";
import authStore from "@/store/auth.store";
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";

const AuthComponent = observer(() => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [isLogin, setIsLogin] = useState(true);
    const translations = {
        en: en,
        ru: ru,
    };
    const i18n = new I18n(translations);
    i18n.locale = getLocales()[0].languageCode ?? 'en';
    i18n.enableFallback = true;

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        authStore.setEmail('');
        authStore.setPassword('');
        authStore.setConfirmPassword('');
        authStore.setEmailError('');
        authStore.setPasswordError('');
        authStore.setConfirmPasswordError('');
    };

    return (
        <ThemedView style={styles.view}>
            <ThemedText type="title">{i18n.t('auth.welcome')}</ThemedText>
            <ThemedCard>
                <Card.Title><ThemedText>{isLogin ? i18n.t('auth.auth') : i18n.t('auth.register')}</ThemedText></Card.Title>
                <Card.Divider/>
                <View>
                    <ThemedInput
                        errorMessage={authStore.emailError}
                        value={authStore.email}
                        onChangeText={(text) => authStore.setEmail(text)}
                        label={i18n.t('auth.email')}
                        textContentType={'emailAddress'}
                        leftIcon={<ThemedIcon name="account" size={20}/>}
                        placeholder={i18n.t('auth.placeholder.email')}
                    />
                    <ThemedInput
                        textContentType={'password'}
                        secureTextEntry={secureTextEntry}
                        value={authStore.password}
                        onChangeText={(text) => authStore.setPassword(text)}
                        errorMessage={authStore.passwordError}
                        label={i18n.t('auth.password')}
                        leftIcon={<ThemedIcon name="account-key" size={20}/>}
                        rightIcon={
                            <ThemedIcon
                                onPress={() => setSecureTextEntry(prevState => !prevState)}
                                name={secureTextEntry ? 'eye' : 'eye-off'}
                                size={20}/>
                        }
                        rightIconContainerStyle={{}}
                        placeholder={i18n.t('auth.placeholder.password')}
                    />
                    {!isLogin && (
                        <ThemedInput
                            textContentType={'password'}
                            secureTextEntry={secureTextEntry}
                            value={authStore.confirmPassword}
                            onChangeText={(text) => authStore.setConfirmPassword(text)}
                            errorMessage={authStore.confirmPasswordError}
                            label={i18n.t('auth.placeholder.confirmPassword')}
                            leftIcon={<ThemedIcon name="account-key" size={20}/>}
                            placeholder={i18n.t('auth.placeholder.confirmPassword')}
                        />
                    )}
                    <Button
                        title={isLogin ? i18n.t('auth.button.login') : i18n.t('auth.button.register')}
                        onPress={() => isLogin ? authStore.login() : authStore.register()}
                        loading={authStore.isLoading}
                        disabled={authStore.isLoading}
                    />
                    <Button
                        title={isLogin ? i18n.t('auth.noAccount') : i18n.t('auth.alreadyHaveAccount')}
                        onPress={toggleAuthMode}
                        type="clear"
                        containerStyle={styles.toggleButton}
                    />
                </View>
            </ThemedCard>
        </ThemedView>
    );
});

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
    },
    toggleButton: {
        marginTop: 10,
    }
});

export default AuthComponent;
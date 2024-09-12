import {useState} from "react";
import {I18n} from 'i18n-js';
import {getLocales} from 'expo-localization';
import ru from '../../locales/ru/ru.json';
import en from '../../locales/en/en.json';

import {Button, Card} from '@rneui/themed';

import {StyleSheet, View} from "react-native";

import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {ThemedCard} from "@/components/ThemedCard";
import {ThemedInput} from "@/components/ThemedInput";
import {ThemedIcon} from "@/components/ThemedIcon";
import {observer} from "mobx-react-lite";
import authStore from "@/store/auth.store";
import {Link} from "expo-router";

const AuthComponent = observer(() => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const translations = {
        en: en,
        ru: ru,
    };
    const i18n = new I18n(translations);
    i18n.locale = getLocales()[0].languageCode ?? 'en';
    i18n.enableFallback = true;

    return (
        <ThemedView style={styles.view}>

            <ThemedText  type="title">{i18n.t('auth.welcome')}</ThemedText>


            <ThemedCard>
                <Card.Title><ThemedText>{i18n.t('auth.auth')}</ThemedText></Card.Title>
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
                    {/*{!authStore.isAuthenticated && (*/}
                    {/*    <ThemedInput*/}
                    {/*        placeholder="Подтвердите пароль"*/}
                    {/*        value={authStore.confirmPassword}*/}
                    {/*        onChangeText={text => authStore.setConfirmPassword(text)}*/}
                    {/*        secureTextEntry={secureTextEntry}*/}
                    {/*        errorMessage={authStore.confirmPasswordError}*/}
                    {/*        leftIcon={<ThemedIcon name="account-key" size={20}/>}*/}
                    {/*    />*/}
                    {/*)}*/}
                    {/*{!authStore.isAuthenticated*/}
                    {/*    ?*/}
                        <Button title={i18n.t('auth.button.login')} onPress={() => authStore.login()}  loading={authStore.isLoading} disabled={authStore.isLoading}/>
                        {/*:*/}
                        {/*<Button title={i18n.t('auth.button.register')} onPress={() => authStore.register()} loading={authStore.isLoading} disabled={authStore.isLoading}/>*/}
                    {/*}*/}
                </View>
            </ThemedCard>
            <View style={styles.linkContainer}>
                <ThemedText>{i18n.t('auth.noAccount')} </ThemedText>
                <Link href="/auth/register">
                    <ThemedText style={styles.link}>{i18n.t('auth.button.register')}</ThemedText>
                </Link>
            </View>

        </ThemedView>

    );
})


const styles = StyleSheet.create({
    view: {
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
})

export default AuthComponent;

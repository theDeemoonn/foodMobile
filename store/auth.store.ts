import {makeAutoObservable} from 'mobx';
import {Alert} from 'react-native';
import {z} from 'zod';
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";
import {I18n} from "i18n-js";
import {getLocales} from "expo-localization";
import {User} from "@/type/user.interface";
import api from "@/constants/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";


const translations = {
    en: en,
    ru: ru,
};
const i18n = new I18n(translations);
i18n.locale = getLocales()[0].languageCode ?? 'en';
i18n.enableFallback = true;
const emailSchema = z.string().email({message: `${i18n.t('error.email')}`});
const passwordSchema = z.string().min(6, {message: `${i18n.t('error.password')}`});

class AuthStore {
    email: string = '';
    username: string = '';
    password: string = '';
    confirmPassword: string = '';
    emailError: string = '';
    usernameError: string = '';
    passwordError: string = '';
    confirmPasswordError: string = '';
    isLoading: boolean = false;
    isAuthenticated: boolean = false;
    access_token: string | null = null;
    refresh_token: string | null = null;
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setEmail(email: string) {
        this.email = email;
    }

    setPassword(password: string) {
        this.password = password;
    }

    setConfirmPassword(confirmPassword: string) {
        this.confirmPassword = confirmPassword;
    }

    setEmailError(error: string) {
        this.emailError = error;
    }

    setPasswordError(error: string) {
        this.passwordError = error;
    }

    setConfirmPasswordError(error: string) {
        this.confirmPasswordError = error;
    }

    setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    setAuthenticated(authenticated: boolean) {
        this.isAuthenticated = authenticated;
    }

    async setAccessToken(token: string) {
        await AsyncStorage.setItem('access_token', token);
    }

    async setRefreshToken(token: string) {
        await AsyncStorage.setItem('refresh_token', token);
    }

    async setSessionId(session_id: string) {
        await AsyncStorage.setItem('session_id', session_id);
    }

    async getAccessToken(): Promise<string | null> {
        return await AsyncStorage.getItem('access_token');
    }

    async getRefreshToken(): Promise<string | null> {
        return await AsyncStorage.getItem('refresh_token');
    }

    async getSessionId(): Promise<string | null> {
        return await AsyncStorage.getItem('session_id');
    }


    validateEmail() {
        try {
            emailSchema.parse(this.email);
            this.setEmailError('');
            return true;
        } catch (e) {
            if (e instanceof z.ZodError) {
                this.setEmailError(e.errors[0].message);
            }
            return false;
        }
    }

    validatePassword() {
        try {
            passwordSchema.parse(this.password);
            this.setPasswordError('');
            return true;
        } catch (e) {
            if (e instanceof z.ZodError) {
                this.setPasswordError(e.errors[0].message);
            }
            return false;
        }
    }

    validateConfirmPassword() {
        if (this.password === this.confirmPassword) {
            this.setConfirmPasswordError('');
            return true;
        } else {
            this.setConfirmPasswordError('Пароли не совпадают');
            return false;
        }
    }

    async login() {
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();

        if (isEmailValid && isPasswordValid) {
            this.setLoading(true);
            try {
                // Замените URL на ваш бэкенд-эндпоинт
                const response = await api.post('/auth/login',
                { email: this.email, password: this.password },
                { headers: { 'Content-Type': 'application/json' }
                }, true);

                await this.setAccessToken(response.data.access_token);
                await this.setRefreshToken(response.data.refresh_token);
                await this.setSessionId(response.data.session_id);
                this.setAuthenticated(true);

                Alert.alert('Успех', 'Авторизация успешна');
            } catch (error: any) {
                Alert.alert('Ошибка', error.message);
            } finally {
                this.setLoading(false);
            }
        }
    }


    async checkAuth() {
        try {
            const accessToken = await this.getAccessToken();

            if (accessToken) {
                // Проверяем валидность access token
                try {
                    await api.post(
                        '/auth/validate',
                        { access_token: accessToken },
                        { headers: { 'Content-Type': 'application/json' } },
                        true
                    );
                    // Если access token валиден
                    this.setAuthenticated(true);
                    return;
                } catch (error) {
                    // Если access token недействителен, попробуем обновить его
                    console.warn('Access token invalid, attempting to refresh.');
                }
            }

            // Если access token отсутствует или недействителен, проверяем refresh token
            const refreshToken = await this.getRefreshToken();
            if (refreshToken) {
                try {
                    // Отправляем запрос на обновление access token
                    const response = await api.post(
                        '/auth/refresh',
                        { refresh_token: refreshToken },
                        { headers: { 'Content-Type': 'application/json' } },
                        true
                    );
                    const { access_token, refresh_token } = response.data;

                    if (access_token && refresh_token) {
                        // Сохраняем новые токены
                        await this.setAccessToken(access_token);
                        await this.setRefreshToken(refresh_token);

                        this.setAuthenticated(true);
                    } else {
                        // Если не удалось получить новые токены
                        console.warn('Failed to refresh tokens, logging out.');
                        await this.logout();
                        this.setAuthenticated(false);
                    }
                } catch (error) {
                    // Ошибка при обновлении токена
                    console.error('Refresh token invalid or expired:', error);
                    await this.logout();
                    this.setAuthenticated(false);
                }
            } else {
                // Если refresh token отсутствует
                console.warn('No refresh token found, user is not authenticated.');
                this.setAuthenticated(false);
            }
        } catch (error) {
            console.error('Check auth error:', error);
            this.setAuthenticated(false);
        }
    }

    async register() {
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        const isConfirmPasswordValid = this.validateConfirmPassword();

        if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            this.setLoading(true);
            try {
                // Замените URL на ваш бэкенд-эндпоинт
                const response = await api.post('/auth/register',
                    { email: this.email, password: this.password },
                    { headers: { 'Content-Type': 'application/json' } ,
                    }, true);



                await this.setAccessToken(response.data.access_token);
                await this.setRefreshToken(response.data.refresh_token);
                this.setAuthenticated(true);
                Alert.alert('Успех', 'Регистрация успешна');
            } catch (error: any) {
                Alert.alert('Ошибка', error.message);
            } finally {
                this.setLoading(false);
            }
        }
    }

    async refreshAccessToken() {
        if (!this.refresh_token) {
            return;
        }

        try {
            const response = await fetch('https://your-backend-endpoint.com/api/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: this.refresh_token }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении токена');
            }

            const data = await response.json();
            await this.setAccessToken(data.accessToken);
        } catch (error: any) {
            Alert.alert('Ошибка', error.message);
            await this.logout();
        }
    }

    async logout() {
        try {
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('refresh_token');
            await AsyncStorage.removeItem('session_id');
            this.setAuthenticated(false);
            this.email = '';
            this.password = '';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
}

const authStore = new AuthStore();
export default authStore;
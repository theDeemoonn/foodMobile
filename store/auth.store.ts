import {makeAutoObservable} from 'mobx';
import {Alert} from 'react-native';
import {z} from 'zod';
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";
import {I18n} from "i18n-js";
import {getLocales} from "expo-localization";
import * as SecureStore from 'expo-secure-store'
import {User} from "@/type/user.interface";


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
    isAuthenticated: boolean = true;
    accessToken: string | null = null;
    refreshToken: string | null = null;
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

    setAccessToken(token: string | null) {
        this.accessToken = token;
    }

    setRefreshToken(token: string | null) {
        this.refreshToken = token;
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
                const response = await fetch('http://localhost:8080/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: this.email, password: this.password }),
                });

                if (!response.ok) {
                    throw new Error('Ошибка при отправке данных');
                }

                const data = await response.json();
                this.setAccessToken(data.accessToken);
                this.setRefreshToken(data.refreshToken);
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
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            // Здесь вы можете добавить логику для проверки валидности токена
            // Например, отправить запрос на сервер для проверки токена
            this.setAuthenticated(true);
            this.setAccessToken(token);
        } else {
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
                const response = await fetch('https://your-backend-endpoint.com/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: this.email, password: this.password }),
                });

                if (!response.ok) {
                    throw new Error('Ошибка при отправке данных');
                }

                const data = await response.json();
                this.setAccessToken(data.accessToken);
                this.setRefreshToken(data.refreshToken);
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
        if (!this.refreshToken) {
            return;
        }

        try {
            const response = await fetch('https://your-backend-endpoint.com/api/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: this.refreshToken }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении токена');
            }

            const data = await response.json();
            this.setAccessToken(data.accessToken);
        } catch (error: any) {
            Alert.alert('Ошибка', error.message);
            this.logout();
        }
    }

    logout() {
        this.setAuthenticated(false);
        this.setEmail('');
        this.setPassword('');
        this.setConfirmPassword('');
        this.setAccessToken(null);
        this.setRefreshToken(null);
        Alert.alert('Успех', 'Вы успешно вышли из системы');
    }
}

const authStore = new AuthStore();
export default authStore;
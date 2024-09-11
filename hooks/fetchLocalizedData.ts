import { useState, useEffect } from 'react';

import axios, { AxiosError } from 'axios';
import {getLocales} from "expo-localization";

// Обобщенный тип для ошибки
type ErrorType = string | null;

// Хук для получения локализованных данных
export function useLocalizedData<T>(url: string): [T | null, boolean, ErrorType] {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType>(null);

    useEffect(() => {
        fetchLocalizedData();
    }, []);

    const fetchLocalizedData = async () => {
        try {
            const deviceLocale = getLocales()[0].languageCode ?? 'en';
            const response = await axios.get<T>(url, {
                headers: {
                    'Accept-Language': deviceLocale
                }
            });
            setData(response.data);
        } catch (err) {
            const error = err as AxiosError;
            setError(error.message || 'Error fetching data');
            console.error('Error fetching localized data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return [data, isLoading, error];
}
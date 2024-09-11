import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {Button} from "@rneui/themed";
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";
import {I18n} from "i18n-js";
import {getLocales} from "expo-localization";
import {Colors} from "@/constants/Colors";


//TODO: Реализовать категории на бэке и подгружать их оттуда в зависимости от языка
const categories: string[] = [
    'Ментальное здоровье', 'Выставка', 'Спектакль', 'Необычное', 'Stand up',
    'Кино', 'Концерт', 'Вечеринка', 'Маркет', 'Алкоголь', 'Туристы', 'Экскурсии',
    '18+', 'Животные', 'Иммерсивное', 'Пушкинская карта', 'Фестиваль', 'Еда',
    'Лекции', 'Мастер-классы'
];

const CategorySelect: React.FC = () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const translations = {
        en: en,
        ru: ru,
    };
    const i18n = new I18n(translations);
    i18n.locale = getLocales()[0].languageCode ?? 'en';
    i18n.enableFallback = true;


    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) => {
            if (prev.includes(category)) {
                return prev.filter((item) => item !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    const isMinimumSelected = selectedCategories.length >= 3;


    return (
        <View style={styles.container}>
            <Text style={styles.header}>{i18n.t('categorySelected.chooseCategory')}</Text>
            <Text style={styles.subheader}>{i18n.t('categorySelected.minimum')}</Text>
            <ScrollView contentContainerStyle={styles.categoriesContainer}>
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.categoryButton,
                            selectedCategories.includes(category) && styles.categoryButtonSelected
                        ]}
                        onPress={() => toggleCategory(category)}
                    >
                        <Text style={[
                            styles.categoryText,
                            selectedCategories.includes(category) && styles.categoryTextSelected
                        ]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Button
                size='lg'
                      title={i18n.t('button.next')}
                      disabled={!isMinimumSelected}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.categorySelected.backgroundColor
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    subheader: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    categoryButton: {
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderColor: Colors.categorySelected.borderColor,
        borderRadius: 5
    },
    categoryButtonSelected: {
        backgroundColor: Colors.categorySelected.primary,
        borderColor: Colors.categorySelected.primary
    },
    categoryText: {
        fontSize: 14,
        color: Colors.categorySelected.text
    },
    categoryTextSelected: {
        color: Colors.categorySelected.selected
    },
});

export default CategorySelect;
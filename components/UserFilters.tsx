import React, { useState } from 'react';
import {StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator} from 'react-native';
import { Button, CheckBox } from '@rneui/themed';
import { Colors } from '@/constants/Colors';
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";
import {I18n} from "i18n-js";
import {getLocales} from "expo-localization";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {useLocalizedData} from "@/hooks/fetchLocalizedData";




interface FiltersProps {
    onApplyFilters: (filters: {
        ageRange: [number, number];
        gender: string;
        interests: string[];
    }) => void;
}

const { width } = Dimensions.get('window');

const UserFilters: React.FC<FiltersProps> = ({ onApplyFilters }) => {
    const [ageRange, setAgeRange] = useState<[number, number]>([18, 100]);
    const [gender, setGender] = useState<string>('all');
    const [interests, setInterests] = useState<string[]>([]);

    const translations = {
        en: en,
        ru: ru,
    };
    const i18n = new I18n(translations);
    i18n.locale = getLocales()[0].languageCode ?? 'en';
    i18n.enableFallback = true;
    const [data, isLoading, error] = useLocalizedData<string[]>(`/categories/${i18n.locale}`, true);

    const handleApplyFilters = () => {
        onApplyFilters({ ageRange, gender, interests });
    };


    const toggleInterest = (interest: string) => {
        setInterests(prevInterests =>
            prevInterests.includes(interest)
                ? prevInterests.filter(i => i !== interest)
                : [...prevInterests, interest]
        );
    };

    return (

        <ScrollView  style={styles.scrollView}>
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>{i18n.t('userFilters.filters')}</ThemedText>

            <ThemedText>{i18n.t('userFilters.ageRange')}: {ageRange[0]} - {ageRange[1]}</ThemedText>
<ThemedView style={styles.container}>
            <MultiSlider
                values={ageRange}
                sliderLength={width - 60}
                onValuesChange={(values) => setAgeRange([values[0], values[1]])}
                min={18}
                max={100}
                step={1}
                selectedStyle={{
                    backgroundColor: Colors.categorySelected.primary
                }}
                markerStyle={{
                    backgroundColor: Colors.light.tint,
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                }}
                containerStyle={{
                    marginBottom: 20
                }}
            />
</ThemedView>

            <ThemedView style={styles.genderContainer}>
                <ThemedText>{i18n.t('userFilters.gender.gender')}:</ThemedText>
                <CheckBox
                    title={<ThemedText>{i18n.t('userFilters.gender.all')}</ThemedText>}
                    checked={gender === 'all'}
                    onPress={() => setGender('all')}
                    containerStyle={styles.checkboxContainer}
                    checkedColor={Colors.categorySelected.primary}
                />
                <CheckBox
                    title={<ThemedText>{i18n.t('userFilters.gender.male')}</ThemedText>}
                    checked={gender === 'male'}
                    onPress={() => setGender('male')}
                    containerStyle={styles.checkboxContainer}
                    checkedColor={Colors.categorySelected.primary}
                />
                <CheckBox
                    title={<ThemedText>{i18n.t('userFilters.gender.female')}</ThemedText>}
                    checked={gender === 'female'}
                    onPress={() => setGender('female')}
                    containerStyle={styles.checkboxContainer}
                    checkedColor={Colors.categorySelected.primary}
                />
            </ThemedView>

            <ThemedText style={styles.interestsTitle}>{i18n.t('userFilters.interests')}:</ThemedText>
            <ThemedView style={styles.interestsContainer}>
                {isLoading ? <ActivityIndicator /> : null}
                {error ? <ThemedText>{error}</ThemedText> : null}
                {data?.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryButton,
                            interests.includes(category) && styles.categoryButtonSelected
                        ]}
                        onPress={() => toggleInterest(category)}
                    >
                        <ThemedText >
                            {category}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </ThemedView>



            <Button
                title={i18n.t('userFilters.applyFilters')}
                onPress={handleApplyFilters}
                buttonStyle={styles.applyButton}
            />
        </ThemedView>
        </ScrollView>
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
        marginBottom: 15,
        fontSize: 20,
        fontWeight: 'bold',
    },
    genderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    checkboxContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        margin: 0,
    },
    interestsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    chipContainer: {

        margin: 2,
    },
    applyButton: {
        backgroundColor: Colors.light.tint,
        marginTop: 15,
    },
    thumbContainer: {
        backgroundColor: Colors.categorySelected.primary,
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    categoryButton: {
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderColor: Colors.categorySelected.borderColor,
        borderRadius: 5,
    },
    categoryButtonSelected: {
        backgroundColor: Colors.categorySelected.primary,
        borderColor: Colors.categorySelected.primary,
    },
    categoryText: {
        fontSize: 14,
        color: Colors.categorySelected.text,
    },
    categoryTextSelected: {
        color: Colors.categorySelected.selected,
    },
});

export default UserFilters;
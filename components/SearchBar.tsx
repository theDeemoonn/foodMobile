import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SearchBarProps {
    placeholder?: string;
    onSearch: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...', onSearch }) => {
    const [searchText, setSearchText] = useState('');
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tintColor = useThemeColor({}, 'tint');

    const handleSearch = () => {
        onSearch(searchText);
    };

    const handleClear = () => {
        setSearchText('');
        onSearch('');
    };

    return (
        <ThemedView style={[styles.container, { borderColor: tintColor, backgroundColor }]}>
            <Ionicons name="search" size={20} color={textColor} style={styles.searchIcon} />
            <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder={placeholder}
                placeholderTextColor={textColor}
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
            />
            {searchText.length > 0 && (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color={textColor} />
                </TouchableOpacity>
            )}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginHorizontal: 10,
        marginVertical: 10,
        height: 40,
        borderBottomWidth: 1,
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    clearButton: {
        padding: 5,
    },
});

export default SearchBar;
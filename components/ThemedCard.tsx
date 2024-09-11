import {StyleSheet, ViewProps} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import {Card} from "@rneui/themed";

export type ThemedCardProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedCard({style, lightColor, darkColor, ...otherProps}: ThemedCardProps) {
    const backgroundColor = useThemeColor({light: darkColor, dark: lightColor}, 'background');
    return (
        <Card
            containerStyle={[{backgroundColor}, style, styles.card]}
            {...otherProps}
        />

    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 20,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});



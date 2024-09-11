import {useThemeColor} from "@/hooks/useThemeColor";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {IconProps} from "@expo/vector-icons/build/createIconSet";
import type {ComponentProps} from "react";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export type ThemedIconProps = IconProps<ComponentProps<typeof MaterialCommunityIcons>['name']> & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedIcon ({ style, lightColor, darkColor,  ...otherProps }: ThemedIconProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'icon');

    return <Icon  style={[{ color: backgroundColor }, style]} {...otherProps} />;
}
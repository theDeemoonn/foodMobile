import {useThemeColor} from "@/hooks/useThemeColor";
import {Input, InputProps} from "@rneui/themed";

export type ThemedInputProps = InputProps & {
    lightColor?: string;
    darkColor?: string;
};


export function ThemedInput ({ style, lightColor, darkColor, ...otherProps }: ThemedInputProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    return (
        <Input
            inputStyle = {[{color}, style]}
            labelStyle = {[{color}, style]}
            {...otherProps}
        />
    )

}
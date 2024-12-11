import { Avatar, AvatarProps } from "@rneui/themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";

interface UserAvatarProps extends AvatarProps {
    imageUrl?: string;
    lightColor?: string;
    darkColor?: string;
    initials: string;
    children?: React.ReactNode;
}

function UserAvatar({
                        imageUrl,
                        initials,
                        lightColor,
                        children,
                        darkColor,
                        ...props
                    }: UserAvatarProps) {
    const backgroundColor = useThemeColor(
        {light: darkColor, dark: lightColor},
        "background",
    );
    return (
        <Avatar
            source={imageUrl ? {uri: imageUrl} : undefined}
            title={!imageUrl ? initials : undefined}
            containerStyle={{backgroundColor}}
            {...props}
        >
            {children}
        </Avatar>
    );
}

export default UserAvatar;

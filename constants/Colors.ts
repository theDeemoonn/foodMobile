/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import { StyleSheet } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    inputBackground: "#ECEDEE",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    inputBackground: "#11181C",
  },
  categorySelected: {
    primary: "orange",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    text: "#11181C",
    selected: "#fff",
  },
};

export const BaseStyles = StyleSheet.create({
  baseButton: {
    flexDirection: "row",
    backgroundColor: tintColorLight,
    borderRadius: 25,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  logoutButton: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#ff6b6b",
    borderRadius: 25,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "bold",
  },
});

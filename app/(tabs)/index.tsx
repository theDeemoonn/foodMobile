import { SafeAreaView } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { Tab, TabView } from "@rneui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Tab
          value={index}
          onChange={(e) => setIndex(e)}
          indicatorStyle={{
            backgroundColor: useThemeColor(
              { light: "black", dark: "white" },
              "background",
            ),
            height: 3,
          }}
        >
          <Tab.Item
            title={<ThemedText>Рестораны</ThemedText>}
            titleStyle={{ fontSize: 16 }}
          />
          <Tab.Item
            title={<ThemedText>Мероприятия</ThemedText>}
            titleStyle={{ fontSize: 16 }}
          />
        </Tab>
        <TabView value={index} onChange={setIndex} animationType="spring">
          <TabView.Item style={{ backgroundColor: "red", width: "100%" }}>
            <ThemedText>Recent</ThemedText>
          </TabView.Item>
          <TabView.Item style={{ backgroundColor: "blue", width: "100%" }}>
            <ThemedText>Favorite</ThemedText>
          </TabView.Item>
        </TabView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

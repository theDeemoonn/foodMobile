import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import CategorySelect from "@/components/CategorySelect";

function HomeScreen() {
  return (
    <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} >
        <CategorySelect />
        </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default HomeScreen;

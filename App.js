import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomerScreen from "./src/features/Customer/CustomerScreen";
import { Provider } from "react-redux";
import { store } from "./src/app/store";

export default function App() {
  return (
    <Provider store={store}>
      <CustomerScreen />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

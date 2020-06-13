import React from "react";
import { CategorizationScreen } from "./src/screens/categorization.screen";
import { View } from "react-native";

export default function App() {
  return (
    <View  style={{ flex: 1 }}>
      <CategorizationScreen></CategorizationScreen>
    </View>
  );
}

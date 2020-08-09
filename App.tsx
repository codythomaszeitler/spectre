import React, { useState } from "react";
import { CategorizationScreen } from "./src/screens/categorization.screen";
import { View } from "react-native";
import * as Font from "expo-font";
import { AppLoading } from "expo";

const fetchFonts = () => {
  return Font.loadAsync({
    "Open Sans Semi-Bold": require("./assets/fonts/OpenSans-SemiBold.ttf"),
    "Open Sans Bold": require("./assets/fonts/OpenSans-Bold.ttf"),
    "Open Sans Regular": require("./assets/fonts/OpenSans-Regular.ttf"),
  });
};

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
      ></AppLoading>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CategorizationScreen></CategorizationScreen>
    </View>
  );
}

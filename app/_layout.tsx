import { Stack } from "expo-router";
import "react-native-reanimated";

import { ContextProvider } from "../hooks/useContext";
import { ThemeProvider } from "../hooks/useTheme";

export default function RootLayout() {
  return (
    <ContextProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </ContextProvider>
  );
}

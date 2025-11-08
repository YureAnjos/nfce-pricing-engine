import { Stack } from "expo-router";
import "react-native-reanimated";

import { ContextProvider } from "../hooks/useContext";
import { ThemeProvider } from "../hooks/useTheme";

import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ContextProvider>
      <ThemeProvider>
        <ConvexProvider client={convex}>
          <Stack screenOptions={{ headerShown: false }} />
        </ConvexProvider>
      </ThemeProvider>
    </ContextProvider>
  );
}

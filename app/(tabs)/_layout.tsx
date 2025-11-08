import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import useTheme from "../../hooks/useTheme";

const TabsLayout = () => {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Scanner",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="qrcode" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="note"
        options={{
          title: "Nota",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="receipt" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notes-list"
        options={{
          title: "Notas Salvas",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <MaterialIcons name="folder-open" size={size} color={color} />
            ) : (
              <MaterialIcons name="folder" size={size} color={color} />
            ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

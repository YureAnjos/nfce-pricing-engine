import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import useTheme, { ColorScheme } from "../hooks/useTheme";

const Input = ({
  value,
  label,
  onChangeText,
}: {
  value: string;
  label: string;
  onChangeText: (text: string) => void;
}) => {
  const { colors } = useTheme();
  const inputStyles = createInputStyles(colors);

  return (
    <View style={inputStyles.container}>
      <Text style={inputStyles.label}>{label}</Text>
      <TextInput
        inputMode="numeric"
        returnKeyType="done"
        style={inputStyles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const createInputStyles = (colors: ColorScheme) => {
  return StyleSheet.create({
    container: {
      width: "100%",
      gap: 4,
    },
    label: {
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderRadius: 6,
      borderColor: colors.text,
      width: "100%",
      color: colors.text,
      paddingLeft: 16,
      paddingVertical: 8,
      lineHeight: 18,
      fontSize: 14,
      minHeight: 30,
      textAlignVertical: "center",
    },
  });
};

export default Input;

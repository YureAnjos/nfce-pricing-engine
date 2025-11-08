import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import useTheme, { ColorScheme } from "../hooks/useTheme";

type IProps = TextInputProps & {
  label: string;
  disabled?: boolean;
};

const Input = ({ label, disabled = false, ...props }: IProps) => {
  const { colors } = useTheme();
  const inputStyles = createInputStyles(colors);

  return (
    <View style={[inputStyles.container, { opacity: disabled ? 0.5 : 1 }]}>
      <Text style={inputStyles.label}>{label}</Text>
      <TextInput
        inputMode="numeric"
        returnKeyType="done"
        style={inputStyles.input}
        editable={!disabled}
        contextMenuHidden={disabled}
        caretHidden={disabled}
        {...props}
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

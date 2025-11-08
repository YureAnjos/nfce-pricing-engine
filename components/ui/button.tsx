import React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import useTheme, { ColorScheme } from "../../hooks/useTheme";

type Props = TouchableOpacityProps & {
  text: string;
  variant?: "primary" | "destructive";
};

const Button = ({ text, variant = "primary", style, ...props }: Props) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  let backgroundColor;
  switch (variant) {
    case "primary":
      backgroundColor = colors.primary;
      break;
    case "destructive":
      backgroundColor = colors.danger;
      break;
  }

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor }, style]} activeOpacity={0.8} {...props}>
      <Text style={[styles.text, { fontSize: 18, textAlign: "center" }]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const createStyles = (colors: ColorScheme) => {
  return StyleSheet.create({
    text: {
      color: colors.text,
      fontWeight: "bold",
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 100,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.4,
      elevation: 2,
      alignSelf: "stretch",
    },
  });
};

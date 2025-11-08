import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import useTheme, { ColorScheme } from "../hooks/useTheme";
import { formatBRL, parseBRL } from "../util";

type IProps = {
  value: number;
  label: string;
  onChangeValue: (value: number) => void;
  style?: any;
  disabled?: boolean;
};

const CurrencyInput = ({ value, label, onChangeValue, style, disabled }: IProps) => {
  const { colors } = useTheme();
  const inputStyles = createInputStyles(colors);

  const [displayValue, setDisplayValue] = useState(formatBRL(value));
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const formattedText = formatBRL(value);
    setDisplayValue(formattedText);
  }, [value]);

  const handleChangeText = (text) => {
    const numericValue = parseBRL(text);
    const formattedText = formatBRL(numericValue);

    setDisplayValue(formattedText);
    onChangeValue(numericValue);

    // if (inputRef.current) {
    //   inputRef.current.setNativeProps({ text: formattedText });
    // }
  };

  return (
    <View style={[inputStyles.container, style, { opacity: disabled ? 0.5 : 1 }]}>
      <Text style={inputStyles.label}>{label}</Text>
      <TextInput
        ref={inputRef}
        inputMode="numeric"
        returnKeyType="done"
        style={inputStyles.input}
        value={displayValue}
        onChangeText={handleChangeText}
        editable={!disabled}
        contextMenuHidden={disabled}
        caretHidden={disabled}
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

export default CurrencyInput;

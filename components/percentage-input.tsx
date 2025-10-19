import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import useTheme, { ColorScheme } from "../hooks/useTheme";
import { formatPercentage, parsePercentage } from "../util";

const PercentageInput = ({
  value,
  label,
  onChangeValue,
}: {
  value: number;
  label: string;
  onChangeValue: (value: number) => void;
}) => {
  const { colors } = useTheme();
  const inputStyles = createInputStyles(colors);

  const [displayValue, setDisplayValue] = useState(formatPercentage(value));
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const formattedText = formatPercentage(value);
    setDisplayValue(formattedText);
  }, [value]);

  const handleChangeText = (text: string) => {
    if (text.trim() === "") {
      setDisplayValue("");
      onChangeValue(0);
    }

    let numericValue = parsePercentage(text);

    // user tried to remove % (erase a number)
    if (!text.match("%")) {
      const newString = text.slice(0, -1);
      numericValue = Number(parsePercentage(newString));
    }

    const formattedText = formatPercentage(numericValue);

    setDisplayValue(formattedText);
    onChangeValue(numericValue);

    if (inputRef.current) {
      inputRef.current.setNativeProps({ text: formattedText });
    }
  };

  return (
    <View style={inputStyles.container}>
      <Text style={inputStyles.label}>{label}</Text>
      <TextInput
        ref={inputRef}
        inputMode="numeric"
        returnKeyType="done"
        keyboardType="number-pad"
        style={inputStyles.input}
        value={displayValue}
        onChangeText={handleChangeText}
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

export default PercentageInput;

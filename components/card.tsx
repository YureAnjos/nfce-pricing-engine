import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View, ViewProps } from "react-native";
import useTheme from "../hooks/useTheme";

type ICardProps = ViewProps & {
  title?: string;
};

const Card = ({ title, children, style, ...props }: ICardProps) => {
  const { colors } = useTheme();
  return (
    <LinearGradient
      style={[
        {
          borderRadius: 12,
          padding: 16,
          gap: 8,
          width: "100%",
        },
        style,
      ]}
      colors={colors.gradients.surface}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {title && (
        <Text
          style={{
            color: colors.text,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {title}
        </Text>
      )}
      <View>{children}</View>
    </LinearGradient>
  );
};

export default Card;

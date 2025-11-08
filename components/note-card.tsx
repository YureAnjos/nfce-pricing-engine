import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useTheme, { ColorScheme } from "../hooks/useTheme";
import { IScanData } from "../types/types";

type Props = {
  data: IScanData;
  onClick: (data: IScanData) => void;
};

const NoteCard = ({ data, onClick }: Props) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={() => onClick(data)}>
      <LinearGradient
        style={styles.gradient}
        colors={colors.gradients.surface}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={{ gap: 4 }}>
          <View>
            <Text style={styles.title}>{data.name}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.text}>{data.date}</Text>
            <Text style={styles.text}>R$ {data.totalPrice}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const createStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    gradient: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      width: "100%",
      marginBottom: 16,
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    text: {
      color: colors.text,
      fontSize: 16,
    },
  });
  return styles;
};

export default NoteCard;

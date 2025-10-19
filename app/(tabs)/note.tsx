import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../components/card";
import ProductItem from "../../components/product-item";
import useMainContext from "../../hooks/useContext";
import useTheme, { ColorScheme } from "../../hooks/useTheme";

const Note = () => {
  const { colors } = useTheme();
  const { scanData } = useMainContext();
  const styles = createNoteStyles(colors);

  return (
    <LinearGradient
      style={styles.gradient}
      colors={colors.gradients.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Nota Fiscal</Text>

        {scanData ? (
          <>
            <Card title="Resumo da Nota">
              <Text style={styles.text}>
                <Text style={styles.highlightedText}>{"Fornecedor:"}</Text>{" "}
                {scanData.name}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.highlightedText}>{"Data:"}</Text>{" "}
                {scanData.date}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.highlightedText}>{"Total:"}</Text> R${" "}
                {scanData.totalPrice}
              </Text>
            </Card>

            {scanData && (
              <LinearGradient
                colors={colors.gradients.surface}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, padding: 16, borderRadius: 12 }}
              >
                <FlatList
                  data={scanData.items}
                  renderItem={(item) => <ProductItem data={item.item} />}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  showsVerticalScrollIndicator={false}
                />
              </LinearGradient>
            )}
          </>
        ) : (
          <Text style={styles.text}>
            Leia um QR-Code para obter as informações
          </Text>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const createNoteStyles = (colors: ColorScheme) => {
  return StyleSheet.create({
    gradient: {
      flex: 1,
      height: "100%",
    },
    container: {
      flex: 1,
      alignItems: "center",
      padding: 16,
      gap: 16,
    },
    title: {
      fontSize: 28,
      color: colors.text,
      fontWeight: "700",
    },
    text: {
      color: colors.text,
    },
    highlightedText: {
      color: colors.text,
      fontWeight: "bold",
    },
    productsContainer: {
      gap: 16,
      flex: 1,
    },
    separator: {
      height: 1,
      width: "100%",
      backgroundColor: colors.textMuted,
      marginVertical: 20,
    },
  });
};

export default Note;

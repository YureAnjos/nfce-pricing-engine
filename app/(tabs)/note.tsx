import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../components/card";
import ProductItem from "../../components/product-item";
import useMainContext from "../../hooks/useContext";
import useTheme, { ColorScheme } from "../../hooks/useTheme";
import { IItem, IScanData } from "../../types/types";

const Note = () => {
  const { colors } = useTheme();
  const { scanData: contextScanData, loading } = useMainContext();
  const [scanData, setScanData] = useState<IScanData>(contextScanData);
  const styles = createNoteStyles(colors);

  useEffect(() => {
    if (!scanData) return;
    const timeout = setTimeout(() => {
      AsyncStorage.setItem("scanData", JSON.stringify(scanData));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [scanData]);

  const onItemUpdated = (index: number, newData: IItem) => {
    setScanData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], ...newData };
      return { ...prev, items: updatedItems };
    });
  };

  if (loading) {
    return (
      <LinearGradient style={styles.gradient} colors={colors.gradients.background}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.text}>Carregando dados...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient style={styles.gradient} colors={colors.gradients.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Nota Fiscal</Text>

        {contextScanData ? (
          <>
            <Card title="Resumo da Nota">
              <Text style={styles.text}>
                <Text style={styles.highlightedText}>{"Fornecedor:"}</Text> {contextScanData.name}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.highlightedText}>{"Data:"}</Text> {contextScanData.date}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.highlightedText}>{"Total:"}</Text> R$ {contextScanData.totalPrice}
              </Text>
            </Card>

            {contextScanData && (
              <LinearGradient
                colors={colors.gradients.surface}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, padding: 16, borderRadius: 12, width: "100%" }}
              >
                <FlatList
                  data={contextScanData.items}
                  renderItem={(item) => (
                    <ProductItem data={item.item} onChange={(newData) => onItemUpdated(item.index, newData)} />
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  showsVerticalScrollIndicator={false}
                />
              </LinearGradient>
            )}
          </>
        ) : (
          <Text style={styles.text}>Leia um QR-Code para obter as informações</Text>
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

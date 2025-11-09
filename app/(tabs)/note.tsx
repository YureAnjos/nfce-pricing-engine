import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../components/card";
import ProductItem from "../../components/product-item";
import Button from "../../components/ui/button";
import { api } from "../../convex/_generated/api";
import useMainContext from "../../hooks/useContext";
import useTheme, { ColorScheme } from "../../hooks/useTheme";
import { IItem, IScanData } from "../../types/types";

const Note = () => {
  const { colors } = useTheme();
  const { scanData: contextScanData, loading, setScanData: setContextScanData } = useMainContext();

  const lastSavedRef = useRef<string | null>(null);
  const scanData = useRef<IScanData>(null);

  const [saving, setSaving] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  const [loadingNote, setLoadingNote] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const saveNote = useMutation(api.notes.saveNote);

  const styles = createNoteStyles(colors);

  const saveDataInLocalDB = () => {
    setTimeout(async () => {
      const newData = JSON.stringify(scanData.current);
      if (newData !== lastSavedRef.current) {
        await AsyncStorage.setItem("scanData", newData);
        lastSavedRef.current = newData;
      }
    }, 1000);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState !== "background" && nextAppState !== "inactive") return;
      saveDataInLocalDB();
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    setLoadingNote(true);

    const timeout = setTimeout(() => {
      scanData.current = contextScanData;
      saveDataInLocalDB();
      setResetVersion((v) => v + 1);
      setLoadingNote(false);
    }, 100);

    return () => clearTimeout(timeout);
  }, [contextScanData]);

  const onItemUpdated = (index: number, newData: Partial<IItem>) => {
    const updatedItems = [...scanData.current.items];
    updatedItems[index] = { ...updatedItems[index], ...newData };
    scanData.current = { ...scanData.current, items: updatedItems };
    saveDataInLocalDB();

    if (JSON.stringify(scanData.current) !== JSON.stringify(contextScanData) && !hasChanges) {
      setHasChanges(true);
    } else if (JSON.stringify(scanData.current) === JSON.stringify(contextScanData) && hasChanges) {
      setHasChanges(false);
    }
  };

  const saveAction = async () => {
    try {
      setSaving(true);
      await saveNote(scanData.current);
    } catch (err) {
      console.warn("Error while saving note: ", err);
    } finally {
      setSaving(false);
      setContextScanData({ ...scanData.current }); // force update
    }
  };

  if (loading || loadingNote) {
    return (
      <LinearGradient style={styles.gradient} colors={colors.gradients.background}>
        <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
          <Text style={styles.title}>Carregando dados...</Text>
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient style={styles.gradient} colors={colors.gradients.background}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1, width: "100%", alignItems: "center", gap: 16 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
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
                      <ProductItem
                        key={resetVersion}
                        data={item.item}
                        onChange={(newData) => onItemUpdated(item.index, newData)}
                      />
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    showsVerticalScrollIndicator={false}
                  />
                </LinearGradient>
              )}

              <Button
                text={saving ? "Salvando..." : "Salvar alterações"}
                onPress={saveAction}
                disabled={saving || !hasChanges}
              />
            </>
          ) : (
            <Text style={styles.text}>Leia um QR-Code para obter as informações</Text>
          )}
        </KeyboardAvoidingView>
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
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 100,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.4,

      elevation: 2,

      // position: "absolute",
      // bottom: 0,
      // marginBottom: 16,

      width: "100%",
    },
  });
};

export default Note;

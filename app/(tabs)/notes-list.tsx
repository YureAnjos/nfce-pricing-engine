import { LinearGradient } from "expo-linear-gradient";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useRef, useState } from "react";
import ConfirmModal from "../../components/confirm-modal";
import NoteCard from "../../components/note-card";
import Button from "../../components/ui/button";
import { api } from "../../convex/_generated/api";
import useMainContext from "../../hooks/useContext";
import useTheme, { ColorScheme } from "../../hooks/useTheme";
import { IScanData } from "../../types/types";
import { toNumber } from "../../util";

// format: "DD/MM/YYYYY"
const parseDateString = (date: string) => {
  const parts = date.split("/");
  return new Date(toNumber(parts[2]), toNumber(parts[0]) - 1, toNumber(parts[1]));
};

const Index = () => {
  const { colors } = useTheme();
  const { setScanData } = useMainContext();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const modalData = useRef<IScanData>(null);

  const styles = createStyles(colors);

  const notes = useQuery(api.notes.getNotes);
  if (notes) {
    notes.sort((a, b) => parseDateString(a.date).getTime() - parseDateString(b.date).getTime());
  }

  const onCardClickAction = (data: IScanData) => {
    modalData.current = data;
    setConfirmModalVisible(true);
  };

  const openNote = () => {
    if (!modalData.current) return;
    setConfirmModalVisible(false);
    setScanData({ ...modalData.current }); // force update
    router.navigate("/note");
  };

  if (!notes) {
    return (
      <LinearGradient style={styles.gradient} colors={colors.gradients.background}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Carregando notas...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient style={styles.gradient} colors={colors.gradients.background}>
      <SafeAreaView style={styles.container}>
        <ConfirmModal
          animationType="slide"
          transparent={true}
          visible={confirmModalVisible}
          onRequestClose={() => setConfirmModalVisible(false)}
        >
          <Text style={{ color: colors.text, fontSize: 20, textAlign: "center" }}>
            Você tem alterações não salvas em uma nota. Deseja descartá-las e abrir outra?
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}>
            <Button text="Abrir" variant="destructive" onPress={openNote} style={{ flex: 1 }} />
            <Button text="Cancelar" onPress={() => setConfirmModalVisible(false)} style={{ flex: 1 }} />
          </View>
        </ConfirmModal>

        <Text style={styles.title}>Lista de Notas</Text>

        <FlatList
          style={{ width: "100%" }}
          data={notes}
          renderItem={(item) => <NoteCard data={item.item} onClick={onCardClickAction} />}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const createStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    gradient: {
      flex: 1,
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 22,
      gap: 12,
    },
    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: "bold",
    },
    text: {
      color: colors.text,
      fontSize: 18,
    },
    button: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 100,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.4,

      elevation: 2,
    },
  });
  return styles;
};

export default Index;

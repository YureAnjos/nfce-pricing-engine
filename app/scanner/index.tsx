import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useMainContext from "../../hooks/useContext";
import useTheme, { ColorScheme } from "../../hooks/useTheme";

const Scanner = () => {
  const { colors } = useTheme();
  const { setScannedUrl } = useMainContext();
  const [permission, grantPermission] = useCameraPermissions();
  const [isFlashOn, setIsFlashOn] = useState(false);

  const styles = createScannerStyles(colors);

  useEffect(() => {
    grantPermission();
  }, [grantPermission]);

  if (!permission)
    return (
      <LinearGradient
        style={[styles.container, { width: "100%", height: "100%" }]}
        colors={colors.gradients.background}
      />
    );
  if (!permission.granted) {
    return (
      <LinearGradient
        style={styles.container}
        colors={colors.gradients.background}
      >
        <View
          style={[
            styles.container,
            {
              justifyContent: "center",
              alignContent: "center",
              padding: 16,
              gap: 8,
            },
          ]}
        >
          <Text style={[styles.text, { fontSize: 20, textAlign: "center" }]}>
            Sem permissão para a cessar a câmera
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            activeOpacity={0.8}
            onPress={grantPermission}
          >
            <Text
              style={{ color: colors.text, fontSize: 18, textAlign: "center" }}
            >
              Ativar permissão
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const toggleFlash = () => setIsFlashOn((prev) => !prev);
  const back = () => router.back();
  const onBarcodeScanned = ({ data }: { data: string }) => {
    setScannedUrl(data);
    back();
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.container}
        enableTorch={isFlashOn}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={onBarcodeScanned}
      />

      <View style={styles.overlay}>
        <Text style={styles.text}>Aponte para o QR Code</Text>
        <View style={styles.squareContainer}>
          <View style={styles.topLeftContainer}>
            <View style={styles.topLeftBorder} />
          </View>
          <View style={styles.topRightContainer}>
            <View style={styles.topRightBorder} />
          </View>
          <View style={styles.bottomLeftContainer}>
            <View style={styles.bottomLeftBorder} />
          </View>
          <View style={styles.bottomRightContainer}>
            <View style={styles.bottomRightBorder} />
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isFlashOn ? colors.text : colors.bg },
            ]}
            activeOpacity={0.5}
            onPress={toggleFlash}
          >
            <MaterialIcons
              name="flashlight-on"
              size={32}
              color={isFlashOn ? colors.bg : colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.5}
            onPress={back}
          >
            <MaterialIcons name="close" size={32} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const createScannerStyles = (colors: ColorScheme) => {
  const borderSize = 35;
  const borderWidth = 3;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
      gap: 40,
    },
    permissionButton: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      borderRadius: 100,
      marginHorizontal: 28,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.4,

      elevation: 2,
    },
    text: {
      color: colors.text,
      fontWeight: "bold",
      fontSize: 24,
    },
    squareContainer: {
      width: "80%",
      height: "40%",
      flexDirection: "row",
      flexWrap: "wrap",
    },
    button: {
      backgroundColor: colors.bg,
      padding: 16,
      borderRadius: "50%",
      opacity: 0.8,
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "60%",
    },

    topLeftContainer: {
      width: "50%",
      height: "50%",
    },
    topLeftBorder: {
      width: borderSize,
      height: borderSize,
      borderTopWidth: borderWidth,
      borderLeftWidth: borderWidth,
      borderTopLeftRadius: 12,
      borderColor: colors.text,
    },

    topRightContainer: {
      width: "50%",
      height: "50%",
      alignItems: "flex-end",
    },
    topRightBorder: {
      width: borderSize,
      height: borderSize,
      borderTopWidth: borderWidth,
      borderRightWidth: borderWidth,
      borderTopRightRadius: 12,
      borderColor: colors.text,
    },

    bottomLeftContainer: {
      width: "50%",
      height: "50%",
      justifyContent: "flex-end",
    },
    bottomLeftBorder: {
      width: borderSize,
      height: borderSize,
      borderLeftWidth: borderWidth,
      borderBottomWidth: borderWidth,
      borderBottomLeftRadius: 12,
      borderColor: colors.text,
    },

    bottomRightContainer: {
      width: "50%",
      height: "50%",
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    bottomRightBorder: {
      width: borderSize,
      height: borderSize,
      borderRightWidth: borderWidth,
      borderBottomWidth: borderWidth,
      borderBottomRightRadius: 12,
      borderColor: colors.text,
    },
  });
};

export default Scanner;

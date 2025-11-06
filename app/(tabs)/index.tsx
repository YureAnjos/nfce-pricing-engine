import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import useMainContext from "../../hooks/useContext";
import useTheme, { ColorScheme } from "../../hooks/useTheme";
import { IItem, IScrapData } from "../../types/types";

const Index = () => {
  const { colors } = useTheme();
  const { setScanData, scannedUrl, setScannedUrl } = useMainContext();

  const homeStyles = createHomeStyles(colors);

  const handleReceiveScrapData = (data: IScrapData) => {
    const items = data.items.map((item) => {
      return {
        name: item.name,
        units: item.units,
        price: item.price,
        profitMargin: 30,
        applyDiscounts: false,
        discount: 0,
        discountPerc: 0,
      };
    }) as [IItem];

    setScanData({
      items,
      name: data.name,
      totalPrice: data.totalPrice,
      date: data.date,
    });
    setScannedUrl(null);

    router.navigate("/note");
  };

  const goToScan = () => {
    setScannedUrl(null);
    router.navigate("/scanner");
  };

  return (
    <LinearGradient style={homeStyles.gradient} colors={colors.gradients.background}>
      <SafeAreaView style={homeStyles.container}>
        <Text style={homeStyles.title}>Leitor de Nota Fiscal</Text>
        <TouchableOpacity style={homeStyles.button} activeOpacity={0.8} onPress={goToScan}>
          <Text style={homeStyles.text}>Clique para iniciar a leitura</Text>
        </TouchableOpacity>

        {scannedUrl && scannedUrl.match("sefaz") && (
          <View style={{ backgroundColor: "#fff", width: 300, height: 300 }}>
            <WebView
              source={{ uri: scannedUrl }}
              injectedJavaScript={injectedJS}
              onMessage={(e) => {
                const data = e.nativeEvent.data;

                handleReceiveScrapData(JSON.parse(data));
              }}
            />
          </View>
        )}
        {scannedUrl && !scannedUrl.match("sefaz") && (
          <Text style={[homeStyles.text, { color: colors.danger }]}>QR-Code inválido!</Text>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const createHomeStyles = (colors: ColorScheme) => {
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

const injectedJS = `
  (function() {
    const checkTable = () => {
      const rows = document.querySelectorAll('table tr');
      if (rows.length === 0) return false;
      return true;
    };

    const observer = new MutationObserver((mutations, obs) => {
      if (checkTable()) {
        const items = [];
        const rows = document.querySelectorAll('table tr');
        const txtTopo = document.querySelector('.txtTopo')
        const txtMax = document.querySelector('.txtMax')

        rows.forEach((row) => {
          const nameSpan = row.querySelector('.txtTit');
          const valueSpan = row.querySelector('.valor');
          const qtdSpan  = row.querySelector('.Rqtd');

          if (nameSpan && valueSpan && qtdSpan) {
            items.push({ 
              name: nameSpan.innerText, 
              price: parseFloat(valueSpan.innerText.trim().replace(',', '.')),
              units: parseInt(qtdSpan.innerText.trim().split(':')[1]),
            });
          }
        });

        const date = Array.from(
          document.querySelector(
            "body > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > ul > li"
          ).childNodes
        )
          .filter(n => n.nodeType === Node.TEXT_NODE)[2]
          ?.nodeValue.match(/\\d{2}\\/\\d{2}\\/\\d{4}/)?.[0];

        window.ReactNativeWebView.postMessage(JSON.stringify({ date, items, name: txtTopo.innerText.trim(), totalPrice: txtMax.innerText.trim() }));
        obs.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  })();
  true;
`;

export default Index;

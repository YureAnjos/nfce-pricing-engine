import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { IScanData } from "../types/types";

interface ContextType {
  scanData: IScanData | null;
  setScanData: (data: IScanData) => void;
  scannedUrl: string | null;
  setScannedUrl: (url: string) => void;
  loading: boolean;
}

const Context = createContext<null | ContextType>(null);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [scanData, setScanData] = useState(null);
  const [scannedUrl, setScannedUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem("scanData");
        if (saved && saved !== undefined) {
          setScanData(JSON.parse(saved));
        }
      } catch (err) {
        console.warn("Erro ao carregar scanData:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Context.Provider value={{ scanData, setScanData, scannedUrl, setScannedUrl, loading }}>
      {children}
    </Context.Provider>
  );
};

const useMainContext = () => {
  const context = useContext(Context);
  if (context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export default useMainContext;

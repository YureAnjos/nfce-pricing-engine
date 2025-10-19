import { createContext, ReactNode, useContext, useState } from "react";
import { IScanData } from "../types/types";

interface ContextType {
  scanData: IScanData | null;
  setScanData: (data: IScanData) => void;
  scannedUrl: string | null;
  setScannedUrl: (url: string) => void;
}

const Context = createContext<null | ContextType>(null);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [scanData, setScanData] = useState(null);
  const [scannedUrl, setScannedUrl] = useState(null);

  return (
    <Context.Provider
      value={{ scanData, setScanData, scannedUrl, setScannedUrl }}
    >
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

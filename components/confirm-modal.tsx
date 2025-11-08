import React from "react";
import { Modal, ModalProps, View } from "react-native";
import useTheme from "../hooks/useTheme";

type Props = ModalProps;

const ConfirmModal = ({ children, ...props }: Props) => {
  const { colors } = useTheme();

  return (
    <Modal {...props}>
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#00000075" }}
      >
        <View style={{ backgroundColor: colors.surface, width: "100%", padding: 20, borderRadius: 16, gap: 16 }}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

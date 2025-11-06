import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useProductItem } from "../hooks/useProductItem";
import useTheme, { ColorScheme } from "../hooks/useTheme";
import { IItem } from "../types/types";
import CurrencyInput from "./currency-input";
import Input from "./input";
import PercentageInput from "./percentage-input";

const ProductItem = ({ data, onChange }: { data: IItem; onChange: (newData: IItem) => void }) => {
  const { states, on, refs, animatedStyles, strs } = useProductItem({ data, onChange });
  const { colors } = useTheme();
  const styles = createProductItemStyles(colors);

  return (
    <View style={{ overflow: "hidden", width: "100%" }}>
      <Pressable onPress={on.containerOpenChanged} style={{ gap: 0, overflow: "hidden" }}>
        <View style={{ flexDirection: "row", gap: 6, justifyContent: "space-between" }}>
          <Text style={[styles.title, { flex: 1 }]} numberOfLines={states.containerOpen ? 10 : 1} ellipsizeMode="tail">
            {data.name}
          </Text>
          <Text
            style={[
              styles.title,
              { flexShrink: 0, fontWeight: "normal" },
              states.containerOpen ? { width: 0, height: 0 } : {},
            ]}
          >
            {strs.unitFinalPriceStr}
          </Text>
        </View>

        <Animated.View style={animatedStyles.containerSubInfoAnimationStyle}>
          <Animated.View
            ref={refs.containerSubInfoRef}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              position: "absolute",
              top: 0,
              width: "100%",
            }}
          >
            <Text style={[styles.text, { opacity: 0.8 }]}>Total: {strs.finalPriceStr}</Text>
            <Text style={[styles.text, { opacity: 0.8 }]}>
              Lucro: {states.profitMargin}% | Desc: {states.discountsPerc}%
            </Text>
          </Animated.View>
        </Animated.View>
      </Pressable>

      <Animated.View style={animatedStyles.containerAnimationStyle}>
        <Animated.View ref={refs.containerRef} style={styles.rowsContainer}>
          <Input label="Quantidade de Unidades:" value={states.unitsStr} onChangeText={on.unitsChanged} />

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <CurrencyInput
              label="Preço de Custo Total (R$):"
              value={Math.round(states.price * 100)}
              onChangeValue={on.priceChanged}
              style={{ width: "auto", flex: 1 }}
            />
            <Text style={[styles.text, { width: 75, textAlign: "center" }]}>{strs.unitPriceStr} / Unidade</Text>
          </View>

          <PercentageInput label="Marge de Lucro (%):" value={states.profitMargin} onChangeValue={on.marginChanged} />

          <View style={{ overflow: "hidden" }}>
            <Pressable style={styles.switchContainer} onPress={on.applyDiscountsChanged}>
              <Switch value={states.applyDiscounts} onValueChange={on.applyDiscountsChanged} />
              <Text style={styles.highlightedText}>Aplicar descontos no custo total</Text>
            </Pressable>

            <Animated.View style={animatedStyles.discountsListAnimationStyle}>
              <Animated.View ref={refs.discountsListRef} style={styles.itemRow}>
                <PercentageInput
                  label="Desconto (%)"
                  value={states.discountsPerc}
                  onChangeValue={on.discountsPercChanged}
                />

                <CurrencyInput
                  label="Desconto (R$)"
                  value={Math.round(states.discounts * 100)}
                  onChangeValue={on.discountsChanged}
                />

                <Text style={styles.text}>Preço com desconto: ({strs.unitPriceDiscountedStr} / unidade)</Text>
              </Animated.View>
            </Animated.View>
          </View>

          <View>
            <Text style={styles.finalPrice}>Preço Final Total: {strs.finalPriceStr}</Text>
            <Text style={styles.finalPrice}>Preço Final por Unidade: {strs.unitFinalPriceStr}</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const createProductItemStyles = (colors: ColorScheme) => {
  return StyleSheet.create({
    rowsContainer: {
      gap: 8,
      position: "absolute",
      top: 0,
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 24,
    },
    text: {
      color: colors.text,
    },
    discountText: {
      color: colors.text,
      fontSize: 12,
    },
    highlightedText: {
      color: colors.text,
      fontWeight: "bold",
    },
    title: {
      color: colors.text,
      fontWeight: "bold",
      fontSize: 18,
      marginBottom: 8,
      // lineHeight: 18,
    },
    finalPrice: {
      width: "100%",
      textAlign: "right",
      color: colors.text,
      fontWeight: "bold",
      fontSize: 18,
      marginTop: 8,
    },
    itemRow: {
      position: "absolute",
      top: 0,
      width: "100%",
      gap: 4,
    },
  });
};

export default ProductItem;

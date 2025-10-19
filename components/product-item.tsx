import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Switch, Text, View } from "react-native";
import { useProductItem } from "../hooks/useProductItem";
import useTheme, { ColorScheme } from "../hooks/useTheme";
import { IItem } from "../types/types";
import { formatBRL } from "../util";
import CurrencyInput from "./currency-input";
import Input from "./input";
import PercentageInput from "./percentage-input";

const ProductItem = ({ data }: { data: IItem }) => {
  const { states, on } = useProductItem({ data });
  const { colors } = useTheme();
  const styles = createProductItemStyles(colors);

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: states.applyDiscounts ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [states.applyDiscounts, animation]);

  const discountsContainerStyle = {
    overflow: "hidden",
    opacity: animation,
    height: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 145],
    }),
  } as unknown as Animated.Value;

  return (
    <View>
      <Text style={styles.title}>{data.name}</Text>

      <View style={styles.rowsContainer}>
        <Input
          label="Quantidade de Unidades:"
          value={states.unitsStr}
          onChangeText={on.unitsChanged}
        />

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
          <Text style={[styles.text, { width: 75, textAlign: "center" }]}>
            {formatBRL(Math.round(states.unitPrice * 100))} / Unidade
          </Text>
        </View>

        <PercentageInput
          label="Marge de Lucro (%):"
          value={states.profitMargin}
          onChangeValue={on.marginChanged}
        />

        <View style={styles.switchContainer}>
          <Switch
            value={states.applyDiscounts}
            onValueChange={on.applyDiscountsChanged}
          />
          <Text style={styles.highlightedText}>
            Aplicar descontos no custo total
          </Text>
        </View>

        <Animated.View style={discountsContainerStyle}>
          <View style={styles.itemRow}>
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

            <Text style={styles.text}>
              Preço com desconto: (
              {formatBRL(Math.round(states.unitPriceDiscounted * 100))} /
              unidade)
            </Text>
          </View>
        </Animated.View>

        <View>
          <Text style={styles.finalPrice}>
            Preço Final Total:{" "}
            {formatBRL(Math.round(states.priceDiscounted * 100))}
          </Text>
          <Text style={styles.finalPrice}>
            Preço Final por Unidade:{" "}
            {formatBRL(Math.round(states.unitFinalPrice * 100))}
          </Text>
        </View>
      </View>
    </View>
  );
};

const createProductItemStyles = (colors: ColorScheme) => {
  return StyleSheet.create({
    rowsContainer: {
      gap: 8,
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
      fontSize: 20,
      marginBottom: 8,
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
      width: "100%",
      gap: 4,
    },
  });
};

export default ProductItem;

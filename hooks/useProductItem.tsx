import { useEffect, useState } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { runOnUISync } from "react-native-worklets";
import { IItem } from "../types/types";
import { formatBRL, toNumber } from "../util";

export const useProductItem = ({ data, onChange }: { data: IItem; onChange: (newData: IItem) => void }) => {
  const [unitsStr, setUnitsStr] = useState(String(data.units));
  const [price, setPrice] = useState(data.price);
  const [profitMargin, setProfitMargin] = useState(data.profitMargin);
  const [applyDiscounts, setApplyDiscount] = useState(data.applyDiscounts);
  const [discounts, setDiscounts] = useState(data.discount);
  const [discountsPerc, setDiscountsPerc] = useState(data.discountPerc);
  const [lastChanged, setLastChanged] = useState<"discounts" | "discountsPerc" | null>(null);

  // updates states when data prop changes
  useEffect(() => {
    setUnitsStr(String(data.units));
    setPrice(data.price);
    setProfitMargin(data.profitMargin);
    setDiscounts(data.discount);
    setDiscountsPerc(data.discountPerc);
  }, [data]);

  useEffect(() => {
    onChange({
      name: data.name,
      units: Math.floor(toNumber(unitsStr)),
      price,
      profitMargin,
      applyDiscounts,
      discount: discounts,
      discountPerc: discountsPerc,
    });
  }, [price, profitMargin, applyDiscounts, discounts, onChange, data.name, data.units, discountsPerc, unitsStr]);

  useEffect(() => {
    if (lastChanged !== "discounts") return;
    if (price <= 0 || discounts <= 0) return setDiscountsPerc(0);

    const newDiscountsPerc = (discounts / price) * 100;
    setDiscountsPerc(newDiscountsPerc);
  }, [price, discounts, lastChanged]);

  useEffect(() => {
    if (lastChanged !== "discountsPerc") return;
    if (price <= 0 || discountsPerc <= 0) return setDiscounts(0);

    const newDiscount = price * (discountsPerc / 100);
    setDiscounts(newDiscount);
  }, [price, discountsPerc, lastChanged]);

  const onUnitsChanged = (text) => setUnitsStr(text);
  const onPriceChanged = (value) => setPrice(value / 100);
  const onMarginChanged = (value) => setProfitMargin(value);
  const onDiscountsChanged = (value) => {
    setDiscounts(value / 100);
    setLastChanged("discounts");
  };
  const onDiscountsPercChanged = (value) => {
    setDiscountsPerc(value);
    setLastChanged("discountsPerc");
  };

  const units = Math.floor(toNumber(unitsStr));
  const unitPrice = price / units;
  const priceDiscounted = price - (applyDiscounts ? discounts : 0);
  const unitPriceDiscounted = priceDiscounted / units;
  const unitFinalPrice = unitPriceDiscounted * (1 + profitMargin / 100);

  const discountsListRef = useAnimatedRef<Animated.View>();
  const discountsListHeightValue = useSharedValue(0);
  const discountsAnimProgress = useDerivedValue(() => (applyDiscounts ? withTiming(1) : withTiming(0)));
  const discountsListAnimationStyle = useAnimatedStyle(() => ({
    height: interpolate(discountsAnimProgress.value, [0, 1], [0, discountsListHeightValue.value], Extrapolation.CLAMP),
  }));

  const containerRef = useAnimatedRef<Animated.View>();
  const containerSubInfoRef = useAnimatedRef<Animated.View>();
  const _containerHeightValue = useSharedValue(0);
  const containerHeightValue = useDerivedValue(
    () => _containerHeightValue.value + (applyDiscounts ? discountsListHeightValue.value : 0)
  );
  const containerSubInfoHeightValue = useSharedValue(18.6666); // estimated size, used because this is open by default

  const [containerOpen, setContainerOpen] = useState(false);
  const containerAnimProgress = useDerivedValue(() => (containerOpen ? withTiming(1) : withTiming(0)));
  const containerAnimationStyle = useAnimatedStyle(() => ({
    height: interpolate(containerAnimProgress.value, [0, 1], [0, containerHeightValue.value], Extrapolation.CLAMP),
  }));
  const containerSubInfoAnimationStyle = useAnimatedStyle(() => ({
    height: interpolate(
      1 - containerAnimProgress.value,
      [0, 1],
      [0, containerSubInfoHeightValue.value],
      Extrapolation.CLAMP
    ),
  }));

  const onApplyDiscountsChanged = () => {
    setApplyDiscount((prev) => !prev);
    runOnUISync(() => {
      "worklet";
      discountsListHeightValue.value = measure(discountsListRef).height;
    });
  };

  const onContainerOpenChanged = () => {
    setContainerOpen((prev) => !prev);
    runOnUISync(() => {
      "worklet";
      _containerHeightValue.value = measure(containerRef).height;
      containerSubInfoHeightValue.value = measure(containerSubInfoRef).height;
    });
  };

  const unitPriceStr = formatBRL(Math.round(unitPrice * 100));
  const finalPriceStr = formatBRL(Math.round(priceDiscounted * 100));
  const unitFinalPriceStr = formatBRL(Math.round(unitFinalPrice * 100));
  const unitPriceDiscountedStr = formatBRL(Math.round(unitPriceDiscounted * 100));

  return {
    strs: {
      finalPriceStr,
      unitFinalPriceStr,
      unitPriceDiscountedStr,
      unitPriceStr,
    },
    animatedStyles: {
      discountsListAnimationStyle,
      containerAnimationStyle,
      containerSubInfoAnimationStyle,
    },
    refs: {
      discountsListRef,
      containerRef,
      containerSubInfoRef,
    },
    states: {
      unitsStr,
      price,
      profitMargin,
      applyDiscounts,
      discounts,
      discountsPerc,

      unitPrice,
      unitFinalPrice,
      priceDiscounted,
      unitPriceDiscounted,

      containerOpen,
    },
    on: {
      unitsChanged: onUnitsChanged,
      priceChanged: onPriceChanged,
      marginChanged: onMarginChanged,
      applyDiscountsChanged: onApplyDiscountsChanged,
      discountsChanged: onDiscountsChanged,
      discountsPercChanged: onDiscountsPercChanged,
      containerOpenChanged: onContainerOpenChanged,
    },
  };
};

import { useEffect, useRef, useState } from "react";
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
import { formatBRL, roundCents, toNumber } from "../util";

export const useProductItem = ({ data, onChange }: { data: IItem; onChange: (newData: Partial<IItem>) => void }) => {
  const [unitsStr, setUnitsStr] = useState(String(data.units) ?? "0");
  const [price, setPrice] = useState(data.price ?? 0);
  const [profitMargin, setProfitMargin] = useState(data.profitMargin ?? 0);
  const [applyDiscounts, setApplyDiscount] = useState(data.applyDiscounts ?? false);
  const [discounts, setDiscounts] = useState(data.discount ?? 0);
  const [discountsPerc, setDiscountsPerc] = useState(data.discountPerc ?? 0);
  const [useCustomFinalPrice, setUseCustomFinalPrice] = useState(data.useCustomFinalPrice ?? false);
  const [customFinalPrice, setCustomFinalPrice] = useState(data.customFinalPrice ?? 0);
  const [useRounding, setUseRounding] = useState(data.useRounding ?? true);
  const [roundingSteps, setRoundingSteps] = useState(data.roundingSteps ?? 5);
  const [roundingDirection, setRoundingDirection] = useState(data.roundingDirection ?? "up");
  const [lastChanged, setLastChanged] = useState<"discounts" | "discountsPerc" | null>(null);

  const fiveCentsCheckboxRef = useRef(null);
  const tenCentsCheckboxRef = useRef(null);
  const upDirCheckboxRef = useRef(null);
  const downDirCheckboxRef = useRef(null);

  // updates states when data prop changes
  useEffect(() => {
    setUnitsStr(String(data.units) ?? "0");
    setPrice(data.price ?? 0);
    setProfitMargin(data.profitMargin ?? 0);
    setDiscounts(data.discount ?? 0);
    setDiscountsPerc(data.discountPerc ?? 0);
    setUseCustomFinalPrice(data.useCustomFinalPrice ?? false);
    setCustomFinalPrice(data.customFinalPrice ?? 0);
    setUseRounding(data.useRounding ?? true);
    setRoundingSteps(data.roundingSteps ?? 5);
    setRoundingDirection(data.roundingDirection ?? "up");
  }, [data]);

  useEffect(() => {
    if (lastChanged !== "discounts") return;
    if (price <= 0 || discounts <= 0) return setDiscountsPerc(0);

    const newDiscountsPerc = (discounts / price) * 100;
    setDiscountsPerc(newDiscountsPerc);
    onChange({ discountPerc: newDiscountsPerc });
  }, [price, discounts, lastChanged, onChange]);

  useEffect(() => {
    if (lastChanged !== "discountsPerc") return;
    if (price <= 0 || discountsPerc <= 0) return setDiscounts(0);

    const newDiscount = price * (discountsPerc / 100);
    setDiscounts(newDiscount);
    onChange({ discount: newDiscount });
  }, [price, discountsPerc, lastChanged, onChange]);

  // Actions (on)
  const onUnitsChanged = (text) => {
    setUnitsStr(text);
    onChange({ units: Math.floor(toNumber(text)) });
  };
  const onPriceChanged = (value) => {
    setPrice(value / 100);
    onChange({ price: value / 100 });
  };
  const onMarginChanged = (value) => setProfitMargin(value);
  const onDiscountsChanged = (value) => {
    setDiscounts(value / 100);
    setLastChanged("discounts");
    onChange({ discount: value / 100 });
  };
  const onDiscountsPercChanged = (value) => {
    setDiscountsPerc(value);
    setLastChanged("discountsPerc");
    onChange({ discountPerc: value });
  };
  const onCustomFinalPriceChanged = (value) => {
    setCustomFinalPrice(value / 100);
    onChange({ customFinalPrice: value / 100 });
  };
  const onFiveCentsPressed = () => {
    if (useCustomFinalPrice) return;
    setRoundingSteps(5);
    onChange({ roundingSteps: 5 });
  };
  const onTenCentsPressed = () => {
    if (useCustomFinalPrice) return;
    setRoundingSteps(10);
    onChange({ roundingSteps: 10 });
  };
  const onUpDirPressed = () => {
    if (useCustomFinalPrice) return;
    setRoundingDirection("up");
    onChange({ roundingDirection: "up" });
  };
  const onDownDirPressed = () => {
    if (useCustomFinalPrice) return;
    setRoundingDirection("down");
    onChange({ roundingDirection: "down" });
  };

  const units = Math.floor(toNumber(unitsStr));
  const unitPrice = price / units;
  let priceDiscounted = price - (applyDiscounts ? discounts : 0);
  const unitPriceDiscounted = priceDiscounted / units;
  let unitFinalPrice = unitPriceDiscounted * (1 + profitMargin / 100);
  if (useCustomFinalPrice) {
    unitFinalPrice = customFinalPrice;
  }

  let unitFinalPriceRounded = unitFinalPrice;
  if (useRounding) {
    unitFinalPriceRounded = roundCents(unitFinalPrice, roundingSteps, roundingDirection);
  }

  const discountsListRef = useAnimatedRef<Animated.View>();
  const discountsListHeightValue = useSharedValue(0);
  const discountsAnimProgress = useDerivedValue(() => (applyDiscounts ? withTiming(1) : withTiming(0)));
  const discountsListAnimationStyle = useAnimatedStyle(() => ({
    height: interpolate(discountsAnimProgress.value, [0, 1], [0, discountsListHeightValue.value], Extrapolation.CLAMP),
  }));

  const roundingRef = useAnimatedRef<Animated.View>();
  const roundingHeightValue = useSharedValue(0);
  const roundingAnimProgress = useDerivedValue(() => (useRounding ? withTiming(1) : withTiming(0)));
  const roundingAnimationStyle = useAnimatedStyle(() => ({
    height: interpolate(roundingAnimProgress.value, [0, 1], [0, roundingHeightValue.value], Extrapolation.CLAMP),
  }));

  const customPriceRef = useAnimatedRef<Animated.View>();
  const customPriceHeightValue = useSharedValue(0);
  const customPriceAnimProgress = useDerivedValue(() => (useCustomFinalPrice ? withTiming(1) : withTiming(0)));
  const customPriceAnimationStyle = useAnimatedStyle(() => ({
    height: interpolate(customPriceAnimProgress.value, [0, 1], [0, customPriceHeightValue.value], Extrapolation.CLAMP),
  }));

  const containerRef = useAnimatedRef<Animated.View>();
  const containerSubInfoRef = useAnimatedRef<Animated.View>();
  const _containerHeightValue = useSharedValue(0);
  const containerHeightValue = useDerivedValue(
    () =>
      _containerHeightValue.value +
      (applyDiscounts ? discountsListHeightValue.value : 0) +
      (useCustomFinalPrice ? customPriceHeightValue.value : 0) +
      (useRounding ? roundingHeightValue.value : 0)
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
    if (useCustomFinalPrice) return;

    setApplyDiscount((prev) => !prev);
    runOnUISync(() => {
      "worklet";
      discountsListHeightValue.value = measure(discountsListRef).height;
    });
    onChange({ applyDiscounts: !applyDiscounts });
  };

  const onUseRoundingChanged = () => {
    if (useCustomFinalPrice) return;

    setUseRounding((prev) => !prev);
    runOnUISync(() => {
      "worklet";
      roundingHeightValue.value = measure(roundingRef).height;
    });
    onChange({ useRounding: !useRounding });
  };

  const onContainerOpenChanged = () => {
    setContainerOpen((prev) => !prev);

    // measure only the first time
    if (_containerHeightValue.value === 0) {
      runOnUISync(() => {
        "worklet";
        _containerHeightValue.value = measure(containerRef).height;
        containerSubInfoHeightValue.value = measure(containerSubInfoRef).height;

        // needs a first time calculation when value is true by default
        discountsListHeightValue.value = measure(discountsListRef).height;
        customPriceHeightValue.value = measure(customPriceRef).height;
        roundingHeightValue.value = measure(roundingRef).height;
      });
    }
  };

  const onUseCustomFinalPriceChanged = () => {
    setCustomFinalPrice(useRounding ? unitFinalPriceRounded : unitFinalPrice);
    setUseCustomFinalPrice((prev) => !prev);
    runOnUISync(() => {
      "worklet";
      customPriceHeightValue.value = measure(customPriceRef).height;
    });
    onChange({ useCustomFinalPrice: !useCustomFinalPrice });
  };

  const unitPriceStr = formatBRL(Math.round(unitPrice * 100));
  const finalPriceStr = formatBRL(Math.round(priceDiscounted * 100));
  const unitPriceDiscountedStr = formatBRL(Math.round(unitPriceDiscounted * 100));
  const unitFinalPriceStr = formatBRL(Math.round(unitFinalPrice * 100));
  const unitFinalPriceRoundedStr = formatBRL(unitFinalPriceRounded * 100);

  return {
    strs: {
      finalPriceStr,
      unitFinalPriceStr,
      unitPriceDiscountedStr,
      unitPriceStr,
      unitFinalPriceRoundedStr,
    },
    animatedStyles: {
      discountsListAnimationStyle,
      containerAnimationStyle,
      containerSubInfoAnimationStyle,
      customPriceAnimationStyle,
      roundingAnimationStyle,
    },
    refs: {
      discountsListRef,
      containerRef,
      containerSubInfoRef,
      customPriceRef,
      roundingRef,
      fiveCentsCheckboxRef,
      tenCentsCheckboxRef,
      upDirCheckboxRef,
      downDirCheckboxRef,
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

      useCustomFinalPrice,
      customFinalPrice,

      useRounding,
      roundingSteps,
      roundingDirection,
    },
    on: {
      unitsChanged: onUnitsChanged,
      priceChanged: onPriceChanged,
      marginChanged: onMarginChanged,
      applyDiscountsChanged: onApplyDiscountsChanged,
      discountsChanged: onDiscountsChanged,
      discountsPercChanged: onDiscountsPercChanged,
      containerOpenChanged: onContainerOpenChanged,
      customFinalPriceChanged: onCustomFinalPriceChanged,
      useCustomFinalPriceChanged: onUseCustomFinalPriceChanged,
      useRoundingChanged: onUseRoundingChanged,
      fiveCentsPressed: onFiveCentsPressed,
      tenCentsPressed: onTenCentsPressed,
      upDirPressed: onUpDirPressed,
      downDirPressed: onDownDirPressed,
    },
  };
};

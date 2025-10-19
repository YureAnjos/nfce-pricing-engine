import { useEffect, useState } from "react";
import { IItem } from "../types/types";
import { toNumber } from "../util";

export const useProductItem = ({ data }: { data: IItem }) => {
  const [unitsStr, setUnitsStr] = useState(String(data.units));
  const [price, setPrice] = useState(data.price);
  const [profitMargin, setProfitMargin] = useState(data.profitMargin);
  const [applyDiscounts, setApplyDiscount] = useState(data.applyDiscounts);
  const [discounts, setDiscounts] = useState(data.discount);
  const [discountsPerc, setDiscountsPerc] = useState(data.discountPerc);
  const [lastChanged, setLastChanged] = useState<
    "discounts" | "discountsPerc" | null
  >(null);

  // updates states when data prop changes
  useEffect(() => {
    setUnitsStr(String(data.units));
    setPrice(data.price);
    setProfitMargin(data.profitMargin);
    setDiscounts(data.discount);
    setDiscountsPerc(data.discountPerc);
  }, [data]);

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
  const onApplyDiscountsChanged = () => setApplyDiscount((prev) => !prev);
  const onDiscountsChanged = (value) => {
    setDiscounts(value / 100);
    setLastChanged("discounts");
  };
  const onDiscountsPercChanged = (value) => {
    setDiscountsPerc(value);
    setLastChanged("discountsPerc");
  };

  const units = toNumber(unitsStr);
  const unitPrice = price / units;
  const priceDiscounted = price - (applyDiscounts ? discounts : 0);
  const unitPriceDiscounted = priceDiscounted / units;
  const unitFinalPrice = unitPriceDiscounted * (1 + profitMargin / 100);

  return {
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
    },
    on: {
      unitsChanged: onUnitsChanged,
      priceChanged: onPriceChanged,
      marginChanged: onMarginChanged,
      applyDiscountsChanged: onApplyDiscountsChanged,
      discountsChanged: onDiscountsChanged,
      discountsPercChanged: onDiscountsPercChanged,
    },
  };
};

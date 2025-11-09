import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const itemFields = {
  name: v.string(),
  units: v.number(),
  price: v.number(),
  profitMargin: v.number(),
  applyDiscounts: v.boolean(),
  discount: v.number(),
  discountPerc: v.number(),
  useCustomFinalPrice: v.optional(v.boolean()),
  customFinalPrice: v.optional(v.number()),
  useRounding: v.optional(v.boolean()),
  roundingSteps: v.optional(v.number()),
  roundingDirection: v.optional(v.string()),
};

export const noteFields = {
  items: v.array(v.object(itemFields)),
  name: v.string(),
  date: v.string(),
  totalPrice: v.string(),
  url: v.string(),
};

export default defineSchema({
  notes: defineTable(noteFields).index("by_url", ["url"]),
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { noteFields } from "./schema";

export const getNotes = query({
  args: {},
  handler: async (ctx) => {
    const notes = await ctx.db.query("notes").collect();
    return notes.map(({ _id, _creationTime, ...rest }) => rest);
  },
});

export const saveNote = mutation({
  args: v.object(noteFields),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("notes")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("notes", args);
    }
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const AddNotes = mutation({
  args: {
    fileId: v.string(),
    notes: v.any(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();

    if (record?.length == 0) {
      await ctx.db.insert("notes", {
        fileId: args.fileId,
        notes: args.notes,
        createdBy: args.createdBy,
      });
    } else {
      await ctx.db.patch(record[0]._id, { notes: args.notes });
    }
  },
});

export const GetAllNotes = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();
    return result[0]?.notes;
  },
});

export const updateNotes = mutation({
  args: {
    fileId: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();

    const note = result[0];
    if (!note) throw new Error("Note not found for the given fileId");

    await ctx.db.patch(note._id, {
      notes: args.notes,
    });
  },
});

export const deleteNotes = mutation({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();

    const note = result[0];
    if (!note) throw new Error("Note not found for the given fileId");

    await ctx.db.delete(note._id);
  },
});

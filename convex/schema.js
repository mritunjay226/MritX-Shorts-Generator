import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    pictureUrl: v.string(),
    credits: v.number(),
    createdAt: v.optional(v.string())
  })
    .index("by_clerkId", ["clerkId"]) // ✅ Added index
    .index("by_email", ["email"]),     // (optional but useful)

  videoData: defineTable({
    title: v.string(),
    topic: v.string(),
    script: v.string(),
    videoStyle: v.string(),
    caption: v.any(),
    voice: v.string(),
    bgMusic: v.optional(v.any()),
    images: v.optional(v.any()),
    audioUrl: v.optional(v.string()),
    captionJson: v.optional(v.any()),
    uid: v.id("users"),
    createdBy: v.string(),
    status: v.optional(v.string()),
    downloadUrl: v.optional(v.string())
  })
    .index("by_uid", ["uid"])
    .index("by_createdBy", ["createdBy"])
});

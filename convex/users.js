import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateNewUser = mutation({
  args: v.object({
    clerkId: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    pictureUrl: v.optional(v.string()),
  }),

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const clerkId = args.clerkId || identity.subject;

    // 1️⃣ Find existing by clerkId
    const existingByClerk = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existingByClerk) return existingByClerk;

    // 2️⃣ Find existing by email
    const existingByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingByEmail) {
      // attach clerkId if missing
      if (!existingByEmail.clerkId) {
        await ctx.db.patch(existingByEmail._id, { clerkId });
      }
      return existingByEmail;
    }

    // 3️⃣ Create new user (first time login)
    const newUser = {
      clerkId,
      name: args.name,
      email: args.email,
      pictureUrl: args.pictureUrl || "",
      credits: 5,
      createdAt: new Date().toISOString(),
    };

    const userId = await ctx.db.insert("users", newUser);
    return { _id: userId, ...newUser };
  },
});

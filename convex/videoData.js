import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateVideoData = mutation({
  args: {
    title: v.string(),
    topic: v.string(),
    script: v.string(),
    videoStyle: v.string(),
    caption: v.any(),
    voice: v.string(),
    bgMusic: v.optional(v.object({ name: v.string(), src: v.string() })),
    uid: v.id('users'),
    createdBy: v.string(),
    credits: v.number()
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert('videoData', {
      title: args.title,
      topic: args.topic,
      script: args.script,
      videoStyle: args.videoStyle,
      caption: args.caption,
      voice: args.voice,
      bgMusic: args.bgMusic,
      uid: args.uid,
      createdBy: args.createdBy,
      status: "pending",
    });

    await ctx.db.patch(args.uid, {
      credits: (args.credits || 0) - 1
    });

    return result;
  }
});

export const UpdateVideoRecord = mutation({
  args: {
    recordId: v.id('videoData'),
    audioUrl: v.string(),
    images: v.any(),
    captionJson: v.any(),
    downloadUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.recordId, {
      audioUrl: args.audioUrl,
      captionJson: args.captionJson,
      images: args.images,
      status: "completed"
    });
    return result;
  }
});

// FIXED: Added pagination with .take() to limit results - optimized for fast loading
export const GetUserVideos = query({
  args: {
    uid: v.id('users'),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    // Reduced to 15 videos max, safe limit to stay under 16MB and load fast
    const limit = Math.min(args.limit || 15, 15);
    
    const result = await ctx.db.query('videoData')
      .filter(q => q.eq(q.field('uid'), args.uid))
      .order('desc')
      .take(limit); // Fetch only 15 videos at a time

    return result;
  }
});

export const GetVideoById = query({
  args: {
    videoId: v.id('videoData')
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.videoId);
    return result;
  }
});

export const EditVideoData = mutation({
  args: {
    videoId: v.id("videoData"),
    title: v.optional(v.string()),
    bgMusic: v.optional(v.object({ name: v.string(), src: v.string() })),
    images: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { videoId, title, bgMusic, images } = args;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (bgMusic !== undefined) updateFields.bgMusic = bgMusic;
    if (images !== undefined) updateFields.images = images;

    await ctx.db.patch(videoId, updateFields);
    return { success: true, message: "Video updated successfully" };
  },
});

export const RemoveMultipleVideos = mutation(async ({ db }, { videoIds }) => {
  for (const id of videoIds) {
    await db.delete(id);
  }
  return { success: true };
});

// Proper cursor-based pagination for efficient loading
export const GetUserVideosPaginated = query({
  args: {
    uid: v.id("users"),
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null())
    })
  },
  handler: async (ctx, args) => {
    // Ensure numItems doesn't exceed safe limits
    const safeNumItems = Math.min(args.paginationOpts.numItems, 20);
    
    const result = await ctx.db
      .query("videoData")
      .filter(q => q.eq(q.field("uid"), args.uid))
      .order("desc")
      .paginate({
        numItems: safeNumItems,
        cursor: args.paginationOpts.cursor
      });

    return result;
  },
});

export const UpdateDownloadUrl = mutation({
  args: {
    recordId: v.id("videoData"),
    downloadUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.recordId, {
      downloadUrl: args.downloadUrl,
    });
    
    return { success: true, recordId: args.recordId };
  },
});
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
    bgMusic: v.optional(v.object({ name: v.string(), src: v.string() })), // structured
    uid: v.id('users'),
    createdBy: v.string(),
    credits: v.number() // only used to update user credits, not stored in videoData
  },
  handler: async (ctx, args) => {
    // Insert video record
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

    // Deduct credits from user
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
        return result
    }
})

export const GetUserVideos = query({
    args: {
        uid: v.id('users')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('videoData')
            .filter(q => q.eq(q.field('uid'), args.uid))
            .order('desc')
            .collect();

        return result
    }
})

export const GetVideoById = query({
    args: {
        videoId: v.id('videoData')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.get(args.videoId);
        return result;
    }
})


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

export const GetUserVideosPaginated = query({
  args: {
    uid: v.id("users"),
    skip: v.optional(v.number()), // number of items to skip
    limit: v.optional(v.number()), // number of items to fetch
  },
  handler: async (ctx, args) => {
    const skip = args.skip || 0;
    const limit = args.limit || 6;

    const allVideos = await ctx.db
      .query("videoData")
      .filter(q => q.eq(q.field("uid"), args.uid))
      .order("desc")
      .collect();

    // simulate pagination
    const paginated = allVideos.slice(skip, skip + limit);
    const hasMore = skip + limit < allVideos.length;

    return { videos: paginated, hasMore };
  },
});



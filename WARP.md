# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development commands

### Next.js app (primary UI)
- Install dependencies (uses `package-lock.json`):
  - `npm install`
- Run the dev server (Next.js App Router, served on http://localhost:3000):
  - `npm run dev`
- Production build (Next 16 with custom Remotion-related webpack externals in `next.config.mjs`):
  - `npm run build`
- Start production server (after `npm run build`):
  - `npm start`
- Lint (Next.js ESLint integration):
  - `npm run lint`

> There is currently no test script configured in `package.json`; add one (e.g. Jest/Playwright) before expecting `npm test` or per-file test commands to work.

### Python video renderer service (`video-renderer`)
This service is a separate Flask + FFmpeg backend that the Inngest pipeline calls (deployed to Cloud Run in production).

Local (Python) run:
- `cd video-renderer`
- `pip install -r requirements.txt`
- `python server.py`
  - Binds to `0.0.0.0:${PORT:-8080}`; expect `http://localhost:8080/` to return a health-check string.

Docker build/run (mirrors the Cloud Run image):
- Build: `docker build -t video-renderer ./video-renderer`
- Run: `docker run -p 8080:8080 video-renderer`

> The main app’s Inngest function currently calls a hard-coded Cloud Run URL for `/render`. For local end-to-end testing against this service, temporarily point that URL in `src/inngest/functions.js` to your local `http://localhost:8080/render`.

## Architecture overview

### High-level system
- **Next.js 16 app (React 19, App Router)** in `src/app` renders both the public marketing/landing experience and the authenticated dashboard for managing AI-generated short videos.
- **Authentication and session-aware data access** use Clerk on the frontend (`@clerk/nextjs`) and Convex on the backend (`convex/`), wired together via `ConvexProviderWithClerk`.
- **Persistence** of users and video metadata lives in Convex (`convex/schema.js`, `convex/users.js`, `convex/videoData.js`).
- **Async generation workflows** are modeled as Inngest functions in `src/inngest`, triggered via Next.js API routes under `src/app/api`.
- **Video rendering backends** exist in two flavors:
  - Remotion-based composition (for preview / legacy rendering), using `src/remotion` and `@remotion/renderer`.
  - A dedicated FFmpeg-based renderer service (`video-renderer/server.py`) that runs on Cloud Run and returns base64-encoded MP4s.

### Routing, auth, and layout
- **Root layout**: `src/app/layout.js`
  - Wraps the app in `ClerkProvider`, `ConvexClientProvider`, and the `sonner` toast `Toaster`.
  - Sets global fonts and metadata (title, favicon).
- **Public marketing page**: `src/app/page.js`
  - Landing and marketing UI wired to components in `src/components` (Hero, Features, ShortsGen, FAQs, etc.).
- **Authenticated dashboard section**: `src/app/(main)`
  - `src/app/(main)/layout.jsx` wraps dashboard routes in `DashboardProvider`.
  - `src/app/(main)/provider.jsx`:
    - Reads auth state from an app-level provider (`src/app/provider.js` via `useAuthContext`).
    - Redirects unauthenticated users back to `/` using `next/navigation`.
    - Wraps its children in the sidebar layout from `@/components/ui/sidebar` plus `AppSidebar` and `AppHeader`.
  - Feature routes under `(main)` include creating new videos (image-based and clip-based flows), dashboards, explore, and a `play-video/[videoId]` area with a full editor (`VideoEditor`, `ImageListEditor`, `MusicSelector`, and Remotion player).
- **Middleware / route protection**: `src/proxy.js`
  - Uses `clerkMiddleware` with a route matcher to treat `/`, `/sign-in*`, `/sign-up*`, and `/api/*` as public.
  - All other routes require authentication (`auth.protect()`), ensuring dashboard and video management routes are gated.

### Data model and Convex integration
- **Schema definition**: `convex/schema.js`
  - `users` table: tracks Clerk-linked users with `clerkId`, `name`, `email`, `pictureUrl`, `credits`, and `createdAt`. Indexed by `clerkId` and `email` for quick lookup / dedup.
  - `videoData` table: holds each generated video’s core metadata:
    - Prompting and rendering fields like `title`, `topic`, `script`, `videoStyle`, `caption`, `voice`, `bgMusic`, `images`, `audioUrl`, `captionJson`, `status`, and `downloadUrl`.
    - A relational `uid` back to `users` and a `createdBy` identifier. Indexed by `uid` and `createdBy`.
- **User lifecycle**: `convex/users.js`
  - `CreateNewUser` mutation uses `ctx.auth.getUserIdentity()` from Clerk to:
    - Lookup by `clerkId` or `email`, reusing and patching existing records when possible.
    - Create a new `users` record with initial credits (5) and `createdAt` timestamp if none exist.
- **Video lifecycle**: `convex/videoData.js`
  - `CreateVideoData`: inserts a new `videoData` record with status `pending` and decrements the user’s `credits` in `users` by one.
  - `UpdateVideoRecord`: fills in `audioUrl`, `images`, and `captionJson` once generation completes.
  - `GetUserVideos` / `GetUserVideosPaginated`: query helpers for dashboard listings.
  - `GetVideoById`: fetches a single video by ID.
  - `EditVideoData`: updates key editable fields such as `title`, `bgMusic`, and `images` from the dashboard UI (`VideoEditor.jsx`).
  - `RemoveMultipleVideos`: batch delete.
  - `UpdateDownloadUrl`: dedicated mutation for attaching a final rendered video URL (e.g. from Cloudinary) to a `videoData` record.

### Async workflows with Inngest

#### Client → Inngest entry
- `src/app/api/generate-video-data/route.jsx`:
  - Accepts a POST JSON payload from the UI.
  - Forwards it to Inngest by sending an event named `generate-video-data` through the `inngest` client (`src/inngest/client.js`).
- `src/app/api/inngest/route.jsx`:
  - Uses `serve` from `inngest/next` to expose Inngest functions over a Next.js API route.
  - Registers the `GenerateVideoData` function so Inngest’s event processing can call back into this handler.

#### GenerateVideoData pipeline (`src/inngest/functions.js`)
The core short-video pipeline is implemented as a single Inngest function with multiple `step.run` phases:

1. **TTS generation (Cartesia)**
   - Calls `https://api.cartesia.ai/tts/bytes` with the chosen `voice` and full script.
   - Returns an `audio/mp3` payload encoded as a base64 `data:` URL string (`GenerateAudioFile`).
2. **Caption transcript (Deepgram)**
   - Uses `@deepgram/sdk` and `listen.prerecorded.transcribeFile` to transcribe the generated audio.
   - Extracts `words` (with `start`/`end` timestamps) into `GenerateCaptions` for time-aligned subtitles.
3. **Image prompt generation (Gemini)**
   - Uses the `generateImagePrompt` chat session from `src/configs/AiModel.jsx` with a templated `ImagePromptScript` that includes `{style}` and `{script}`.
   - Expects a JSON array of `{ imagePrompt, sceneContent }`-like objects parsed from the Gemini response.
4. **Image generation (Aigurulab)**
   - For each prompt, calls `https://aigurulab.tech/api/generate-image` with a 1024×1024 SDXL model, returning base64-encoded images.
5. **Persist intermediate assets**
   - Uses `ConvexHttpClient` (`NEXT_PUBLIC_CONVEX_URL`) to call `api.videoData.UpdateVideoRecord`, storing `audioUrl`, `captionJson`, and `images` back into the existing `videoData` row referenced by `recordId`.
6. **Duration calculation**
   - Computes `totalAudioDuration` from the last caption’s `end` time.
   - Derives a uniform `imageDurations` array matching the number of images so FFmpeg has consistent timing per image.
7. **Cloud Run video rendering**
   - Builds a payload for the external renderer:
     - `audioUrl` (base64 `data:` URI), `images` (base64 strings), `durations`, time-coded `captions`, and optional `watermarkUrl`.
   - POSTs this payload to the Cloud Run URL for the Python `video-renderer` service.
   - Expects a JSON response with a `videoBase64` MP4, converts it to a buffer, and uploads it to Cloudinary (`src/lib/cloudinary.js`) as a `video` resource.
8. **Attach final download URL**
   - Calls `api.videoData.UpdateDownloadUrl` via Convex to persist the Cloudinary `secure_url` as `downloadUrl` on the `videoData` record.

The end result is a fully rendered video per `videoData` row, with audio, captions, frame sequence, and a final downloadable URL tied together through Convex.

#### Character-based pipeline (`src/inngest/GenerateCharacterVideo.js`)
- Defines a separate Inngest function `GenerateCharacterVideo` for character-centric shorts:
  1. Fetches character metadata from Convex (`api.characters.getById`) for appearance consistency.
  2. Uses Gemini (via the public Generative Language REST API) to generate three JSON-formatted script options (each with three scenes).
  3. Saves the chosen script back to Convex (`UpdateVideoRecord`).
  4. Calls an Aigurulab-style image endpoint with a `referenceImage` to generate stylistically consistent frames.
  5. Optionally generates per-scene narration via Cartesia, writing MP3s to `/tmp`.
  6. Animates images into short clips via a `deAPI`-style proxy (`/api/v1/client/img2video`).
  7. Concatenates the resulting clips (and optional narration) using local FFmpeg (`child_process.execSync`).
  8. Writes a final MP4 under `/tmp` and records a (currently mock) video URL back into Convex.

This function is more experimental/custom and tightly coupled to the deployment environment’s FFmpeg and filesystem (`/tmp`).

### Video rendering backends

#### Remotion-based rendering
- **Composition root**: `src/remotion/Root.jsx`
  - Exports `RemotionRoot`, registered via `src/remotion/index.js` (`registerRoot(RemotionRoot)`).
  - If `videoData.captionJson` exists, infers `durationInFrames` using the last caption `end` time × a fixed FPS (30).
  - Declares a `Composition` with ID `FinalVideo`, width `720`, height `1280`, and `defaultProps={{ videoData }}` using `RemotionComposition` from `src/components/RemotionComposition.jsx`.
- **Server-side renderer (legacy/alternate path)**: `src/app/api/render-video/route.js`
  - Uses `@remotion/renderer`’s `renderMedia` API with `serveUrl: 'http://localhost:3000/remotion'` and `composition: 'RemotionComposition'`.
  - Writes an MP4 to a temp path, then uploads it to Supabase Storage (`temp-videos` bucket) using the service role key, producing a short-lived public URL.
  - Schedules deletion of both Supabase object and local file after ~10 seconds.

Remotion is thus used both for interactive previewing (via the `RemotionPlayer` component in the dashboard) and as a potential alternative rendering backend via `@remotion/renderer` and Supabase.

#### Python + FFmpeg renderer (`video-renderer/server.py`)
- Exposed `/render` endpoint (Flask):
  - Accepts JSON with:
    - `images`: list of image URLs (or base64-backed URLs that the service downloads).
    - `audioUrl`: primary narration audio, either as URL or base64 `data:` URI.
    - `bgMusicUrl` (optional): secondary background music track.
    - `durations`: per-image durations (must match `images.length`).
    - `captions`: array of `{ word, start, end }` for ASS subtitles.
    - `watermarkUrl` (optional).
    - `caption`: object that can name a style preset (e.g. `{ name: "Youtuber" }`).
    - `captionStyle`: overrides for ASS caption style fields (font size, colors, outline, etc.).
- Internals:
  - Downloads/decodes audio, BGM, image, and watermark assets into `/tmp`.
  - For each image, applies:
    - Aspect-preserving scale and crop into a 720×1280 frame.
    - A `zoompan` effect (alternating zoom-in/zoom-out patterns) at 60 FPS.
  - Chains those image segments with `xfade` transitions for smooth crossfades.
  - Optionally overlays a PNG watermark in the bottom-right corner.
  - Generates an ASS subtitle file with per-word timing and tailwind-like style presets (`Youtuber`, `Supreme`, `Neon`, `Glitch`, `Fire`, `Futuristic`, `Default`), then overlays it via `subtitles=...:force_style=...`.
  - Mixes narration and optional BGM with volume balancing in `filter_complex`.
  - Encodes the final video using `libx264` at high quality (CRF≈17, `preset=slow`) and AAC audio.
  - Returns a base64-encoded MP4 (`videoBase64`) and cleans up temp files.

This service is intended to run in a containerized environment (Cloud Run) and is the default renderer used by the Inngest `GenerateVideoData` workflow.

### Key environment variables (non-exhaustive)
These environment variables are referenced directly in the codebase and must be configured for full functionality. Values should be provided via `.env` or platform-specific secret management, not committed to source control.

- **Auth & Convex**
  - `NEXT_PUBLIC_CONVEX_URL` — Convex deployment URL for both browser and server-side clients.
  - `CLERK_JWT_ISSUER_DOMAIN` — Clerk issuer for Convex auth (`convex/auth.config.js`).
- **Clerk frontend** (standard Next.js Clerk variables, not all shown in code but required by `@clerk/nextjs`).
- **Gemini / Google Generative AI**
  - `NEXT_PUBLIC_GEMINI_API_KEY` — used in `src/configs/AiModel.jsx` for the `GoogleGenerativeAI` client.
  - `GEMINI_API_KEY` — used in the character-based Inngest pipeline (`GenerateCharacterVideo`).
- **AIGuru / image generation**
  - `NEXT_PUBLIC_AIGURU_API_KEY` — API key for `https://aigurulab.tech/api/generate-image`.
- **Deepgram**
  - `NEXT_PUBLIC_DEEPGRAM_API_KEY` — transcription API key for caption generation.
- **Cartesia TTS**
  - `CARTESIA_API_KEY` — TTS key for both the primary and character-based pipelines.
- **Cloudinary**
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary config in `src/lib/cloudinary.js` for uploaded video storage.
- **Supabase (Remotion-based route only)**
  - `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — used in `src/app/api/render-video/route.js` to upload and later delete rendered videos in the `temp-videos` bucket.
- **Video renderer service**
  - `PORT` — used by `video-renderer/server.py` to determine the listen port (defaults to 8080 on Cloud Run).

Future Warp agents should ensure the relevant subsets of these variables are set before attempting full end-to-end video generation or rendering flows.

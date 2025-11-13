import { GenerateCharacterVideo } from "@/inngest/GenerateCharacterVideo";
import { serve } from "inngest/next";

// You can import more Inngest functions here later if you add new pipelines
// e.g. import { GenerateClassicShort } from "@/inngest/functions/GenerateClassicShort";

export const { GET, POST, PUT } = serve({
  client: {
    name: "Baan AI Shorts",
  },
  functions: [GenerateCharacterVideo],
});

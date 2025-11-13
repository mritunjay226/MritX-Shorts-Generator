import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { renderMedia } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // needs delete permission
);

export async function POST(req) {
  try {
    const data = await req.json();
    const { videoData } = data;
    const tempId = uuidv4();

    // 1️⃣ Render the video locally
    const outputPath = path.join(process.cwd(), `temp_${tempId}.mp4`);
    await renderMedia({
      composition: 'RemotionComposition',
      serveUrl: 'http://localhost:3000/remotion', // adjust if needed
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: { videoData },
    });

    // 2️⃣ Upload to Supabase
    const fileBuffer = fs.readFileSync(outputPath);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('temp-videos')
      .upload(`temp/${tempId}.mp4`, fileBuffer, {
        contentType: 'video/mp4',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 3️⃣ Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('temp-videos')
      .getPublicUrl(`temp/${tempId}.mp4`);

    const publicUrl = publicUrlData.publicUrl;

    // 4️⃣ Schedule delete after 10 seconds
    setTimeout(async () => {
      await supabase.storage.from('temp-videos').remove([`temp/${tempId}.mp4`]);
      fs.unlinkSync(outputPath); // remove local file too
    }, 10000);

    // ✅ Return the public download link
    return NextResponse.json({ downloadUrl: publicUrl });
  } catch (error) {
    console.error('Error rendering/uploading:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

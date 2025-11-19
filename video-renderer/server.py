from flask import Flask, request, jsonify
import os
import subprocess
import uuid
import requests
import base64
import re

app = Flask(__name__)

# -----------------------------
# Helper: Download file safely
# -----------------------------
def download_file(url, filename):
    r = requests.get(url, stream=True)
    r.raise_for_status()
    with open(filename, "wb") as f:
        for chunk in r.iter_content(chunk_size=8192):
            f.write(chunk)

# -----------------------------
# Helper: Sanitize text for FFmpeg
# -----------------------------
def sanitize_text_for_ffmpeg(text):
    """Properly escape text for FFmpeg drawtext filter, supporting Unicode"""
    if not text:
        return ""
    # Replace problematic characters
    text = text.replace("\\", "\\\\")  # Escape backslashes
    text = text.replace("'", "'\\\\\\''")  # Escape single quotes
    text = text.replace(":", "\\:")  # Escape colons
    text = text.replace("%", "\\%")  # Escape percent signs
    return text

# -----------------------------
# Main Render Route
# -----------------------------
@app.post("/render")
def render_video():
    try:
        data = request.json
        images = data.get("images", [])
        audio_url = data.get("audioUrl")
        durations = data.get("durations", [])
        captions = data.get("captions", [])
        watermark_url = data.get("watermarkUrl")  # optional

        # -----------------------------
        # Basic validation
        # -----------------------------
        if not images or not audio_url:
            return jsonify({"error": "Missing images or audioUrl"}), 400
        if not durations or len(durations) != len(images):
            return jsonify({"error": "durations array missing or length mismatch with images"}), 400
        if captions is None:
            captions = []

        print("Number of images:", len(images))
        print("Number of captions:", len(captions))
        print("Durations:", durations)

        # -----------------------------
        # Handle audio (base64 or URL)
        # -----------------------------
        audio_file = f"/tmp/audio_{uuid.uuid4()}.mp3"
        if audio_url.startswith("data:audio"):
            header, b64 = audio_url.split(",", 1)
            with open(audio_file, "wb") as f:
                f.write(base64.b64decode(b64))
            print("Audio saved from base64")
        else:
            download_file(audio_url, audio_file)
            print("Audio downloaded from URL")

        # -----------------------------
        # Download images
        # -----------------------------
        image_files = []
        for idx, img_url in enumerate(images):
            filename = f"/tmp/img_{idx}_{uuid.uuid4()}.jpg"
            download_file(img_url, filename)
            image_files.append(filename)
        print("Downloaded images:", image_files)

        # -----------------------------
        # Download watermark (optional)
        # -----------------------------
        watermark_file = None
        if watermark_url:
            watermark_file = f"/tmp/watermark_{uuid.uuid4()}.png"
            download_file(watermark_url, watermark_file)
            print("Downloaded watermark:", watermark_file)

        # -----------------------------
        # Build FFmpeg inputs with durations
        # -----------------------------
        inputs = []
        for img_file, dur in zip(image_files, durations):
            inputs.extend(["-loop", "1", "-t", str(dur), "-i", img_file])
        if watermark_file:
            inputs.extend(["-i", watermark_file])

        # -----------------------------
        # Build dynamic zoompan effects with transitions
        # -----------------------------
        filter_parts = []
        fade_duration = 0.8  # Smoother transition
        
        # Create zoompan effects for each image (Ken Burns effect)
        zoompan_streams = []
        for i in range(len(image_files)):
            dur = durations[i]
            # Alternate between zoom in and zoom out for variety
            if i % 2 == 0:
                # Zoom in slowly
                zoompan = f"[{i}:v]scale=1440:2560,zoompan=z='min(zoom+0.0015,1.2)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={int(dur*30)}:s=720x1280:fps=30[z{i}]"
            else:
                # Zoom out or pan
                zoompan = f"[{i}:v]scale=1440:2560,zoompan=z='if(lte(zoom,1.0),1.2,max(1.0,zoom-0.0015))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={int(dur*30)}:s=720x1280:fps=30[z{i}]"
            
            filter_parts.append(zoompan)
            zoompan_streams.append(f"[z{i}]")

        # Build xfade transitions between zoompan streams
        offset = durations[0] - fade_duration if durations else 1.5
        last_stream = zoompan_streams[0]
        
        for i in range(1, len(image_files)):
            next_stream = zoompan_streams[i]
            out_stream = f"[v{i}]"
            
            # Use different transition effects for variety
            transitions = ["fade", "wipeleft", "wiperight", "slidedown", "slideup"]
            transition = transitions[i % len(transitions)]
            
            filter_parts.append(
                f"{last_stream}{next_stream}xfade=transition={transition}:duration={fade_duration}:offset={offset}{out_stream}"
            )
            last_stream = out_stream
            offset += durations[i] - fade_duration

        final_stream = last_stream

        # -----------------------------
        # Overlay watermark if present
        # -----------------------------
        if watermark_file:
            w_index = len(image_files)
            filter_parts.append(f"{final_stream}[{w_index}:v]overlay=W-w-20:H-h-20[wm_out]")
            final_stream = "[wm_out]"

        # -----------------------------
        # Overlay captions with proper Unicode support
        # -----------------------------
        if captions and len(captions) > 0:
            # Create a subtitle file for better Unicode support
            subtitle_file = f"/tmp/subtitles_{uuid.uuid4()}.ass"
            
            # Generate ASS subtitle file with proper Unicode encoding
            ass_content = """[Script Info]
Title: Captions
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: None

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,48,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,2,1,2,10,10,80,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
            
            for word in captions:
                start_time = word.get("start", 0)
                end_time = word.get("end", start_time + 1)
                text = word.get("word", "")
                
                # Convert seconds to ASS time format (H:MM:SS.CS)
                def format_time(seconds):
                    h = int(seconds // 3600)
                    m = int((seconds % 3600) // 60)
                    s = int(seconds % 60)
                    cs = int((seconds % 1) * 100)
                    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"
                
                start_str = format_time(start_time)
                end_str = format_time(end_time)
                
                ass_content += f"Dialogue: 0,{start_str},{end_str},Default,,0,0,0,,{text}\n"
            
            # Write subtitle file with UTF-8 encoding
            with open(subtitle_file, "w", encoding="utf-8") as f:
                f.write(ass_content)
            
            print(f"Created subtitle file: {subtitle_file}")
            
            # Use subtitles filter for better Unicode support
            filter_parts.append(f"{final_stream}subtitles={subtitle_file}:force_style='Alignment=2,MarginV=80,Fontsize=48,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Shadow=1'[caption_out]")
            final_stream = "[caption_out]"

        # -----------------------------
        # Final format
        # -----------------------------
        filter_parts.append(f"{final_stream}format=yuv420p[final]")

        filter_complex = ";".join(filter_parts)
        print("Filter complex:", filter_complex)

        # -----------------------------
        # Output file
        # -----------------------------
        output_file = f"/tmp/output_{uuid.uuid4()}.mp4"

        # -----------------------------
        # FFmpeg command
        # Audio input index is after all image inputs
        audio_input_index = len(image_files)
        if watermark_file:
            audio_input_index += 1

        cmd = [
            "ffmpeg",
            "-y",
            *inputs,
            "-i", audio_file,
            "-filter_complex", filter_complex,
            "-map", "[final]",
            "-map", f"{audio_input_index}:a",
            "-c:v", "libx264",
            "-preset", "medium",
            "-crf", "23",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            output_file
        ]
        print("FFmpeg CMD:", " ".join(cmd))

        process = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        print("FFmpeg Output:", process.stdout)
        print("FFmpeg Error:", process.stderr)

        if process.returncode != 0:
            return jsonify({"error": "FFmpeg failed", "details": process.stderr}), 500

        # -----------------------------
        # Clean up subtitle file
        # -----------------------------
        if captions and len(captions) > 0:
            try:
                os.remove(subtitle_file)
            except:
                pass

        # -----------------------------
        # Return video as base64
        # -----------------------------
        with open(output_file, "rb") as f:
            video_bytes = f.read()
        video_base64 = base64.b64encode(video_bytes).decode()
        
        # Clean up temporary files
        try:
            os.remove(audio_file)
            os.remove(output_file)
            for img_file in image_files:
                os.remove(img_file)
            if watermark_file:
                os.remove(watermark_file)
        except Exception as e:
            print(f"Cleanup warning: {e}")
        
        return jsonify({"videoBase64": video_base64})

    except Exception as e:
        print("Error:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# -----------------------------
# Health Check
# -----------------------------
@app.get("/")
def home():
    return "FFmpeg Renderer is alive!"

# -----------------------------
# Cloud Run Port Bind
# -----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
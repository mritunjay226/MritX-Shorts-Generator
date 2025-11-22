# server.py (UPDATED)
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
# Helper: Sanitize text for FFmpeg (keeps ASS-safe)
# -----------------------------
def sanitize_text_for_ffmpeg(text):
    if not text:
        return ""
    text = str(text)
    text = text.replace("\\", "\\\\")
    text = text.replace("'", "'\\\\\\''")
    text = text.replace(":", "\\:")
    text = text.replace("%", "\\%")
    # Also escape comma for ASS lines
    text = text.replace(",", "\\,")
    return text

# -----------------------------
# Map caption preset name -> ASS style values
# (Tailwind-style presets -> ASS style)
# -----------------------------
def caption_preset_to_ass_style(preset_name, overrides=None):
    """
    Returns a dict of ASS style properties for a given preset_name.
    You can pass `overrides` dict to replace values (e.g., fontsize, primary, outline).
    """
    presets = {
        "Youtuber": {
            "Fontname": "Arial",
            "Fontsize": 56,
            "PrimaryColour": "&H00FFFF00",  # yellowish (BGR hex in ASS)
            "OutlineColour": "&H00000000",
            "Bold": -1,
            "Italic": 0,
            "Outline": 3,
            "Shadow": 2,
            "Alignment": 2,  # bottom-center
            "MarginV": 80
        },
        "Supreme": {
            "Fontname": "Arial",
            "Fontsize": 52,
            "PrimaryColour": "&H00FFFFFF",
            "OutlineColour": "&H00000000",
            "Bold": -1,
            "Italic": 1,
            "Outline": 2,
            "Shadow": 2,
            "Alignment": 2,
            "MarginV": 80
        },
        "Neon": {
            "Fontname": "Arial",
            "Fontsize": 54,
            "PrimaryColour": "&H0000FF00",  # greenish
            "OutlineColour": "&H00000000",
            "Bold": -1,
            "Italic": 0,
            "Outline": 3,
            "Shadow": 3,
            "Alignment": 2,
            "MarginV": 80
        },
        "Glitch": {
            "Fontname": "Arial",
            "Fontsize": 54,
            "PrimaryColour": "&H00FF00FF",  # pink-ish
            "OutlineColour": "&H00000000",
            "Bold": -1,
            "Italic": 0,
            "Outline": 3,
            "Shadow": 4,
            "Alignment": 2,
            "MarginV": 80
        },
        "Fire": {
            "Fontname": "Arial",
            "Fontsize": 56,
            "PrimaryColour": "&H000000FF",  # red (ASS hex is &HAABBGGRR but our strings use simple forms)
            "OutlineColour": "&H00000000",
            "Bold": -1,
            "Italic": 0,
            "Outline": 4,
            "Shadow": 2,
            "Alignment": 2,
            "MarginV": 80
        },
        "Futuristic": {
            "Fontname": "Arial",
            "Fontsize": 50,
            "PrimaryColour": "&H00FF0000",  # blue-ish
            "OutlineColour": "&H00000000",
            "Bold": -1,
            "Italic": 0,
            "Outline": 2,
            "Shadow": 1,
            "Alignment": 2,
            "MarginV": 80
        },
        # default
        "Default": {
            "Fontname": "Arial",
            "Fontsize": 48,
            "PrimaryColour": "&H00FFFFFF",
            "OutlineColour": "&H00000000",
            "Bold": -1,
            "Italic": 0,
            "Outline": 2,
            "Shadow": 1,
            "Alignment": 2,
            "MarginV": 80
        }
    }

    base = presets.get(preset_name, presets["Default"]).copy()
    if overrides:
        for k, v in overrides.items():
            if k in base:
                base[k] = v
            else:
                base[k] = v
    return base

# -----------------------------
# Compose ASS style line from properties
# -----------------------------
def build_ass_style_line(style_name, style_props):
    # ASS colors are BGR in hex and prefixed with &H
    # We expect PrimaryColour and OutlineColour strings already in &H format above.
    Fontname = style_props.get("Fontname", "Arial")
    Fontsize = style_props.get("Fontsize", 48)
    PrimaryColour = style_props.get("PrimaryColour", "&H00FFFFFF")
    SecondaryColour = style_props.get("SecondaryColour", "&H000000FF")
    OutlineColour = style_props.get("OutlineColour", "&H00000000")
    BackColour = style_props.get("BackColour", "&H80000000")
    Bold = style_props.get("Bold", -1)
    Italic = style_props.get("Italic", 0)
    Underline = style_props.get("Underline", 0)
    StrikeOut = style_props.get("StrikeOut", 0)
    ScaleX = 100
    ScaleY = 100
    Spacing = 0
    Angle = 0
    BorderStyle = 1
    Outline = style_props.get("Outline", 2)
    Shadow = style_props.get("Shadow", 1)
    Alignment = style_props.get("Alignment", 2)
    MarginL = 10
    MarginR = 10
    MarginV = style_props.get("MarginV", 80)
    Encoding = 1

    style_line = (
        f"Style: {style_name},{Fontname},{Fontsize},{PrimaryColour},{SecondaryColour},"
        f"{OutlineColour},{BackColour},{Bold},{Italic},{Underline},{StrikeOut},{ScaleX},{ScaleY},"
        f"{Spacing},{Angle},{BorderStyle},{Outline},{Shadow},{Alignment},{MarginL},{MarginR},{MarginV},{Encoding}"
    )
    return style_line

# -----------------------------
# Main Render Route
# -----------------------------
@app.post("/render")
def render_video():
    try:
        data = request.json
        images = data.get("images", [])
        audio_url = data.get("audioUrl")
        bg_music_url = data.get("bgMusicUrl")  # optional background music
        durations = data.get("durations", [])
        captions = data.get("captions", [])
        watermark_url = data.get("watermarkUrl")
        caption_obj = data.get("caption")  # may contain {name: "Youtuber"} or full captionStyle
        captionStyleOverrides = data.get("captionStyle")  # optional overrides

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
        print("bgMusicUrl present:", bool(bg_music_url))
        print("caption preset/style:", caption_obj, captionStyleOverrides)

        # -----------------------------
        # Handle narration audio (base64 or URL)
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
        # Handle background music (optional)
        # -----------------------------
        bgm_file = None
        if bg_music_url:
            bgm_file = f"/tmp/bgm_{uuid.uuid4()}.mp3"
            if bg_music_url.startswith("data:audio"):
                header, b64 = bg_music_url.split(",", 1)
                with open(bgm_file, "wb") as f:
                    f.write(base64.b64decode(b64))
                print("BGM saved from base64")
            else:
                download_file(bg_music_url, bgm_file)
                print("BGM downloaded from URL")

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
        # Build FFmpeg inputs (images first)
        # -----------------------------
        inputs = []
        for img_file, dur in zip(image_files, durations):
            # keep each image as a looping input for 'dur' seconds
            inputs.extend(["-loop", "1", "-t", str(dur), "-i", img_file])
        if watermark_file:
            inputs.extend(["-i", watermark_file])

        # After images (+ watermark), we'll add narration and optional bgm as inputs (below)
        # audio indices: narration index = len(image_files) (+1 if watermark) ; bgm index = narration_index + 1 (if present)

        # -----------------------------
        # Build filters for image scaling/crop + zoompan + transitions
        # Key improvements:
        # - Use aspect-preserving scale + crop to avoid stretching (cover)
        # - Use fps=60 and duration frames based on 60 fps
        # - Use 'normal' zoom amount for a pleasant Ken Burns
        # -----------------------------
        filter_parts = []
        fade_duration = 0.8  # smooth transition in seconds
        target_w = 720
        target_h = 1280
        fps = 60  # quality A requested 60fps
        zoom_speed_increase = 0.0015  # normal zoom (tweak if you want slight/strong)
        zoom_speed_decrease = 0.0012

        # For each image input index i, create a pre-scale+crop then zoompan
        zoompan_streams = []
        for i in range(len(image_files)):
            dur = durations[i]
            # duration in frames at target fps
            d_frames = int(dur * fps)

            # Build an aspect-preserving scale then crop, then zoompan
            # scale expression: scale by min ratio to fill target box without stretching
            # then crop to exact size
            # then zoompan applies the zoom over d_frames frames at fps
            if i % 2 == 0:
                # zoom-in
                zoompan = (
                    f"[{i}:v]scale='iw*min({target_w}/iw\\,{target_h}/ih)':'ih*min({target_w}/iw\\,{target_h}/ih)',"
                    f"crop={target_w}:{target_h},"
                    f"zoompan=z='min(zoom+{zoom_speed_increase},1.2)':"
                    f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={d_frames}:s={target_w}x{target_h}:fps={fps}[z{i}]"
                )
            else:
                # zoom-out or slow pan
                zoompan = (
                    f"[{i}:v]scale='iw*min({target_w}/iw\\,{target_h}/ih)':'ih*min({target_w}/iw\\,{target_h}/ih)',"
                    f"crop={target_w}:{target_h},"
                    f"zoompan=z='if(lte(zoom,1.0),1.2,max(1.0,zoom-{zoom_speed_decrease}))':"
                    f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={d_frames}:s={target_w}x{target_h}:fps={fps}[z{i}]"
                )

            filter_parts.append(zoompan)
            zoompan_streams.append(f"[z{i}]")

        # Build xfade transitions between zoompan streams (using offsets computed at fps)
        # offset needs to be in seconds for xfade, so we'll keep seconds arithmetic
        offset_seconds = durations[0] - fade_duration if durations else 1.5
        last_stream = zoompan_streams[0]

        transitions = ["fade", "wipeleft", "wiperight", "slidedown", "slideup"]
        for i in range(1, len(image_files)):
            next_stream = zoompan_streams[i]
            out_stream = f"[v{i}]"
            transition = transitions[i % len(transitions)]
            # xfade expects offset in seconds
            filter_parts.append(
                f"{last_stream}{next_stream}xfade=transition={transition}:duration={fade_duration}:offset={offset_seconds}{out_stream}"
            )
            last_stream = out_stream
            offset_seconds += durations[i] - fade_duration

        final_stream = last_stream

        # -----------------------------
        # Overlay watermark if present
        # -----------------------------
        if watermark_file:
            w_index = len(image_files)
            # overlay at bottom-right with 20px padding
            filter_parts.append(f"{final_stream}[{w_index}:v]overlay=W-w-20:H-h-20[wm_out]")
            final_stream = "[wm_out]"

        # -----------------------------
        # Subtitles (ASS) generation & dynamic style
        # Accepts either:
        # - caption_obj = { "name": "Youtuber" } (preset)
        # - captionStyleOverrides = { "Fontsize": 52, "PrimaryColour": "&H00FF00FF", ... }
        # - captions = [{start,end,word}, ...]
        # -----------------------------
        subtitle_file = None
        if captions and len(captions) > 0:
            subtitle_file = f"/tmp/subtitles_{uuid.uuid4()}.ass"
            # Determine style props
            preset_name = None
            overrides = None
            if isinstance(caption_obj, dict):
                preset_name = caption_obj.get("name")
            if captionStyleOverrides and isinstance(captionStyleOverrides, dict):
                overrides = captionStyleOverrides

            style_props = caption_preset_to_ass_style(preset_name or "Default", overrides)
            style_line = build_ass_style_line("Default", style_props)

            ass_content = (
                "[Script Info]\n"
                "Title: Captions\n"
                "ScriptType: v4.00+\n"
                "WrapStyle: 0\n"
                "ScaledBorderAndShadow: yes\n"
                "YCbCr Matrix: None\n\n"
                "[V4+ Styles]\n"
                "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n"
            )
            ass_content += style_line + "\n\n"
            ass_content += "[Events]\n"
            ass_content += "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n"

            # Write dialogues
            def format_time(seconds):
                h = int(seconds // 3600)
                m = int((seconds % 3600) // 60)
                s = int(seconds % 60)
                cs = int((seconds % 1) * 100)
                return f"{h}:{m:02d}:{s:02d}.{cs:02d}"

            for word in captions:
                start_time = word.get("start", 0)
                end_time = word.get("end", start_time + 1)
                text = word.get("word", "")
                text = sanitize_text_for_ffmpeg(text)
                start_str = format_time(start_time)
                end_str = format_time(end_time)
                ass_content += f"Dialogue: 0,{start_str},{end_str},Default,,0,0,0,,{text}\n"

            with open(subtitle_file, "w", encoding="utf-8") as f:
                f.write(ass_content)

            print(f"Created subtitle file: {subtitle_file}")

            # Use subtitles filter (ASS supports Unicode nicely). Also set force_style based on style props for runtime tweaks.
            # Build a small force_style string if overrides present (font size / color / outline)
            fs_elems = []
            if "Fontsize" in style_props:
                fs_elems.append(f"Fontsize={style_props['Fontsize']}")
            if "PrimaryColour" in style_props:
                # ASS PrimaryColour is &HAABBGGRR. We already stored strings like &H00RRGGBB (approx), keep them as is.
                fs_elems.append(f"PrimaryColour={style_props['PrimaryColour']}")
            if "Outline" in style_props:
                fs_elems.append(f"Outline={style_props['Outline']}")
            if "Shadow" in style_props:
                fs_elems.append(f"Shadow={style_props['Shadow']}")
            if "Alignment" in style_props:
                fs_elems.append(f"Alignment={style_props['Alignment']}")
            if "MarginV" in style_props:
                fs_elems.append(f"MarginV={style_props['MarginV']}")

            force_style_str = ",".join(fs_elems)
            filter_parts.append(f"{final_stream}subtitles={subtitle_file}:force_style='{force_style_str}'[caption_out]")
            final_stream = "[caption_out]"

        # -----------------------------
        # Final format + color / sharpen enhancements
        # - scale final output (Lanczos) to ensure crispness (we already built frames in target size)
        # - slight unsharp and eq for punchy look
        # -----------------------------
        # Apply final format and small enhancements
        # We append format at the end; unsharp & eq could be added here as needed.
        filter_parts.append(f"{final_stream}format=yuv420p,unsharp=5:5:0.8,eq=contrast=1.05:saturation=1.08[final]")
        filter_complex = ";".join(filter_parts)
        print("Filter complex:", filter_complex)

        # -----------------------------
        # Prepare output and command
        # -----------------------------
        output_file = f"/tmp/output_{uuid.uuid4()}.mp4"

        # Add narration and bgm inputs after image inputs
        # narration index:
        audio_input_index = len(image_files)
        if watermark_file:
            audio_input_index += 1

        # Build command
        cmd = ["ffmpeg", "-y", *inputs, "-i", audio_file]
        if bgm_file:
            cmd.extend(["-i", bgm_file])

        # Now add filter_complex
        cmd.extend(["-filter_complex", filter_complex])

        # Add audio mixing mapping:
        # If bgm exists, create a mixed audio stream in filter_complex by appending appropriate audio filters.
        # To keep it safe, we'll append audio mixing filter to filter_complex string above if bgm exists.
        # But since filter_complex is already defined, we'll instead append audio mixing filters now by extending filter_complex:
        # (We will construct the audio mixing filters and re-run ffmpeg with the updated filter_complex)
        # NOTE: For simplicity, we will append the audio mix chain into filter_complex before handing to ffmpeg

        # Build audio mixing filter section and update cmd mapping
        # narration input stream index is `audio_input_index`
        # bgm input (if exists) index is audio_input_index + 1
        audio_filters = []
        if bgm_file:
            bgm_index = audio_input_index + 1
            # apply volume to bgm to keep narration clear; reduce bgm to ~0.25
            audio_filters.append(f"[{audio_input_index}:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,volume=1.0[a_narr]")
            audio_filters.append(f"[{bgm_index}:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,volume=0.30[a_bgm]")
            audio_filters.append(f"[a_narr][a_bgm]amix=inputs=2:dropout_transition=2,volume=2.0[aout]")
            # append audio filter parts to the filter_complex and map [aout]
            # Note: we need to combine filter_complex and audio_filters into one string argument
            # So update the filter_complex argument in cmd
            combined_filter = filter_complex + ";" + ";".join(audio_filters)
            # replace the filter_complex entry in cmd with combined_filter
            # find index of "-filter_complex" in cmd
            try:
                fc_index = cmd.index("-filter_complex") + 1
                cmd[fc_index] = combined_filter
            except ValueError:
                cmd.extend(["-filter_complex", combined_filter])
            # mapping: map [final] video and [aout] audio
            cmd.extend(["-map", "[final]", "-map", "[aout]"])
        else:
            # no bgm: video [final], audio is the narration input stream index
            cmd.extend(["-map", "[final]", "-map", f"{audio_input_index}:a"])

        # Video encoding settings (Quality A - max quality but 720p)
        cmd.extend([
            "-c:v", "libx264",
            "-preset", "slow",   # better quality (slower). use 'slower' or 'veryslow' if you want even better quality.
            "-crf", "17",       # high-quality
            "-profile:v", "high",
            "-level", "4.1",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            output_file
        ])

        print("FFmpeg CMD:", " ".join(cmd))

        process = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        print("FFmpeg Output:", process.stdout)
        print("FFmpeg Error:", process.stderr)

        if process.returncode != 0:
            return jsonify({"error": "FFmpeg failed", "details": process.stderr}), 500

        # -----------------------------
        # Clean up subtitle file
        # -----------------------------
        if subtitle_file:
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
            if bgm_file:
                os.remove(bgm_file)
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

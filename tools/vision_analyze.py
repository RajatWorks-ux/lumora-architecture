import os
import sys
import base64
import argparse
import requests
from io import BytesIO
from PIL import Image

URL = "https://integrate.api.nvidia.com/v1/chat/completions"
MODEL = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning"

SYSTEM_PROMPT = (
    "You are a senior art director, photographer, and UI/UX designer with 20 years of experience. "
    "You analyze images with precision. You only describe what is actually visible. "
    "You never invent objects, text, or UI elements that are not in the image. "
    "You are concrete and specific: you name exact colors, positions, materials, and techniques. "
    "You give honest critique, not flattery."
)

PROMPTS = {
    "full": """
Analyze this image in complete detail. Use these exact sections:

## 1. Summary
One or two sentences: what this image is and what it is trying to achieve.

## 2. Subject and Content
List every main object, person, or element. Describe position (left/center/right, foreground/midground/background), size, pose, expression, clothing, materials, and condition.

## 3. Composition
Framing, camera angle, perspective, rule of thirds, leading lines, symmetry, depth layers, negative space, and where the eye goes first, second, and third.

## 4. Color Palette
Dominant, secondary, and accent colors with approximate HEX codes. Color temperature (warm/cool), saturation, harmony type (complementary, analogous, etc.), and overall color grading.

## 5. Lighting and Contrast
Light source direction, quality (hard/soft), color of light, shadows, highlights, rim light, volumetric effects, dynamic range, contrast level, and whether anything is over/underexposed.

## 6. Style, Mood and Atmosphere
Art style or photographic genre, era or aesthetic references, emotional tone, and the story the image tells.

## 7. Technical Quality
Sharpness, focus, depth of field, noise or grain, resolution feel, compression artifacts, anatomy or perspective errors, AI-generation artifacts (warped hands, melted details, inconsistent shadows, garbled text), and edge quality.

## 8. Typography (only if text is visible)
Font style, weight, size hierarchy, readability, kerning, alignment, and contrast against the background. If there is no text, write "No text visible."

## 9. Layout and UI (only if this is a website/app screenshot)
Grid, alignment, spacing, visual hierarchy, CTA prominence, navigation clarity, responsiveness concerns, accessibility and color contrast. If it is not a UI, write "Not a UI screenshot."

## 10. What Works Well
At least 3 specific strengths.

## 11. Problems and Improvements
At least 3 specific, actionable fixes, ordered by impact. Say exactly what to change.

## 12. Score
Rate out of 10 for: Composition, Color, Lighting, Technical Quality, Overall Impact. One short reason each.

## 13. Recreation Prompt
Write one long, detailed text-to-image prompt (120-200 words) that would recreate this image: subject, style, composition, lighting, color palette, camera/lens, mood, quality keywords.
""",
    "design": """
Review this as a senior website art director and UI/UX designer.
Cover: visual style and mood, layout and grid, spacing and alignment, visual hierarchy,
typography, color palette with HEX codes, contrast and accessibility, CTA clarity,
imagery quality, what works, and at least 5 concrete prioritized improvements.
If it is not a website screenshot, say so and do not invent UI elements.
""",
    "prompt": """
Study this image and write one long, highly detailed text-to-image prompt (150-250 words)
that would recreate it as closely as possible. Include: subject and action, environment,
composition and camera angle, lens and depth of field, lighting setup, color palette,
materials and textures, art style, mood, and quality keywords.
Then add a short "Negative prompt" line listing things to avoid.
Output only the prompt and the negative prompt.
""",
    "critique": """
Critique this image as a harsh but fair professional. Focus only on flaws:
technical errors, anatomy or perspective mistakes, lighting problems, composition weaknesses,
color issues, artifacts, and anything that looks fake or AI-generated.
For each flaw give a severity (low/medium/high) and an exact fix.
End with an overall score out of 10.
""",
}


def prepare_image(path, max_side):
    img = Image.open(path)
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[-1])
        img = bg
    else:
        img = img.convert("RGB")
    img.thumbnail((max_side, max_side), Image.LANCZOS)
    buffer = BytesIO()
    img.save(buffer, format="JPEG", quality=90)
    return base64.b64encode(buffer.getvalue()).decode("utf-8"), img.size


def main():
    parser = argparse.ArgumentParser(description="NVIDIA Nemotron vision analyzer")
    parser.add_argument("image", help="Path to image file")
    parser.add_argument("--mode", choices=PROMPTS.keys(), default="full")
    parser.add_argument("--ask", default=None, help="Custom question about the image")
    parser.add_argument("--max-side", type=int, default=1600)
    parser.add_argument("--tokens", type=int, default=2500)
    parser.add_argument("--save", default=None, help="Save the analysis to a text file")
    args = parser.parse_args()

    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        print("ERROR: NVIDIA_API_KEY is missing.")
        sys.exit(1)

    if not os.path.isfile(args.image):
        print("ERROR: Image file not found:", args.image)
        sys.exit(1)

    try:
        encoded, size = prepare_image(args.image, args.max_side)
    except Exception as e:
        print("ERROR: Could not read image:", e)
        sys.exit(1)

    prompt = args.ask.strip() if args.ask else PROMPTS[args.mode].strip()
    data_url = f"data:image/jpeg;base64,{encoded}"

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": data_url}},
                ],
            },
        ],
        "max_tokens": args.tokens,
        "stream": False,
        "temperature": 0.2,
        "top_p": 0.9,
    }

    mode_label = "custom question" if args.ask else args.mode
    print(f"Sending image ({size[0]}x{size[1]}) to Nemotron Omni | mode: {mode_label}")

    try:
        response = requests.post(
            URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            json=payload,
            timeout=240,
        )
    except requests.RequestException as e:
        print("Network error:", e)
        sys.exit(1)

    print("HTTP status:", response.status_code)

    if not response.ok:
        print(response.text[:1500])
        sys.exit(1)

    try:
        answer = response.json()["choices"][0]["message"]["content"]
    except Exception:
        print("Unexpected response format:")
        print(response.text[:1500])
        sys.exit(2)

    print("\n===== VISION ANALYSIS =====\n")
    print(answer)

    if args.save:
        with open(args.save, "w", encoding="utf-8") as f:
            f.write(answer)
        print("\nSaved to:", args.save)


if __name__ == "__main__":
    main()


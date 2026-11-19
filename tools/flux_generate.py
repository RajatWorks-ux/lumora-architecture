import os
import sys
import base64
import argparse
import random
from datetime import datetime
from io import BytesIO

import requests
from PIL import Image

URL = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux-3-image-klein"
OUTPUT_DIR = "/root/projects/webforge-test/assets/generated"

# ---------------------------------------------------------------------------
# PROMPT ENGINE: turns a short idea into a long, detailed, ChatGPT-style prompt
# ---------------------------------------------------------------------------

QUALITY_CORE = (
    "Masterpiece-quality image, ultra high resolution, 8K detail, extremely sharp focus, "
    "crisp clean edges, rich fine textures, physically accurate materials, "
    "natural believable proportions, flawless anatomy and perspective, "
    "professional color grading with balanced contrast and a wide dynamic range, "
    "deep blacks, clean highlights without clipping, harmonious color palette, "
    "strong visual hierarchy, clear focal point, balanced composition following the rule of thirds, "
    "depth and layered foreground, midground and background, "
    "polished, intentional, award-winning professional finish, no visual clutter."
)

STYLES = {
    "photo": (
        "Ultra-realistic professional photograph shot on a full-frame mirrorless camera, "
        "85mm f/1.4 prime lens, shallow depth of field with creamy bokeh, ISO 100, "
        "natural skin and surface texture, true-to-life colors, soft cinematic lighting, "
        "subtle film grain, editorial magazine quality."
    ),
    "cinematic": (
        "Cinematic movie still, anamorphic lens, dramatic volumetric lighting, "
        "atmospheric haze and light rays, rich teal-and-amber color grading, "
        "epic scale, moody and immersive, shot by an award-winning cinematographer."
    ),
    "3d": (
        "High-end 3D render, Octane / Unreal Engine 5 quality, ray-traced global illumination, "
        "subsurface scattering, physically based materials, soft studio lighting, "
        "clean glossy surfaces, ultra detailed, smooth gradients."
    ),
    "illustration": (
        "Premium digital illustration, clean confident linework, refined shading, "
        "harmonious palette, polished concept-art quality, detailed yet uncluttered, "
        "professional artbook finish."
    ),
    "product": (
        "Premium commercial product photography, seamless studio backdrop, "
        "softbox lighting with gentle reflections and soft shadows, "
        "tack-sharp focus across the product, luxury advertising campaign look."
    ),
    "web": (
        "Premium futuristic website hero visual, elegant dark graphite architecture, "
        "warm amber accent lighting, minimal and spacious composition with generous negative space "
        "for headline placement, cinematic depth, refined modern aesthetic, SaaS landing page quality."
    ),
    "anime": (
        "High-quality anime key visual, clean lineart, vibrant cel shading, "
        "detailed expressive eyes, dynamic composition, studio-grade background art, "
        "luminous lighting and color."
    ),
}

NEGATIVE = (
    "Avoid: blurry, out of focus, low resolution, pixelated, jpeg artifacts, noise, "
    "distorted anatomy, extra fingers, extra limbs, deformed hands, malformed face, "
    "asymmetrical eyes, cross-eyed, duplicated subjects, cropped subject, cut-off head, "
    "text, letters, words, watermark, logo, signature, captions, UI overlays, "
    "oversaturated, overexposed, underexposed, muddy colors, flat lighting, "
    "cluttered background, plastic skin, uncanny look, cartoonish artifacts (unless requested)."
)

ASPECTS = {
    "square": (1024, 1024),
    "wide": (1344, 768),
    "tall": (768, 1344),
    "photo": (1216, 832),
}


def build_prompt(idea: str, style: str, no_boost: bool = False) -> str:
    if no_boost:
        return idea
    parts = [
        f"SUBJECT AND SCENE: {idea.strip().rstrip('.')}.",
        f"STYLE: {STYLES[style]}",
        f"QUALITY: {QUALITY_CORE}",
        "Render every element exactly as described, with accurate details, "
        "coherent lighting direction, consistent shadows, and no random extra objects.",
        NEGATIVE,
    ]
    return " ".join(parts)


# ---------------------------------------------------------------------------
# API
# ---------------------------------------------------------------------------

def find_image(obj):
    if isinstance(obj, dict):
        for value in obj.values():
            found = find_image(value)
            if found:
                return found
    elif isinstance(obj, list):
        for value in obj:
            found = find_image(value)
            if found:
                return found
    elif isinstance(obj, str) and len(obj) > 500:
        try:
            raw = obj.strip()
            if raw.startswith("data:image"):
                raw = raw.split(",", 1)[1]
            image = Image.open(BytesIO(base64.b64decode(raw)))
            image.load()
            return image
        except Exception:
            return None
    return None


def call_api(headers, payload):
    return requests.post(URL, headers=headers, json=payload, timeout=240)


def main():
    parser = argparse.ArgumentParser(description="NVIDIA FLUX image generator")
    parser.add_argument("idea", nargs="*", help="Short description of the image")
    parser.add_argument("--style", choices=STYLES.keys(), default="photo")
    parser.add_argument("--aspect", choices=ASPECTS.keys(), default="square")
    parser.add_argument("--steps", type=int, default=30)
    parser.add_argument("--cfg", type=float, default=4.0)
    parser.add_argument("--seed", type=int, default=None)
    parser.add_argument("--raw", action="store_true", help="Send your prompt as-is, no boost")
    args = parser.parse_args()

    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        print("ERROR: NVIDIA_API_KEY is missing.")
        sys.exit(1)

    idea = " ".join(args.idea).strip() or (
        "A premium futuristic AI website hero illustration with elegant dark graphite "
        "architecture and warm amber lighting"
    )

    prompt = build_prompt(idea, args.style, args.raw)
    width, height = ASPECTS[args.aspect]
    seed = args.seed if args.seed is not None else random.randint(0, 2**31 - 1)

    print(f"Style: {args.style} | Aspect: {args.aspect} ({width}x{height}) | Seed: {seed}")
    print("Generating image with NVIDIA FLUX...")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    full_payload = {
        "prompt": prompt,
        "width": width,
        "height": height,
        "steps": args.steps,
        "cfg_scale": args.cfg,
        "seed": seed,
    }

    response = call_api(headers, full_payload)
    print("HTTP status:", response.status_code)

    # If the model rejects the extra parameters, retry with the prompt only.
    if response.status_code in (400, 422):
        print("Extra parameters rejected, retrying with prompt only...")
        response = call_api(headers, {"prompt": prompt})
        print("HTTP status:", response.status_code)

    if not response.ok:
        print("API error:", response.text[:1500])
        sys.exit(1)

    data = response.json()
    image = find_image(data)

    if image is None:
        print("Response received, but no base64 image was detected.")
        print("Response keys:", list(data.keys()) if isinstance(data, dict) else type(data))
        sys.exit(2)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    name = f"flux-{datetime.now():%Y%m%d-%H%M%S}-{seed}.png"
    output = os.path.join(OUTPUT_DIR, name)
    image.save(output)

    print("SUCCESS - Image saved to:")
    print(output)
    print("Image size:", image.size)


if __name__ == "__main__":
    main()


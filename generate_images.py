#!/usr/bin/env python3
"""Generate all LUMORA images using FLUX"""

import subprocess
import os
import shutil

# Base command
BASE_CMD = [
    "/root/projects/webforge-test/.venv/bin/python",
    "/root/projects/webforge-test/tools/flux_generate.py",
    "--steps", "30"
]

# Image definitions: (prompt, output_path, style, aspect)
IMAGES = [
    # Home page hero
    ("Luxury modern villa with floor-to-ceiling glass walls, warm limestone facade, infinity pool merging with Mediterranean horizon, golden hour lighting, cinematic architectural photography", "assets/hero-desktop.jpg", "cinematic", "wide"),
    ("Modern luxury villa, warm limestone walls, floor-to-ceiling glass, infinity pool, Mediterranean coastal, architectural photography", "assets/hero-tablet.jpg", "photo", "photo"),
    ("Modern luxury villa mobile view, warm limestone facade, glass walls, infinity pool, architectural photography, vertical composition", "assets/hero-mobile.jpg", "photo", "tall"),
    
    # About page hero
    ("Sunlit architecture atelier workspace, architectural models, material samples, designers collaborating, natural light, warm wood surfaces, professional photography", "assets/about-hero-desktop.jpg", "photo", "photo"),
    ("Architecture studio interior vertical, models and materials, designers working, natural light", "assets/about-hero-mobile.jpg", "photo", "tall"),
    
    # Studio atelier
    ("LUMORA Paris atelier sunlit workspace, architectural models on tables, material library with stone and wood samples, designers at drafting tables, warm ivory walls", "assets/studio-atelier-desktop.jpg", "photo", "photo"),
    ("Architecture studio interior vertical view, material samples, models", "assets/studio-atelier-mobile.jpg", "photo", "tall"),
    
    # Services hero
    ("Contemporary architecture office, blueprints on table, material samples, minimal aesthetic, professional photography", "assets/services-hero-desktop.jpg", "photo", "photo"),
    ("Architecture office interior vertical, plans and materials", "assets/services-hero-mobile.jpg", "photo", "tall"),
    
    # Projects page hero
    ("Architecture portfolio gallery wall, multiple project photos displayed, luxury residential projects, professional lighting", "assets/projects-hero-desktop.jpg", "photo", "photo"),
    ("Portfolio gallery wall vertical view", "assets/projects-hero-mobile.jpg", "photo", "tall"),
    
    # Journal hero
    ("Editorial journal spread, architectural photography, articles about materials and light, magazine layout", "assets/journal-hero-desktop.jpg", "photo", "photo"),
    ("Journal spread vertical, architectural articles", "assets/journal-hero-mobile.jpg", "photo", "tall"),
    
    # Contact hero
    ("Modern contact space, minimal reception desk, warm lighting, architectural details", "assets/contact-hero-desktop.jpg", "photo", "photo"),
    ("Contact space vertical, minimal design", "assets/contact-hero-mobile.jpg", "photo", "tall"),
    
    # Approach section
    ("Architectural design process, sketches and models on table, hands working with materials, creative workflow", "assets/approach-desktop.jpg", "photo", "photo"),
    ("Design process vertical, sketches and models", "assets/approach-mobile.jpg", "photo", "tall"),
]

# Project images
PROJECT_IMAGES = [
    # Limestone Residence
    ("Mediterranean coastal villa, warm limestone facade, floor-to-ceiling glazing, infinity pool, golden hour, luxury residential architecture", "assets/projects/limestone-residence-desktop.jpg", "cinematic", "wide"),
    ("Limestone residence exterior, Mediterranean architecture, vertical", "assets/projects/limestone-residence-mobile.jpg", "photo", "tall"),
    ("Limestone residence hero, dramatic coastal villa, limestone and glass, infinity pool", "assets/projects/limestone-residence-hero-desktop.jpg", "cinematic", "wide"),
    ("Limestone residence hero mobile, coastal villa", "assets/projects/limestone-residence-hero-mobile.jpg", "photo", "tall"),
    ("Limestone residence concept, architectural drawings and model", "assets/projects/limestone-concept-desktop.jpg", "photo", "photo"),
    ("Limestone residence concept vertical", "assets/projects/limestone-concept-mobile.jpg", "photo", "tall"),
    ("Limestone residence gallery 1, living room with limestone walls and sea view", "assets/projects/limestone-gallery-01-desktop.jpg", "photo", "photo"),
    ("Limestone residence gallery 1 vertical", "assets/projects/limestone-gallery-01-mobile.jpg", "photo", "tall"),
    ("Limestone residence gallery 2, kitchen with stone island", "assets/projects/limestone-gallery-02-desktop.jpg", "photo", "photo"),
    ("Limestone residence gallery 2 vertical", "assets/projects/limestone-gallery-02-mobile.jpg", "photo", "tall"),
    ("Limestone residence gallery 3, bedroom with floor-to-ceiling windows", "assets/projects/limestone-gallery-03-desktop.jpg", "photo", "photo"),
    ("Limestone residence gallery 3 vertical", "assets/projects/limestone-gallery-03-mobile.jpg", "photo", "tall"),
    ("Limestone residence gallery 4, bathroom with natural stone", "assets/projects/limestone-gallery-04-desktop.jpg", "photo", "photo"),
    ("Limestone residence gallery 4 vertical", "assets/projects/limestone-gallery-04-mobile.jpg", "photo", "tall"),
    ("Limestone residence gallery 5, outdoor terrace and pool", "assets/projects/limestone-gallery-05-desktop.jpg", "photo", "photo"),
    ("Limestone residence gallery 5 vertical", "assets/projects/limestone-gallery-05-mobile.jpg", "photo", "tall"),
    ("Limestone residence gallery 6, architectural detail of limestone facade", "assets/projects/limestone-gallery-06-desktop.jpg", "photo", "photo"),
    ("Limestone residence gallery 6 vertical", "assets/projects/limestone-gallery-06-mobile.jpg", "photo", "tall"),
    ("Limestone residence OG image for social sharing", "assets/projects/limestone-residence-og.jpg", "photo", "photo"),
    ("Limestone residence thumb desktop", "assets/projects/limestone-residence-thumb-desktop.jpg", "photo", "photo"),
    ("Limestone residence thumb mobile", "assets/projects/limestone-residence-thumb-mobile.jpg", "photo", "tall"),
    
    # Casa Verde
    ("Tropical modern residence Casa Verde, timber screens, indoor-outdoor living, lush courtyard gardens, Tulum Mexico, architectural photography", "assets/projects/casa-verde-desktop.jpg", "cinematic", "wide"),
    ("Casa Verde exterior vertical, tropical modern", "assets/projects/casa-verde-mobile.jpg", "photo", "tall"),
    ("Casa Verde hero, tropical residence with courtyard", "assets/projects/casa-verde-hero-desktop.jpg", "cinematic", "wide"),
    ("Casa Verde hero mobile", "assets/projects/casa-verde-hero-mobile.jpg", "photo", "tall"),
    ("Casa Verde concept, architectural model and drawings", "assets/projects/casa-verde-concept-desktop.jpg", "photo", "photo"),
    ("Casa Verde concept vertical", "assets/projects/casa-verde-concept-mobile.jpg", "photo", "tall"),
    ("Casa Verde gallery 1, living area opening to garden", "assets/projects/casa-verde-gallery-01-desktop.jpg", "photo", "photo"),
    ("Casa Verde gallery 1 vertical", "assets/projects/casa-verde-gallery-01-mobile.jpg", "photo", "tall"),
    ("Casa Verde gallery 2, kitchen with timber cabinetry", "assets/projects/casa-verde-gallery-02-desktop.jpg", "photo", "photo"),
    ("Casa Verde gallery 2 vertical", "assets/projects/casa-verde-gallery-02-mobile.jpg", "photo", "tall"),
    ("Casa Verde gallery 3, bedroom with garden view", "assets/projects/casa-verde-gallery-03-desktop.jpg", "photo", "photo"),
    ("Casa Verde gallery 3 vertical", "assets/projects/casa-verde-gallery-03-mobile.jpg", "photo", "tall"),
    ("Casa Verde gallery 4, bathroom with natural materials", "assets/projects/casa-verde-gallery-04-desktop.jpg", "photo", "photo"),
    ("Casa Verde gallery 4 vertical", "assets/projects/casa-verde-gallery-04-mobile.jpg", "photo", "tall"),
    ("Casa Verde gallery 5, outdoor shower and garden", "assets/projects/casa-verde-gallery-05-desktop.jpg", "photo", "photo"),
    ("Casa Verde gallery 5 vertical", "assets/projects/casa-verde-gallery-05-mobile.jpg", "photo", "tall"),
    ("Casa Verde gallery 6, architectural detail of timber screen", "assets/projects/casa-verde-gallery-06-desktop.jpg", "photo", "photo"),
    ("Casa Verde gallery 6 vertical", "assets/projects/casa-verde-gallery-06-mobile.jpg", "photo", "tall"),
    ("Casa Verde OG image", "assets/projects/casa-verde-og.jpg", "photo", "photo"),
    ("Casa Verde thumb desktop", "assets/projects/casa-verde-thumb-desktop.jpg", "photo", "photo"),
    ("Casa Verde thumb mobile", "assets/projects/casa-verde-thumb-mobile.jpg", "photo", "tall"),
    
    # Quiet House
    ("Minimalist concrete and timber residence The Quiet House, zen garden, reflecting pool, meditative spaces, Kyoto Japan, serene architecture", "assets/projects/quiet-house-desktop.jpg", "cinematic", "wide"),
    ("Quiet House exterior vertical, minimalist concrete timber", "assets/projects/quiet-house-mobile.jpg", "photo", "tall"),
    ("Quiet House hero, serene minimalist residence with reflecting pool", "assets/projects/quiet-house-hero-desktop.jpg", "cinematic", "wide"),
    ("Quiet House hero mobile", "assets/projects/quiet-house-hero-mobile.jpg", "photo", "tall"),
    ("Quiet House concept, architectural drawings", "assets/projects/quiet-house-concept-desktop.jpg", "photo", "photo"),
    ("Quiet House concept vertical", "assets/projects/quiet-house-concept-mobile.jpg", "photo", "tall"),
    ("Quiet House gallery 1, meditation room with garden view", "assets/projects/quiet-house-gallery-01-desktop.jpg", "photo", "photo"),
    ("Quiet House gallery 1 vertical", "assets/projects/quiet-house-gallery-01-mobile.jpg", "photo", "tall"),
    ("Quiet House gallery 2, living area with concrete walls", "assets/projects/quiet-house-gallery-02-desktop.jpg", "photo", "photo"),
    ("Quiet House gallery 2 vertical", "assets/projects/quiet-house-gallery-02-mobile.jpg", "photo", "tall"),
    ("Quiet House gallery 3, bedroom opening to zen garden", "assets/projects/quiet-house-gallery-03-desktop.jpg", "photo", "photo"),
    ("Quiet House gallery 3 vertical", "assets/projects/quiet-house-gallery-03-mobile.jpg", "photo", "tall"),
    ("Quiet House gallery 4, bathroom with stone and wood", "assets/projects/quiet-house-gallery-04-desktop.jpg", "photo", "photo"),
    ("Quiet House gallery 4 vertical", "assets/projects/quiet-house-gallery-04-mobile.jpg", "photo", "tall"),
    ("Quiet House gallery 5, outdoor reflecting pool", "assets/projects/quiet-house-gallery-05-desktop.jpg", "photo", "photo"),
    ("Quiet House gallery 5 vertical", "assets/projects/quiet-house-gallery-05-mobile.jpg", "photo", "tall"),
    ("Quiet House gallery 6, architectural detail of concrete and wood", "assets/projects/quiet-house-gallery-06-desktop.jpg", "photo", "photo"),
    ("Quiet House gallery 6 vertical", "assets/projects/quiet-house-gallery-06-mobile.jpg", "photo", "tall"),
    ("Quiet House OG image", "assets/projects/quiet-house-og.jpg", "photo", "photo"),
    ("Quiet House thumb desktop", "assets/projects/quiet-house-thumb-desktop.jpg", "photo", "photo"),
    ("Quiet House thumb mobile", "assets/projects/quiet-house-thumb-mobile.jpg", "photo", "tall"),
]

# Additional project thumbnails for projects page
ADDITIONAL_PROJECTS = [
    ("Luxury cliff house, dramatic ocean views, modern architecture", "assets/projects/cliff-house-desktop.jpg", "photo", "photo"),
    ("Cliff house vertical", "assets/projects/cliff-house-mobile.jpg", "photo", "tall"),
    ("Glass pavilion, transparent architecture, nature integration", "assets/projects/glass-pavilion-desktop.jpg", "photo", "photo"),
    ("Glass pavilion vertical", "assets/projects/glass-pavilion-mobile.jpg", "photo", "tall"),
    ("Hotel Amara, boutique luxury hotel, warm hospitality design", "assets/projects/hotel-amara-desktop.jpg", "photo", "photo"),
    ("Hotel Amara vertical", "assets/projects/hotel-amara-mobile.jpg", "photo", "tall"),
    ("Villa Solara, sunny Mediterranean villa, stone and glass", "assets/projects/villa-solara-desktop.jpg", "photo", "photo"),
    ("Villa Solara vertical", "assets/projects/villa-solara-mobile.jpg", "photo", "tall"),
    ("Maison Lumiere, light-filled French residence", "assets/projects/maison-lumiere-desktop.jpg", "photo", "photo"),
    ("Maison Lumiere vertical", "assets/projects/maison-lumiere-mobile.jpg", "photo", "tall"),
    ("Aurum Spa, luxury wellness center, stone and water", "assets/projects/aurum-spa-desktop.jpg", "photo", "photo"),
    ("Aurum Spa vertical", "assets/projects/aurum-spa-mobile.jpg", "photo", "tall"),
    ("Hotel Amara thumb", "assets/projects/hotel-amara-thumb-desktop.jpg", "photo", "photo"),
    ("Hotel Amara thumb mobile", "assets/projects/hotel-amara-thumb-mobile.jpg", "photo", "tall"),
    ("Villa Solara thumb", "assets/projects/villa-solara-thumb-desktop.jpg", "photo", "photo"),
    ("Villa Solara thumb mobile", "assets/projects/villa-solara-thumb-mobile.jpg", "photo", "tall"),
    ("Maison Lumiere thumb", "assets/projects/maison-lumiere-thumb-desktop.jpg", "photo", "photo"),
    ("Maison Lumiere thumb mobile", "assets/projects/maison-lumiere-thumb-mobile.jpg", "photo", "tall"),
]

# Service images
SERVICE_IMAGES = [
    ("Architecture design, blueprints and models, professional studio", "assets/services/architecture-desktop.jpg", "photo", "photo"),
    ("Architecture design vertical", "assets/services/architecture-mobile.jpg", "photo", "tall"),
    ("Interior design, curated furniture and lighting, luxury residential", "assets/services/interior-design-desktop.jpg", "photo", "photo"),
    ("Interior design vertical", "assets/services/interior-design-mobile.jpg", "photo", "tall"),
    ("Residential design, private home interior, warm materials", "assets/services/residential-desktop.jpg", "photo", "photo"),
    ("Residential design vertical", "assets/services/residential-mobile.jpg", "photo", "tall"),
    ("Hospitality design, boutique hotel lobby, elegant atmosphere", "assets/services/hospitality-desktop.jpg", "photo", "photo"),
    ("Hospitality design vertical", "assets/services/hospitality-mobile.jpg", "photo", "tall"),
    ("Renovation restoration, heritage building transformation", "assets/services/renovation-desktop.jpg", "photo", "photo"),
    ("Renovation restoration vertical", "assets/services/renovation-mobile.jpg", "photo", "tall"),
    ("Spatial consultation, strategic advisory, property development", "assets/services/consultation-desktop.jpg", "photo", "photo"),
    ("Spatial consultation vertical", "assets/services/consultation-mobile.jpg", "photo", "tall"),
]

# Journal images
JOURNAL_IMAGES = [
    ("Natural materials in architecture, stone wood timber closeup", "assets/journal/materials-desktop.jpg", "photo", "photo"),
    ("Natural materials vertical", "assets/journal/materials-mobile.jpg", "photo", "tall"),
    ("Light and shadow in architecture, dramatic lighting, interior", "assets/journal/light-desktop.jpg", "photo", "photo"),
    ("Light and shadow vertical", "assets/journal/light-mobile.jpg", "photo", "tall"),
    ("Architecture and nature relationship, building in landscape", "assets/journal/nature-desktop.jpg", "photo", "photo"),
    ("Architecture and nature vertical", "assets/journal/nature-mobile.jpg", "photo", "tall"),
    ("Craft article thumbnail, hands making furniture", "assets/journal/craft-thumb-desktop.jpg", "photo", "photo"),
    ("Craft thumb vertical", "assets/journal/craft-thumb-mobile.jpg", "photo", "tall"),
    ("Proportion article thumbnail, classical architecture details", "assets/journal/proportion-thumb-desktop.jpg", "photo", "photo"),
    ("Proportion thumb vertical", "assets/journal/proportion-thumb-mobile.jpg", "photo", "tall"),
    ("Silence article thumbnail, quiet minimalist space", "assets/journal/silence-thumb-desktop.jpg", "photo", "photo"),
    ("Silence thumb vertical", "assets/journal/silence-thumb-mobile.jpg", "photo", "tall"),
    ("Memory article thumbnail, architectural details", "assets/journal/memory-thumb-desktop.jpg", "photo", "photo"),
    ("Memory thumb vertical", "assets/journal/memory-thumb-mobile.jpg", "photo", "tall"),
]

# Team images
TEAM_IMAGES = [
    ("Professional portrait, female architect founder, confident, warm lighting", "assets/team/founder-desktop.jpg", "photo", "photo"),
    ("Founder portrait vertical", "assets/team/founder-mobile.jpg", "photo", "tall"),
    ("Professional portrait, male architect partner, sophisticated", "assets/team/partner-desktop.jpg", "photo", "photo"),
    ("Partner portrait vertical", "assets/team/partner-mobile.jpg", "photo", "tall"),
    ("Professional portrait, female interior designer, creative", "assets/team/interiors-desktop.jpg", "photo", "photo"),
    ("Interiors portrait vertical", "assets/team/interiors-mobile.jpg", "photo", "tall"),
    ("Professional portrait, male hospitality designer, refined", "assets/team/hospitality-desktop.jpg", "photo", "photo"),
    ("Hospitality portrait vertical", "assets/team/hospitality-mobile.jpg", "photo", "tall"),
]

# OG image
OG_IMAGES = [
    ("LUMORA architecture brand, luxury residential portfolio, elegant composition for social sharing", "assets/og-image.jpg", "photo", "photo"),
]

ALL_IMAGES = IMAGES + PROJECT_IMAGES + ADDITIONAL_PROJECTS + SERVICE_IMAGES + JOURNAL_IMAGES + TEAM_IMAGES + OG_IMAGES

def generate_image(prompt, output_path, style, aspect):
    """Generate a single image using FLUX"""
    cmd = BASE_CMD + [prompt, "--style", style, "--aspect", aspect]
    print(f"\nGenerating: {output_path}")
    print(f"Prompt: {prompt[:80]}...")
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if result.returncode == 0:
            # Find the generated file
            import glob
            generated_files = glob.glob("/root/projects/webforge-test/assets/generated/flux-*.png")
            if generated_files:
                latest = max(generated_files, key=os.path.getctime)
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                shutil.copy2(latest, output_path)
                print(f"  ✓ Saved to {output_path}")
                return True
            else:
                print(f"  ✗ No generated file found")
                return False
        else:
            print(f"  ✗ Error: {result.stderr[:200]}")
            return False
    except subprocess.TimeoutExpired:
        print(f"  ✗ Timeout")
        return False
    except Exception as e:
        print(f"  ✗ Exception: {e}")
        return False

if __name__ == "__main__":
    print(f"Generating {len(ALL_IMAGES)} images...")
    success = 0
    failed = 0
    
    for prompt, output_path, style, aspect in ALL_IMAGES:
        if generate_image(prompt, output_path, style, aspect):
            success += 1
        else:
            failed += 1
    
    print(f"\n{'='*50}")
    print(f"Complete: {success} successful, {failed} failed")
    print(f"{'='*50}")
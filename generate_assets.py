import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

os.makedirs('assets/images', exist_ok=True)
os.makedirs('assets/icons', exist_ok=True)

# Color definitions
C_DARK = (11, 11, 18)
C_DARKER = (7, 7, 12)
C_PURPLE = (139, 92, 246)
C_VIOLET = (109, 40, 217)
C_ORANGE = (255, 87, 34)
C_AMBER = (245, 158, 11)
C_LAVENDER = (196, 181, 253)
C_LIGHT_BG = (248, 248, 252)
C_CYAN = (6, 182, 212)
C_ROSE = (244, 63, 94)
C_EMERALD = (16, 185, 129)

def draw_gradient_rect(draw, bbox, color1, color2, vertical=True):
    x0, y0, x1, y1 = bbox
    width = x1 - x0
    height = y1 - y0
    steps = height if vertical else width
    for i in range(int(steps)):
        ratio = i / max(1, steps)
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        if vertical:
            draw.line([(x0, y0 + i), (x1, y0 + i)], fill=(r, g, b))
        else:
            draw.line([(x0 + i, y0), (x0 + i, y1)], fill=(r, g, b))

def draw_radial_glow(img, center, radius, color):
    # Create glow overlay
    glow = Image.new('RGBA', img.size, (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    cx, cy = center
    for r in range(radius, 0, -4):
        alpha = int(40 * (1 - r / radius))
        gdraw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(color[0], color[1], color[2], alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(15))
    img.paste(glow, (0, 0), glow)

def create_base_canvas(width, height, bg1=C_DARK, bg2=(18, 18, 28), glow1=None, glow2=None):
    img = Image.new('RGB', (width, height), bg1)
    draw = ImageDraw.Draw(img)
    draw_gradient_rect(draw, (0, 0, width, height), bg1, bg2, vertical=True)
    
    # Subtle grid lines
    grid_spacing = 40
    for x in range(0, width, grid_spacing):
        draw.line([(x, 0), (x, height)], fill=(25, 25, 38), width=1)
    for y in range(0, height, grid_spacing):
        draw.line([(0, y), (width, y)], fill=(25, 25, 38), width=1)
        
    if glow1:
        draw_radial_glow(img, glow1[1], 180, glow1[0])
    else:
        draw_radial_glow(img, (150, 150), 180, C_PURPLE)
    if glow2:
        draw_radial_glow(img, glow2[1], 180, glow2[0])
    else:
        draw_radial_glow(img, (width - 150, height - 150), 180, C_ORANGE)
    return img

def save_optimized_webp(img, filepath, max_kb=95):
    quality = 85
    img.save(filepath, 'WEBP', quality=quality)
    size_kb = os.path.getsize(filepath) / 1024
    while size_kb > max_kb and quality > 30:
        quality -= 8
        img.save(filepath, 'WEBP', quality=quality)
        size_kb = os.path.getsize(filepath) / 1024
    print(f"Generated {filepath}: {size_kb:.1f} KB (quality={quality})")

# 1. Hero Main Image (Visual Composition & Showcase)
def generate_hero():
    w, h = 1200, 800
    img = create_base_canvas(w, h, (10, 10, 16), (20, 20, 32), (C_PURPLE, (300, 250)), (C_ORANGE, (900, 550)))
    draw = ImageDraw.Draw(img)
    
    # Modern floating glassmorphic cards
    # Main center screen mockup
    mockup_box = [260, 140, 940, 660]
    draw.rounded_rectangle([mockup_box[0]-4, mockup_box[1]-4, mockup_box[2]+4, mockup_box[3]+4], radius=24, outline=(139, 92, 246), width=2)
    draw.rounded_rectangle(mockup_box, radius=20, fill=(18, 18, 30))
    
    # Window header bar
    draw.rounded_rectangle([mockup_box[0], mockup_box[1], mockup_box[2], mockup_box[1]+45], radius=15, fill=(26, 26, 44))
    draw.ellipse([mockup_box[0]+20, mockup_box[1]+16, mockup_box[0]+32, mockup_box[1]+28], fill=(244, 63, 94))
    draw.ellipse([mockup_box[0]+40, mockup_box[1]+16, mockup_box[0]+52, mockup_box[1]+28], fill=(245, 158, 11))
    draw.ellipse([mockup_box[0]+60, mockup_box[1]+16, mockup_box[0]+72, mockup_box[1]+28], fill=(16, 185, 129))
    draw.text((mockup_box[0]+95, mockup_box[1]+14), "pixelcraft.studio // visual_identity_system.v3", fill=(196, 181, 253))
    
    # Screen inner layout
    draw.rounded_rectangle([290, 210, 560, 420], radius=14, fill=(35, 30, 55), outline=(109, 40, 217), width=2)
    draw.text((310, 230), "NEXT-GEN 3D IMMERSION", fill=(255, 87, 34))
    draw.rectangle([310, 265, 530, 275], fill=(255, 255, 255))
    draw.rectangle([310, 285, 480, 292], fill=(196, 181, 253))
    draw.rectangle([310, 302, 500, 309], fill=(100, 100, 140))
    draw.rounded_rectangle([310, 335, 440, 385], radius=8, fill=(139, 92, 246))
    draw.text((328, 350), "EXPLORE ARCHITECTURE", fill=(255, 255, 255))
    
    # Screen right graphic: sleek abstract gradient geometry
    draw.rounded_rectangle([590, 210, 910, 420], radius=14, fill=(28, 22, 38))
    # 3D isometric cubes / rings
    center_x, center_y = 750, 315
    for r in range(80, 20, -15):
        draw.ellipse([center_x-r, center_y-r*0.6, center_x+r, center_y+r*0.6], outline=(255, 87, 34) if r % 30 == 0 else (139, 92, 246), width=3)
    draw.ellipse([center_x-15, center_y-15, center_x+15, center_y+15], fill=(255, 255, 255))
    
    # Bottom stats row inside window
    draw.rounded_rectangle([290, 450, 470, 620], radius=12, fill=(24, 24, 40))
    draw.text((310, 470), "CONVERSION IMPACT", fill=(160, 160, 190))
    draw.text((310, 500), "+148%", fill=(16, 185, 129))
    draw.rectangle([310, 550, 450, 558], fill=(40, 40, 65))
    draw.rectangle([310, 550, 420, 558], fill=(16, 185, 129))
    
    draw.rounded_rectangle([490, 450, 690, 620], radius=12, fill=(24, 24, 40))
    draw.text((510, 470), "BRAND SENTIMENT", fill=(160, 160, 190))
    draw.text((510, 500), "99.4%", fill=(139, 92, 246))
    draw.rectangle([510, 550, 670, 558], fill=(40, 40, 65))
    draw.rectangle([510, 550, 660, 558], fill=(139, 92, 246))
    
    draw.rounded_rectangle([710, 450, 910, 620], radius=12, fill=(24, 24, 40))
    draw.text((730, 470), "AWARD NOMINATIONS", fill=(160, 160, 190))
    draw.text((730, 500), "34 Global", fill=(255, 87, 34))
    draw.rectangle([730, 550, 890, 558], fill=(40, 40, 65))
    draw.rectangle([730, 550, 860, 558], fill=(255, 87, 34))
    
    # Left floating badge
    draw.rounded_rectangle([100, 320, 270, 460], radius=18, fill=(30, 25, 48), outline=(139, 92, 246), width=2)
    draw.text((120, 345), "PIXELCRAFT", fill=(196, 181, 253))
    draw.text((120, 375), "AWARDS '26", fill=(255, 255, 255))
    draw.text((120, 410), "STUDIO OF THE YEAR", fill=(255, 87, 34))
    
    # Right floating phone card
    draw.rounded_rectangle([920, 280, 1110, 600], radius=24, fill=(22, 22, 34), outline=(255, 87, 34), width=2)
    draw.rounded_rectangle([940, 310, 1090, 380], radius=10, fill=(35, 35, 55))
    draw.text((955, 335), "LIVE USER ENGAGEMENT", fill=(248, 248, 252))
    draw.ellipse([980, 430, 1050, 500], outline=(139, 92, 246), width=6)
    draw.text((998, 455), "98%", fill=(255, 255, 255))
    draw.text((965, 530), "REAL-TIME SYNC", fill=(196, 181, 253))

    save_optimized_webp(img, 'assets/images/hero-main.webp', max_kb=95)

# 2. Studio / About Images
def generate_about():
    # Studio culture
    img1 = create_base_canvas(900, 600, (12, 12, 20), (22, 18, 32), (C_PURPLE, (200, 200)), (C_ORANGE, (700, 400)))
    d1 = ImageDraw.Draw(img1)
    d1.rounded_rectangle([80, 70, 820, 530], radius=20, fill=(20, 20, 32), outline=(139, 92, 246), width=1)
    d1.text((120, 110), "PIXELCRAFT CREATIVE LAB // SOHO, NYC", fill=(196, 181, 253))
    d1.text((120, 150), "THE INTERSECTION OF CODE & VISUAL POETRY", fill=(255, 255, 255))
    
    # Moodboard collage tiles
    d1.rounded_rectangle([120, 210, 320, 370], radius=14, fill=(45, 32, 68), outline=(139, 92, 246), width=2)
    d1.text((140, 240), "IDENTITY SPRINT", fill=(196, 181, 253))
    d1.text((140, 280), "Typography", fill=(255, 255, 255))
    d1.text((140, 310), "Color Systems", fill=(245, 158, 11))

    d1.rounded_rectangle([340, 210, 540, 490], radius=14, fill=(35, 26, 48), outline=(255, 87, 34), width=2)
    d1.text((360, 240), "3D ASSET ENGINE", fill=(255, 87, 34))
    # render a stylized torus
    for r in range(50, 10, -8):
        d1.ellipse([440-r, 360-r*0.7, 440+r, 360+r*0.7], outline=(255, 87, 34) if r % 16 == 0 else (196, 181, 253), width=2)
    d1.text((360, 440), "WebGL & C4D Renders", fill=(200, 200, 230))

    d1.rounded_rectangle([560, 210, 780, 370], radius=14, fill=(24, 32, 50), outline=(6, 182, 212), width=2)
    d1.text((580, 240), "HUMAN-CENTERED UX", fill=(6, 182, 212))
    d1.text((580, 280), "45+ User Interviews", fill=(255, 255, 255))
    d1.text((580, 310), "Design Architecture", fill=(16, 185, 129))

    d1.rounded_rectangle([120, 390, 320, 490], radius=14, fill=(28, 28, 44))
    d1.text((140, 415), "GLOBAL CLIENTS", fill=(180, 180, 210))
    d1.text((140, 445), "240+ Delivered", fill=(255, 87, 34))

    d1.rounded_rectangle([560, 390, 780, 490], radius=14, fill=(32, 24, 38))
    d1.text((580, 415), "TEAM PASSION", fill=(180, 180, 210))
    d1.text((580, 445), "100% Craftsmanship", fill=(139, 92, 246))

    save_optimized_webp(img1, 'assets/images/about-studio.webp', max_kb=90)

    # Agency collaboration / workspace
    img2 = create_base_canvas(900, 600, (14, 10, 22), (24, 16, 30), (C_ORANGE, (200, 450)), (C_PURPLE, (700, 150)))
    d2 = ImageDraw.Draw(img2)
    d2.rounded_rectangle([80, 70, 820, 530], radius=20, fill=(18, 16, 26), outline=(255, 87, 34), width=1)
    d2.text((120, 110), "OUR MANIFESTO // BOLD, INTENTIONAL, FEARLESS", fill=(255, 87, 34))
    d2.text((120, 150), "WE CRAFT DIGITAL ARTIFACTS THAT COMMAND ATTENTION", fill=(255, 255, 255))
    # Editorial typography columns
    d2.rounded_rectangle([120, 210, 460, 480], radius=14, fill=(28, 22, 38))
    d2.text((140, 240), "PURPOSEFUL STRATEGY", fill=(196, 181, 253))
    d2.text((140, 275), "Every curve, font choice, and interactive cue", fill=(210, 210, 225))
    d2.text((140, 300), "serves an intentional business objective.", fill=(210, 210, 225))
    d2.text((140, 340), "No generic templates.", fill=(255, 87, 34))
    d2.text((140, 370), "No cookie-cutter designs.", fill=(255, 87, 34))
    d2.text((140, 400), "Pure bespoke digital excellence.", fill=(139, 92, 246))

    d2.rounded_rectangle([480, 210, 780, 480], radius=14, fill=(24, 26, 42))
    d2.text((500, 240), "MEASURABLE IMPACT", fill=(16, 185, 129))
    d2.text((500, 275), "Design without conversion is just art.", fill=(210, 210, 225))
    d2.text((500, 300), "We engineer identities that drive revenue,", fill=(210, 210, 225))
    d2.text((500, 325), "elevate valuation, and build die-hard loyalty.", fill=(210, 210, 225))
    d2.text((500, 370), "Average ROI for clients: 3.8x in 12 months.", fill=(255, 255, 255))
    d2.text((500, 410), "5 Industry Accolades won in 2026.", fill=(245, 158, 11))

    save_optimized_webp(img2, 'assets/images/about-culture.webp', max_kb=90)

# 3. Portfolio Projects (10 projects with varied aesthetics)
def generate_portfolio():
    projects = [
        {
            "id": "portfolio-1",
            "title": "Aura Spatial Audio",
            "category": "Branding",
            "color1": C_PURPLE,
            "color2": C_LAVENDER,
            "tag": "BRAND IDENTITY & PACKAGING",
            "icon_type": "wave"
        },
        {
            "id": "portfolio-2",
            "title": "Luminary Financial App",
            "category": "UI/UX Design",
            "color1": C_CYAN,
            "color2": C_PURPLE,
            "tag": "FINTECH MOBILE SYSTEM",
            "icon_type": "chart"
        },
        {
            "id": "portfolio-3",
            "title": "Vortex Autonomous Mobility",
            "category": "Website Design",
            "color1": C_ORANGE,
            "color2": (220, 38, 38),
            "tag": "EDITORIAL EV EXPERIENCE",
            "icon_type": "car"
        },
        {
            "id": "portfolio-4",
            "title": "NeoKyoto Streetwear",
            "category": "Graphic Design",
            "color1": C_ROSE,
            "color2": C_AMBER,
            "tag": "CYBERPUNK VISUAL SYSTEM",
            "icon_type": "type"
        },
        {
            "id": "portfolio-5",
            "title": "Solstice Botanical Elixir",
            "category": "Packaging Design",
            "color1": C_EMERALD,
            "color2": C_AMBER,
            "tag": "ECO-LUXURY CANISTER PACKAGING",
            "icon_type": "bottle"
        },
        {
            "id": "portfolio-6",
            "title": "Pulse Worldwide Festival",
            "category": "Digital Marketing",
            "color1": C_PURPLE,
            "color2": C_ORANGE,
            "tag": "GLOBAL CAMPAIGN & MOTION",
            "icon_type": "pulse"
        },
        {
            "id": "portfolio-7",
            "title": "Chronos Haute Horlogerie",
            "category": "Photography",
            "color1": (212, 175, 55),
            "color2": (100, 80, 20),
            "tag": "STUDIO MACRO PHOTOGRAPHY",
            "icon_type": "watch"
        },
        {
            "id": "portfolio-8",
            "title": "Hyperion AI Workspace",
            "category": "Website Development",
            "color1": (59, 130, 246),
            "color2": C_CYAN,
            "tag": "FULL-STACK SAAS PLATFORM",
            "icon_type": "code"
        },
        {
            "id": "portfolio-9",
            "title": "Komorebi Architecture",
            "category": "Branding",
            "color1": (180, 160, 140),
            "color2": (90, 80, 70),
            "tag": "MONOGRAPH & SPATIAL IDENTITY",
            "icon_type": "arch"
        },
        {
            "id": "portfolio-10",
            "title": "Zenith Avionics HUD",
            "category": "UI/UX Design",
            "color1": (16, 185, 129),
            "color2": (6, 182, 212),
            "tag": "TELEMETRY COCKPIT INTERFACE",
            "icon_type": "hud"
        }
    ]

    for p in projects:
        w, h = 900, 620
        img = create_base_canvas(w, h, (12, 12, 18), (20, 20, 30), (p["color1"], (250, 200)), (p["color2"], (700, 450)))
        d = ImageDraw.Draw(img)
        
        # Outer framing border
        d.rounded_rectangle([30, 30, w-30, h-30], radius=16, outline=(40, 40, 60), width=1)
        
        # Category badge
        badge_box = [60, 60, 280, 95]
        d.rounded_rectangle(badge_box, radius=8, fill=(30, 28, 45), outline=p["color1"], width=1)
        d.text((80, 70), p["category"].upper(), fill=p["color1"])

        # Year stamp
        d.text((w-160, 70), "PROJECT '26", fill=(140, 140, 170))

        # Central Visual Artwork container
        art_box = [60, 120, w-60, 480]
        d.rounded_rectangle(art_box, radius=16, fill=(18, 16, 26), outline=(50, 45, 75), width=2)
        
        cx = (art_box[0] + art_box[2]) // 2
        cy = (art_box[1] + art_box[3]) // 2

        # Draw thematic art based on icon_type
        if p["icon_type"] == "wave":
            for i in range(12):
                x = 150 + i * 50
                ht = max(15, abs(60 + int(70 * math.sin(i * 0.6))))
                d.rounded_rectangle([x, cy - ht, x + 24, cy + ht], radius=min(10, ht), fill=p["color1"] if i%2==0 else p["color2"])
        elif p["icon_type"] == "chart":
            # Fintech graph lines
            pts = [(150, cy+80), (250, cy+20), (350, cy+60), (450, cy-40), (550, cy-10), (650, cy-90), (750, cy-70)]
            d.line(pts, fill=p["color1"], width=5)
            for pt in pts:
                d.ellipse([pt[0]-8, pt[1]-8, pt[0]+8, pt[1]+8], fill=(255, 255, 255), outline=p["color1"], width=2)
            d.rounded_rectangle([cx-100, cy-140, cx+100, cy-80], radius=10, fill=(30, 30, 50), outline=p["color2"], width=2)
            d.text((cx-70, cy-120), "+340.8% YOY", fill=p["color2"])
        elif p["icon_type"] == "car":
            d.ellipse([cx-180, cy-80, cx+180, cy+80], outline=p["color1"], width=4)
            d.line([(cx-220, cy), (cx+220, cy)], fill=p["color2"], width=3)
            d.polygon([(cx, cy-90), (cx+140, cy), (cx, cy+90), (cx-140, cy)], outline=(255, 255, 255), width=2)
        elif p["icon_type"] == "type":
            d.text((cx-170, cy-60), "TOKYO", fill=(255, 87, 34))
            d.text((cx-110, cy-10), "NEO // 2026", fill=C_LAVENDER)
            d.rectangle([cx-190, cy+35, cx+190, cy+40], fill=p["color1"])
        elif p["icon_type"] == "bottle":
            # Bottle silhouette
            d.rounded_rectangle([cx-60, cy-110, cx+60, cy+120], radius=24, outline=p["color1"], width=3)
            d.rectangle([cx-25, cy-150, cx+25, cy-110], fill=p["color2"])
            d.text((cx-40, cy-20), "SOLSTICE", fill=(255, 255, 255))
            d.text((cx-35, cy+10), "ORGANIC", fill=p["color1"])
        elif p["icon_type"] == "pulse":
            d.ellipse([cx-120, cy-120, cx+120, cy+120], outline=p["color1"], width=3)
            d.ellipse([cx-70, cy-70, cx+70, cy+70], outline=p["color2"], width=4)
            d.ellipse([cx-20, cy-20, cx+20, cy+20], fill=(255, 255, 255))
        elif p["icon_type"] == "watch":
            d.ellipse([cx-110, cy-110, cx+110, cy+110], outline=(212, 175, 55), width=6)
            d.line([(cx, cy), (cx+50, cy-40)], fill=(255, 255, 255), width=4)
            d.line([(cx, cy), (cx-30, cy+60)], fill=(212, 175, 55), width=3)
            d.ellipse([cx-10, cy-10, cx+10, cy+10], fill=(212, 175, 55))
        elif p["icon_type"] == "code":
            d.text((cx-140, cy-50), "<PixelCraft.AI>", fill=p["color1"])
            d.text((cx-110, cy-10), "status: OPTIMIZED", fill=C_EMERALD)
            d.text((cx-130, cy+30), "latency: 12ms // 99.9%", fill=p["color2"])
        elif p["icon_type"] == "arch":
            # Architectural geometric grid
            d.line([(cx-150, cy+100), (cx, cy-100), (cx+150, cy+100)], fill=p["color1"], width=3)
            d.line([(cx-150, cy+100), (cx+150, cy+100)], fill=p["color1"], width=2)
            d.line([(cx, cy-100), (cx, cy+100)], fill=p["color2"], width=2)
        elif p["icon_type"] == "hud":
            d.ellipse([cx-130, cy-130, cx+130, cy+130], outline=p["color1"], width=2)
            d.line([(cx-160, cy), (cx+160, cy)], fill=p["color2"], width=2)
            d.line([(cx, cy-160), (cx, cy+160)], fill=p["color2"], width=2)
            d.text((cx+30, cy-100), "ALT: 32,000 FT", fill=p["color1"])
            d.text((cx+30, cy-70), "MACH: 2.4", fill=p["color2"])

        # Bottom info area
        d.text((60, 505), p["title"].upper(), fill=(255, 255, 255))
        d.text((60, 545), p["tag"], fill=p["color1"])
        d.text((w-240, 545), "EXPLORE CASE STUDY ->", fill=p["color2"])

        save_optimized_webp(img, f"assets/images/{p['id']}.webp", max_kb=90)

# 4. Case Study Details Images (extra mockups & wireframes)
def generate_case_study_extras():
    extras = [
        ("case-wireframe", "WIREFRAMING & ARCHITECTURE", C_PURPLE, "UX Mapping & Component Matrix"),
        ("case-moodboard", "COLOR & TYPOGRAPHY SYSTEM", C_ORANGE, "Palette, Grids & Art Direction"),
        ("case-mockup-1", "MOBILE APPLICATION INTERFACE", C_CYAN, "Handheld Touchpoint Flow"),
        ("case-mockup-2", "DESKTOP RESPONSIVE SUITE", C_LAVENDER, "Extended Dashboard & Analytics"),
        ("case-mockup-3", "PHYSICAL & PACKAGING ASSETS", C_EMERALD, "Tangible Brand Experience")
    ]
    for filename, title, color, subtitle in extras:
        w, h = 900, 550
        img = create_base_canvas(w, h, (14, 14, 22), (22, 22, 34), (color, (200, 150)), (C_PURPLE, (700, 400)))
        d = ImageDraw.Draw(img)
        d.rounded_rectangle([30, 30, w-30, h-30], radius=16, fill=(18, 18, 28), outline=color, width=1)
        d.text((70, 70), "PIXELCRAFT CASE STUDY ARTIFACT", fill=(140, 140, 180))
        d.text((70, 110), title, fill=(255, 255, 255))
        d.text((70, 145), subtitle, fill=color)
        
        # Center display box
        d.rounded_rectangle([70, 180, w-70, h-70], radius=12, fill=(25, 25, 40), outline=(45, 45, 70), width=1)
        cx = w // 2
        cy = (180 + h - 70) // 2
        for i in range(5):
            d.rounded_rectangle([cx - 240 + i*100, cy - 60, cx - 160 + i*100, cy + 60], radius=8, fill=(35, 35, 55), outline=color, width=1)
            d.text((cx - 225 + i*100, cy - 10), f"MOD {i+1}", fill=(200, 200, 230))
            
        save_optimized_webp(img, f"assets/images/{filename}.webp", max_kb=85)

# 5. Service Banners (12 services)
def generate_services():
    services = [
        ("service-brand-identity", "Brand Identity Design", C_PURPLE, "Core Narrative & Visual DNA"),
        ("service-logo-design", "Logo Design", C_ORANGE, "Marks, Emblems & Responsive Vector Sets"),
        ("service-website-design", "Website Design", C_CYAN, "Editorial & Immersive Web Layouts"),
        ("service-web-development", "Website Development", (59, 130, 246), "Clean Code, Animations & High Performance"),
        ("service-ui-ux", "UI/UX Design", C_LAVENDER, "Design Systems & Frictionless Journeys"),
        ("service-graphic-design", "Graphic Design", C_ROSE, "Print, Social, Billboards & Marketing Collateral"),
        ("service-social-marketing", "Social Media Marketing", C_AMBER, "Viral Content & Channel Strategy"),
        ("service-digital-marketing", "Digital Marketing", (236, 72, 153), "Performance Ads & Conversion Funnels"),
        ("service-motion-graphics", "Motion Graphics", C_PURPLE, "2D/3D Kinetic Type & Video Animations"),
        ("service-photography", "Photography & Videography", (212, 175, 55), "Commercial Studio & Lifestyle Production"),
        ("service-packaging-design", "Packaging Design", C_EMERALD, "Unboxing Experiences & Structural Design"),
        ("service-creative-strategy", "Creative Strategy", C_ORANGE, "Market Positioning & Trend Forecasting")
    ]
    for filename, title, color, desc in services:
        w, h = 800, 500
        img = create_base_canvas(w, h, (13, 13, 20), (22, 18, 30), (color, (150, 120)), (C_PURPLE, (650, 380)))
        d = ImageDraw.Draw(img)
        d.rounded_rectangle([25, 25, w-25, h-25], radius=16, fill=(18, 17, 28), outline=color, width=1)
        
        # Service icon circular badge
        d.ellipse([60, 60, 130, 130], fill=(30, 25, 45), outline=color, width=2)
        d.ellipse([85, 85, 105, 105], fill=color)
        
        d.text((160, 68), "PIXELCRAFT CORE CAPABILITY", fill=(150, 150, 180))
        d.text((160, 95), title.upper(), fill=(255, 255, 255))
        
        # Central preview graphic
        d.rounded_rectangle([60, 160, w-60, 420], radius=12, fill=(24, 22, 38), outline=(45, 40, 65), width=1)
        d.text((90, 190), desc, fill=color)
        
        # Geometric visual accents
        cx = (60 + w - 60) // 2
        cy = 300
        for rad in (60, 40, 20):
            d.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], outline=color if rad==40 else (120, 120, 160), width=2)
        d.line([(cx - 120, cy), (cx + 120, cy)], fill=(255, 255, 255), width=2)

        save_optimized_webp(img, f"assets/images/{filename}.webp", max_kb=80)

# 6. Team Member Portraits (6 members)
def generate_team():
    members = [
        ("team-1", "Elena Vance", "Creative Director & Founder", C_PURPLE, C_ORANGE),
        ("team-2", "Marcus Thorne", "Lead UI/UX Designer", C_CYAN, C_PURPLE),
        ("team-3", "Sophia Chen", "Senior Brand Identity Strategist", C_ORANGE, C_LAVENDER),
        ("team-4", "Alex Rivera", "Lead Full-Stack Web Developer", (59, 130, 246), C_EMERALD),
        ("team-5", "Liam O'Connor", "Commercial Photographer & Art Director", (212, 175, 55), C_PURPLE),
        ("team-6", "Maya Patel", "Digital Marketing & Content Lead", C_ROSE, C_AMBER)
    ]
    for filename, name, role, color1, color2 in members:
        w, h = 600, 600
        img = create_base_canvas(w, h, (12, 12, 18), (22, 18, 30), (color1, (200, 200)), (color2, (450, 450)))
        d = ImageDraw.Draw(img)
        d.rounded_rectangle([20, 20, w-20, h-20], radius=20, fill=(18, 17, 26), outline=color1, width=2)
        
        # Stylized portrait silhouette avatar
        cx, cy = w // 2, 240
        # Head
        d.ellipse([cx-75, cy-90, cx+75, cy+60], fill=(42, 38, 58), outline=color1, width=2)
        # Hair / hat accent
        d.chord([cx-80, cy-110, cx+80, cy+10], start=180, end=360, fill=color1)
        # Glasses or eyes accent
        d.rectangle([cx-40, cy-30, cx-10, cy-15], fill=color2)
        d.rectangle([cx+10, cy-30, cx+40, cy-15], fill=color2)
        d.line([(cx-10, cy-22), (cx+10, cy-22)], fill=(255, 255, 255), width=2)
        # Shoulders / Torso
        d.pieslice([cx-140, cy+30, cx+140, cy+270], start=180, end=360, fill=(30, 28, 44), outline=color2, width=2)
        
        # Name and role badge
        d.rounded_rectangle([40, 440, w-40, 550], radius=12, fill=(26, 24, 38), outline=(60, 50, 80), width=1)
        d.text((60, 460), name.upper(), fill=(255, 255, 255))
        d.text((60, 495), role, fill=color1)
        d.text((60, 520), "PIXELCRAFT STUDIO CORE", fill=color2)

        save_optimized_webp(img, f"assets/images/{filename}.webp", max_kb=75)

# 7. Blog Featured Images (6 articles)
def generate_blogs():
    blogs = [
        ("blog-1", "The Evolution of Spatial UI: Beyond Flat Interfaces", "Design Trends", C_PURPLE),
        ("blog-2", "Branding in the Age of Generative Intelligence", "Branding", C_ORANGE),
        ("blog-3", "Mastering Micro-Interactions: The Secret to Addictive UX", "UI/UX", C_CYAN),
        ("blog-4", "Typography as Voice: How Typefaces Shape Perception", "Creative Inspiration", C_ROSE),
        ("blog-5", "Maximizing Organic Reach with Creative Visual Strategy", "Digital Marketing", C_AMBER),
        ("blog-6", "Sustainable Web Design: Crafting Fast, Low-Carbon Sites", "Web Development", C_EMERALD)
    ]
    for filename, title, category, color in blogs:
        w, h = 800, 500
        img = create_base_canvas(w, h, (12, 12, 18), (20, 20, 30), (color, (180, 150)), (C_PURPLE, (650, 350)))
        d = ImageDraw.Draw(img)
        d.rounded_rectangle([25, 25, w-25, h-25], radius=16, fill=(18, 17, 28), outline=color, width=1)
        
        # Category badge
        d.rounded_rectangle([55, 55, 240, 90], radius=8, fill=(32, 28, 48), outline=color, width=1)
        d.text((75, 66), category.upper(), fill=color)
        d.text((w-200, 66), "EDITORIAL ARTICLE", fill=(140, 140, 170))
        
        # Central graphic
        d.rounded_rectangle([55, 120, w-55, 360], radius=12, fill=(24, 22, 38))
        cx, cy = w // 2, 240
        for i in range(4):
            d.rectangle([cx - 180 + i*90, cy - 40, cx - 110 + i*90, cy + 40], outline=color if i%2==0 else (196, 181, 253), width=2)
        d.ellipse([cx-15, cy-15, cx+15, cy+15], fill=color)
        
        # Title snippet
        d.text((55, 395), title[:38] + ("..." if len(title)>38 else ""), fill=(255, 255, 255))
        d.text((55, 430), "5 MIN READ // BY PIXELCRAFT EDITORIAL TEAM", fill=(160, 160, 190))

        save_optimized_webp(img, f"assets/images/{filename}.webp", max_kb=80)

# 8. Favicon and Studio Logo SVG
def generate_icons():
    # Logo SVG with creative lightning / pixel craft mark
    logo_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 48" width="200" height="48" fill="none">
  <defs>
    <linearGradient id="pcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#ff5722" />
    </linearGradient>
  </defs>
  <rect x="2" y="4" width="40" height="40" rx="10" fill="url(#pcGrad)" />
  <rect x="8" y="10" width="12" height="12" rx="3" fill="#ffffff" />
  <rect x="24" y="10" width="12" height="12" rx="3" fill="#0b0b12" />
  <rect x="8" y="26" width="12" height="12" rx="3" fill="#0b0b12" />
  <rect x="24" y="26" width="12" height="12" rx="3" fill="#ffffff" />
  <text x="54" y="26" font-family="'Syne', 'Inter', sans-serif" font-size="20" font-weight="800" fill="#ffffff" letter-spacing="0.5">PixelCraft</text>
  <text x="54" y="40" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="600" fill="#c4b5fd" letter-spacing="2">STUDIO</text>
</svg>'''
    with open('assets/icons/logo.svg', 'w', encoding='utf-8') as f:
        f.write(logo_svg)

    # Favicon SVG
    favicon_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
  <defs>
    <linearGradient id="favGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#ff5722" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#favGrad)" />
  <rect x="12" y="12" width="18" height="18" rx="4" fill="#ffffff" />
  <rect x="34" y="12" width="18" height="18" rx="4" fill="#0b0b12" />
  <rect x="12" y="34" width="18" height="18" rx="4" fill="#0b0b12" />
  <rect x="34" y="34" width="18" height="18" rx="4" fill="#ffffff" />
</svg>'''
    with open('assets/icons/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(favicon_svg)
    print("Generated SVG icons.")

if __name__ == '__main__':
    print("Starting asset generation...")
    generate_hero()
    generate_about()
    generate_portfolio()
    generate_case_study_extras()
    generate_services()
    generate_team()
    generate_blogs()
    generate_icons()
    print("All assets generated successfully!")

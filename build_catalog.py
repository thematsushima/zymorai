import json
from pathlib import Path

OUT = Path(__file__).parent
ASSETS = OUT / "assets"

ELEMENTS = {
  "Ember": ("#f05b35", "#ffcd58", ["Cindlet", "Brastle", "Flarrow", "Kindlup", "Scorcha", "Pyrroo", "Ashwink", "Voltaur", "Blazetail", "Sparkrill", "Charwhisp", "Corkinder", "Magmaw", "Suncinder", "Torchbit"], "warm-hearted, bold, and easily excited", "heat, courage, and bright kinetic bursts", ["Kindle Kick", "Cinder Spiral", "Hearth Roar"]),
  "Tide": ("#2476b9", "#88e4ef", ["Dripple", "Coralloo", "Mistray", "Rillfin", "Tidereen", "Bubblit", "Neressa", "Pluvet", "Swellpaw", "Kelpip", "Marimink", "Currentle", "Aqualyn", "Foamlet", "Lunatide"], "gentle, adaptable, and quietly observant", "flow, soothing currents, and mist", ["Ripple Ring", "Moonwash", "Current Curl"]),
  "Moss": ("#4d8c4a", "#c7e58a", ["Mossprig", "Fernkin", "Bramblet", "Cloveroo", "Thistail", "Barkbit", "Petalune", "Vinepuff", "Acornix", "Bloomble", "Lichenling", "Rosetail", "Tanglepod", "Nectari", "Grovebun"], "patient, caring, and stubbornly hopeful", "growth, roots, and restorative pollen", ["Bramble Brace", "Pollen Puff", "Rootstep"]),
  "Gale": ("#7ca7c8", "#e8fbff", ["Wispin", "Gustle", "Zephroo", "Cloudet", "Whirlet", "Breezard", "Aeralyn", "Fluffern", "Kitebit", "Swoopet", "Hushwing", "Driftail", "Vapora", "Skysprig", "Puffloon"], "curious, quick-witted, and freedom-loving", "wind paths, gliding, and sound", ["Whistlewind", "Feather Dash", "Cloudskip"]),
  "Stone": ("#756b65", "#d8be92", ["Pebblin", "Craggle", "Flintuff", "Bouldra", "Gritbit", "Shalebun", "Cairnox", "Gravello", "Basalisk", "Rubblet", "Quarrim", "Cobbleroo", "Dusthorn", "Terrafin", "Monolith"], "reliable, protective, and unhurried", "shielding earth, resonance, and endurance", ["Cairn Guard", "Rumble Roll", "Granite Hush"]),
  "Lumen": ("#e5a733", "#fff6a5", ["Glimlet", "Rayroo", "Solbit", "Lucerna", "Dazzlepup", "Prismink", "Haloam", "Goldfinch", "Flickeray", "Aureli", "Sunmoth", "Beamble", "Shimmeron", "Daybloom", "Lustrella"], "generous, upbeat, and impossible to ignore", "light, morale, and cleansing warmth", ["Beacon Bloom", "Golden Glint", "Sunstep"]),
  "Dusk": ("#3e2b65", "#ad8ae7", ["Murklet", "Velvetta", "Nocturn", "Gloamoo", "Umbrafin", "Duskmew", "Echowisp", "Nyxling", "Shadowlark", "Vespera", "Inkbit", "Moondrift", "Hushcat", "Twilix", "Stellashade"], "thoughtful, private, and surprisingly playful with trusted friends", "shadows, echoes, and starlit concealment", ["Velvet Veil", "Echo Nudge", "Nightglow"]),
  "Spark": ("#d69b17", "#fff074", ["Zapple", "Voltkit", "Crackleon", "Fizbit", "Ampuff", "Joltrix", "Sizzlebee", "Flashpaw", "Rumblebug", "Kinetik", "Charglet", "Blinkit", "Tessaroo", "Zingfin", "Stormip"], "mischievous, inventive, and always in motion", "electric pulses, speed, and magnetic tricks", ["Static Skip", "Bright Bolt", "Magnet Mingle"]),
  "Frost": ("#6aaacb", "#dffaff", ["Frostell", "Glacibun", "Chillip", "Icelyn", "Rimekit", "Snowlark", "Crystaloo", "Flurrbit", "Boreal", "Hailhop", "Wintero", "Sleetail", "Polarpuff", "Shardlet", "Nivalis"], "calm, precise, and loyal once they choose you", "cooling air, crystal shields, and patient focus", ["Rime Ribbon", "Crystal Curl", "Stillflake"]),
  "Bloom": ("#cf668e", "#ffd0e0", ["Rosette", "Poppin", "Lilabee", "Dahlit", "Peonix", "Mallowmew", "Irisprig", "Zinniax", "Camelloo", "Tulipup", "Fuchsi", "Orchidot", "Bloomkin", "Safflet", "Magnolia"], "expressive, affectionate, and artistically brave", "fragrance, colour, and mood-lifting spores", ["Petal Pop", "Scentwave", "Ribbon Bloom"]),
  "Astral": ("#3d3b80", "#a5d8ff", ["Cometip", "Orbiton", "Nebblin", "Quasari", "Stardrop", "Cosmix", "Lunari", "Asterbit", "Novaroo", "Eclipset", "Galaxin", "Meteoroo", "Pulsarim", "Voidlet", "Aurorune"], "imaginative, serene, and drawn to the unknown", "gravity wisps, constellation maps, and dreamlight", ["Orbit Orb", "Startrail", "Gravity Giggle"]),
}

SHAPES = ["round", "leaf", "wing", "horn", "fin", "tail", "ear", "orb"]
records = []
for element, (primary, accent, names, personality, power, attacks) in ELEMENTS.items():
    for i, name in enumerate(names):
        idx = len(records) + 1
        form = SHAPES[i % len(SHAPES)]
        png_name = f"assets/{idx:03d}-{name.lower()}.png"
        image_name = png_name if (OUT / png_name).exists() else f"assets/{idx:03d}-{name.lower()}.svg"
        creature = {
            "number": idx, "name": name, "element": element, "personality": personality,
            "powers": power, "signatureMoves": [attacks[i % 3], f"{name} {['Whirl', 'Pulse', 'Pounce', 'Bloom', 'Beacon'][i % 5]}"],
            "image": image_name, "form": form, "colors": {"primary": primary, "accent": accent}
        }
        records.append(creature)
        eye_y = 250 + (i % 3) * 5
        extras = {
          "round": f'<circle cx="256" cy="265" r="138" fill="{primary}"/><path d="M150 165 Q190 95 218 150 M294 150 Q330 95 365 165" fill="none" stroke="{accent}" stroke-width="28" stroke-linecap="round"/>',
          "leaf": f'<path d="M110 350 Q110 105 365 115 Q395 345 170 395 Q125 390 110 350" fill="{primary}"/><path d="M160 355 Q250 255 340 150" stroke="{accent}" stroke-width="18" fill="none"/>',
          "wing": f'<ellipse cx="256" cy="270" rx="120" ry="135" fill="{primary}"/><path d="M155 255 Q55 150 105 365 Q155 350 195 310 M357 255 Q457 150 407 365 Q357 350 317 310" fill="{accent}"/>',
          "horn": f'<ellipse cx="256" cy="275" rx="130" ry="130" fill="{primary}"/><path d="M180 165 L160 70 L235 145 M332 165 L352 70 L277 145" fill="{accent}"/>',
          "fin": f'<ellipse cx="256" cy="275" rx="145" ry="120" fill="{primary}"/><path d="M120 285 Q55 200 85 360 L160 345 M392 285 Q457 200 427 360 L352 345" fill="{accent}"/>',
          "tail": f'<circle cx="235" cy="265" r="132" fill="{primary}"/><path d="M335 315 Q475 330 410 420 Q360 380 300 370" fill="{accent}"/>',
          "ear": f'<ellipse cx="256" cy="280" rx="125" ry="132" fill="{primary}"/><path d="M170 175 Q110 55 210 135 M342 175 Q402 55 302 135" fill="{accent}"/>',
          "orb": f'<circle cx="256" cy="270" r="135" fill="{primary}"/><circle cx="145" cy="160" r="28" fill="{accent}"/><circle cx="367" cy="150" r="18" fill="{accent}"/><circle cx="390" cy="365" r="23" fill="{accent}"/>',
        }[form]
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="{name}, a {element} pocket creature"><defs><radialGradient id="bg"><stop stop-color="{accent}" stop-opacity=".48"/><stop offset="1" stop-color="{primary}" stop-opacity=".08"/></radialGradient></defs><rect width="512" height="512" rx="64" fill="url(#bg)"/>{extras}<ellipse cx="210" cy="{eye_y}" rx="16" ry="23" fill="#172033"/><ellipse cx="300" cy="{eye_y}" rx="16" ry="23" fill="#172033"/><circle cx="205" cy="{eye_y-7}" r="5" fill="white"/><circle cx="295" cy="{eye_y-7}" r="5" fill="white"/><path d="M232 310 Q256 332 280 310" stroke="#172033" stroke-width="10" fill="none" stroke-linecap="round"/><text x="256" y="465" text-anchor="middle" font-family="system-ui, sans-serif" font-size="25" font-weight="800" fill="#172033">{name}</text></svg>'''
        (ASSETS / f"{idx:03d}-{name.lower()}.svg").write_text(svg)

assert len(records) == 165
# The first-generation-sized Atlas contains the first 151 catalogued creatures; later entries are reserved for expansion.
records = records[:151]
catalog = {"universe": "The Zymorai Atlas", "count": len(records), "elements": list(ELEMENTS), "creatures": records}
(OUT / "catalog.json").write_text(json.dumps(catalog, indent=2))
(OUT / "data.js").write_text("export const ATLAS = " + json.dumps(catalog, separators=(",", ":")) + ";\n")
visual_variations = [
    "small and round with oversized expressive eyes", "long-bodied with a curling tail", "four-legged with a proud little crest",
    "winged and airborne in a lively three-quarter pose", "low to the ground with layered protective plates",
    "soft and fluffy with floating motes around it", "slender and curious with an asymmetrical silhouette",
    "compact and sturdy with a luminous core", "graceful with ribbon-like appendages", "tiny but fearless with oversized paws",
    "owl-like with a wise tilted head", "otter-like with playful flowing motion", "moth-like with translucent patterned wings",
    "deer-like with branching details", "a rare guardian form with an elegant magical aura"
]
element_details = {
    "Ember": "volcanic charcoal textures, amber glow and tiny sparks", "Tide": "iridescent water, sea-glass highlights and curling droplets",
    "Moss": "velvet moss, leaves, roots and small flowers", "Gale": "airy down, cloud wisps and translucent wind ribbons",
    "Stone": "weathered rock, mineral seams and warm clay", "Lumen": "golden light, prism glints and sunlit filaments",
    "Dusk": "inky velvet, moonlit edges and quiet star-specks", "Spark": "charged fur, copper details and little static arcs",
    "Frost": "clear ice crystals, snow-dust and pale blue glow", "Bloom": "petals, nectar hues and delicate pollen lights",
    "Astral": "deep-space shimmer, constellation flecks and gravity wisps"
}
batch_dir = Path("tmp/imagegen")
batch_dir.mkdir(parents=True, exist_ok=True)
jobs = []
for c in records:
    if (OUT / f"assets/{c['number']:03d}-{c['name'].lower()}.png").exists():
        continue
    prompt = f'''Use case: stylized-concept\nAsset type: individual collectible creature portrait for the Zymorai Atlas\nPrimary request: {c['name']}, an original {c['element']}-element pocket creature.\nSubject: {visual_variations[(c['number'] - 1) % len(visual_variations)]}; materials and elemental details: {element_details[c['element']]}. Its character is {c['personality']}.\nStyle/medium: high-detail polished hand-painted 2D game concept art, lush magical field-guide quality.\nComposition/framing: full body, centered, readable three-quarter pose, isolated on a genuinely transparent background.\nLighting/mood: enchanting element-matched glow, warm and collectible.\nConstraints: wholly original creature design; no Pokémon characters, names, designs, Poké Balls, text, logos, watermark, frame, or scenery.'''
    jobs.append({"prompt": prompt, "out": f"{c['number']:03d}-{c['name'].lower()}.png", "model": "gpt-image-1.5", "size": "1024x1024", "quality": "high", "background": "transparent", "output_format": "png", "use_case": "stylized-concept"})
(batch_dir / "zymorai-prompts.jsonl").write_text("\n".join(json.dumps(job) for job in jobs) + "\n")
print(f"Prepared {len(jobs)} detailed image prompts")
print(f"Wrote {len(records)} catalog entries and {len(list(ASSETS.glob('*.svg')))} creature portraits")

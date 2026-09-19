"""Export the Instagram photos (@rilast_erisilk_weaving_khweng) as WebP sizes.
Run: python tools/process_images.py
"""
import json, os
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'source-photos', 'instagram')
OUT = os.path.join(ROOT, 'public', 'img')
os.makedirs(OUT, exist_ok=True)

NAMES = {}
for i in range(6): NAMES[f'indigo-{i+1}'] = f'p_DZ-RIUpE89B_{i}.jpg'
for i in range(8): NAMES[f'lavender-{i+1}'] = f'p_DZ64tIGk3kM_{i}.jpg'
process = ['loom-pair', 'dye-leaves', 'yarn-skein', 'spinning-mill', 'bobbins', 'warping-wheel', 'warp-pink', 'weaving-pink', 'stole-rack']
for i, n in enumerate(process): NAMES[n] = f'p_DaAyMQqk9-I_{i}.jpg'
award = ['award-stage', 'award-certificate-pair', 'award-tourism-day', 'award-ceremony', 'award-certificate', 'award-trophy']
for i, n in enumerate(award): NAMES[n] = f'p_DPL6v_1k2MT_{i}.webp'
NAMES.update({
    'shawl-motif-pink': 'p_Daj0w0ey1EO_0.jpg',
    'stoles-showroom': 'p_DaUjJWsziJD_0.jpg',
    'jainsem-ivory-border': 'p_DaRoTujppo__0.jpg',
    'showroom-ivory': 'p_DaPDgcOpK7D_0.jpg',
    'jainsem-ivory-model': 'p_DaKf-4RT49J_0.jpg',
    'lavender-reel': 'p_DZxLy5ApmgO_0.jpg',
})

# Stills of each Jainsem from the collection reel (DaRoTujppo_), one per piece
REEL = os.path.join(ROOT, 'source-photos', 'reel')
for f in sorted(os.listdir(REEL)):
    NAMES[f[:-4]] = os.path.join('..', 'reel', f)

# The trophy, cropped and graded (source-photos/edited)
NAMES['award-trophy'] = os.path.join('..', 'edited', 'award-trophy.jpg')  # award-trophy-edited

manifest = {}
for name, file in NAMES.items():
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, file))).convert('RGB')
    widths = [w for w in (480, 800, 1280, 1920) if w <= im.width] or [im.width]
    if im.width > widths[-1] + 200 and widths[-1] < 1920:
        widths.append(min(im.width, 1920))
    for w in widths:
        im.resize((w, round(w / im.width * im.height)), Image.LANCZOS).save(os.path.join(OUT, f'{name}-{w}.webp'), 'WEBP', quality=78, method=6)
    manifest[name] = {'widths': widths, 'ratio': round(im.width / im.height, 4)}

os.makedirs(os.path.join(ROOT, 'src', 'data'), exist_ok=True)
json.dump(manifest, open(os.path.join(ROOT, 'src', 'data', 'images.json'), 'w'), indent=1)
print(len(manifest), 'images')

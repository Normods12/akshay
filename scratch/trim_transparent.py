import os
from PIL import Image

def trim(path):
    img = Image.open(path).convert("RGBA")
    bbox = img.getbbox()
    if bbox:
        trimmed = img.crop(bbox)
        trimmed.save(path, "PNG")
        alt_path = path.replace("public/icons", "icons") if "public/icons" in path else path.replace("icons", "public/icons")
        trimmed.save(alt_path, "PNG")
        print(f"Trimmed {os.path.basename(path)} to bounding box {trimmed.size}")

for name in ['saturn.png', 'north-node.png', 'south-node.png']:
    trim(f'/Users/saikiran/Documents/akshay-client/public/icons/{name}')

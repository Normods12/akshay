import os
import numpy as np
from PIL import Image, ImageFilter

def smooth_alpha(path):
    img = Image.open(path).convert("RGBA")
    r, g, b, a = img.split()
    
    # Feather / anti-alias hard alpha edges
    a_blurred = a.filter(ImageFilter.GaussianBlur(1.0))
    
    smoothed_img = Image.merge("RGBA", (r, g, b, a_blurred))
    smoothed_img.save(path, "PNG")
    alt_path = path.replace("public/icons", "icons") if "public/icons" in path else path.replace("icons", "public/icons")
    smoothed_img.save(alt_path, "PNG")
    print(f"Anti-aliased {os.path.basename(path)}")

for name in ['saturn.png', 'north-node.png', 'south-node.png']:
    smooth_alpha(f'/Users/saikiran/Documents/akshay-client/public/icons/{name}')

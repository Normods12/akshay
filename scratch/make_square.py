import os
from PIL import Image

def make_square(path):
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    max_dim = max(w, h)
    
    # Create square canvas with transparent background
    square_img = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
    
    # Paste centered
    offset_x = (max_dim - w) // 2
    offset_y = (max_dim - h) // 2
    square_img.paste(img, (offset_x, offset_y), img)
    
    square_img.save(path, "PNG")
    alt_path = path.replace("public/icons", "icons") if "public/icons" in path else path.replace("icons", "public/icons")
    square_img.save(alt_path, "PNG")
    print(f"Padded {os.path.basename(path)} to square {max_dim}x{max_dim}")

for name in ['saturn.png', 'north-node.png', 'south-node.png']:
    make_square(f'/Users/saikiran/Documents/akshay-client/public/icons/{name}')

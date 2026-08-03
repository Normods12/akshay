import os
import glob
import numpy as np
from PIL import Image

def clean_icon(path):
    img = Image.open(path).convert("RGBA")
    arr = np.array(img, dtype=np.float32)
    h, w, c = arr.shape
    
    # Extract RGB
    rgb = arr[:, :, :3]
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]

    # Sample corners (top-left, top-right, bottom-left, bottom-right 30x30 areas)
    corners = np.concatenate([
        rgb[:30, :30].reshape(-1, 3),
        rgb[:30, -30:].reshape(-1, 3),
        rgb[-30:, :30].reshape(-1, 3),
        rgb[-30:, -30:].reshape(-1, 3)
    ], axis=0)
    
    bg_color = np.median(corners, axis=0)
    print(f"Processing {os.path.basename(path)} ({w}x{h}), estimated BG color: {bg_color}")

    # Color difference from background color
    diff = np.sqrt(np.sum((rgb - bg_color) ** 2, axis=2))
    
    # Check if corner is grey checkerboard (e.g. bg_color close to (110..130, 110..130, 110..130))
    is_checkerboard = np.all(bg_color > 80) and np.all(bg_color < 160)
    
    if is_checkerboard:
        # In checkerboard images, the background pixels alternate between two grey colors (~100-115 and ~125-140)
        # or have very low saturation (R ~= G ~= B)
        saturation = np.max(rgb, axis=2) - np.min(rgb, axis=2)
        
        # Checkerboard pixels are grey (saturation < 15) and brightness between 80 and 160
        brightness = np.mean(rgb, axis=2)
        is_bg = (saturation < 18) & (brightness > 60) & (brightness < 180)
        
        # Create alpha channel
        alpha = np.where(is_bg, 0, 255).astype(np.uint8)
    else:
        # Dark/Black background
        # Pixels with diff < threshold are transparent
        # For smooth edges, transition alpha from 0 to 255 between diff=8 and diff=35
        alpha = np.clip((diff - 8) / 27.0 * 255.0, 0, 255).astype(np.uint8)
    
    # Construct output RGBA array
    out_arr = np.zeros_like(arr, dtype=np.uint8)
    out_arr[:, :, :3] = np.array(rgb, dtype=np.uint8)
    out_arr[:, :, 3] = alpha

    # Save output
    out_img = Image.fromarray(out_arr, mode="RGBA")
    
    # Crop to non-transparent bounding box
    bbox = out_img.getbbox()
    if bbox:
        out_img = out_img.crop(bbox)
        
    out_path = path
    out_img.save(out_path, "PNG")
    print(f"Saved {os.path.basename(out_path)}, cropped size: {out_img.size}")

for path in glob.glob('/Users/saikiran/Documents/akshay-client/public/icons/*.png'):
    clean_icon(path)

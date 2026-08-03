import os
import numpy as np
from PIL import Image
from collections import deque

def restore_with_floodfill(path):
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    h, w, _ = arr.shape

    rgb = arr[:, :, :3].astype(np.float32)

    # Corner reference color
    corner_color = rgb[0, 0]

    # Create visited mask for floodfill
    visited = np.zeros((h, w), dtype=bool)

    # Color distance tolerance for background floodfill
    # Background in transparent PNGs with default RGB filling is very uniform (e.g. within tolerance 15)
    queue = deque()
    
    # Add all edge pixels that match corner color
    for r in range(h):
        for c in [0, w-1]:
            if np.linalg.norm(rgb[r, c] - corner_color) < 25.0:
                queue.append((r, c))
                visited[r, c] = True
                
    for c in range(w):
        for r in [0, h-1]:
            if not visited[r, c] and np.linalg.norm(rgb[r, c] - corner_color) < 25.0:
                queue.append((r, c))
                visited[r, c] = True

    # 4-connectivity floodfill
    dr = [-1, 1, 0, 0]
    dc = [0, 0, -1, 1]

    while queue:
        r, c = queue.popleft()
        for i in range(4):
            nr, nc = r + dr[i], c + dc[i]
            if 0 <= nr < h and 0 <= nc < w and not visited[nr, nc]:
                if np.linalg.norm(rgb[nr, nc] - corner_color) < 25.0:
                    visited[nr, nc] = True
                    queue.append((nr, nc))

    # All visited pixels are true background -> alpha = 0
    # All unvisited pixels are planet/node subject -> alpha = 255
    new_alpha = np.where(visited, 0, 255).astype(np.uint8)

    arr[:, :, 3] = new_alpha

    out_img = Image.fromarray(arr, mode="RGBA")
    
    # Save to public/icons/ and icons/
    out_img.save(path, "PNG")
    alt_path = path.replace("public/icons", "icons") if "public/icons" in path else path.replace("icons", "public/icons")
    out_img.save(alt_path, "PNG")
    
    print(f"Restored {os.path.basename(path)}: subject pixel count = {np.sum(new_alpha == 255)}")

for name in ['saturn.png', 'north-node.png', 'south-node.png']:
    restore_with_floodfill(f'/Users/saikiran/Documents/akshay-client/public/icons/{name}')

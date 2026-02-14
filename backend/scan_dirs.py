import os

def count_subdirs(path):
    try:
        return [d for d in os.listdir(path) if os.path.isdir(os.path.join(path, d))]
    except OSError:
        return []

root_dir = "/Users/pegasus/Downloads"
print(f"Scanning {root_dir} for datasets with ~50 classes...")

for root, dirs, files in os.walk(root_dir):
    # Limit depth to avoid scanning node_modules deeply
    depth = root[len(root_dir):].count(os.sep)
    if depth > 3:
        continue
        
    subdirs = count_subdirs(root)
    count = len(subdirs)
    
    if 40 <= count <= 60:
        print(f"MATCH FOUND: {root} has {count} subdirectories.")
        print(f"Classes: {sorted(subdirs)}")

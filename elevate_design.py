import os
import glob
import re

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # 1. Colors - Move to stark, ultra-premium monochrome + amber accents
    content = content.replace('bg-stone-50', 'bg-zinc-50')
    content = content.replace('bg-stone-100', 'bg-zinc-100')
    content = content.replace('bg-stone-900', 'bg-black')
    content = content.replace('text-stone-900', 'text-black')
    content = content.replace('text-stone-800', 'text-zinc-900')
    content = content.replace('text-stone-600', 'text-zinc-600')
    content = content.replace('text-stone-500', 'text-zinc-500')
    content = content.replace('border-stone-200', 'border-zinc-200')
    content = content.replace('border-stone-300', 'border-zinc-300')
    
    # Amber adjustments for deeper luxury
    content = content.replace('text-amber-700', 'text-amber-600')
    content = content.replace('bg-amber-700', 'bg-black')
    content = content.replace('hover:bg-amber-400', 'hover:bg-amber-600')
    
    # 2. Border Radii - Remove bubbly curves, make it sharp/architectural
    content = content.replace('rounded-2xl', 'rounded-none')
    content = content.replace('rounded-xl', 'rounded-sm')
    content = content.replace('rounded-lg', 'rounded-sm')
    content = content.replace('rounded-3xl', 'rounded-none')
    
    # 3. Enhance shadows for a flat, brutalist/modern feel
    content = content.replace('shadow-2xl', 'shadow-2xl shadow-black/10')
    content = content.replace('shadow-xl', 'shadow-xl shadow-black/5')
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

files_to_update = glob.glob('src/**/*.tsx', recursive=True)
count = 0
for f in files_to_update:
    if update_file(f):
        count += 1

print(f"Elevated {count} files to ultra-premium architectural design.")

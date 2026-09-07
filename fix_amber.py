import os
import glob
import re

replacements = {
    r'\btext-amber-200\b': 'text-amber-800',
    r'\btext-amber-300\b': 'text-amber-700',
    r'\btext-amber-400\b': 'text-amber-700',
    r'\btext-amber-500\b': 'text-amber-600',
    r'\btext-amber-500/80\b': 'text-amber-600/80',
    r'\bbg-stone-900/90\b': 'bg-white/90',
    r'\bbg-stone-950/80\b': 'bg-stone-50/80',
    r'\bbg-stone-800/80\b': 'bg-stone-100/80',
    r'\bbg-stone-900/50\b': 'bg-white/50',
    r'\bbg-stone-950/50\b': 'bg-stone-50/50',
    r'\bborder-stone-800/80\b': 'border-stone-200/80',
    r'\bshadow-stone-950/50\b': 'shadow-stone-200/50',
    r'\bbg-amber-400/10\b': 'bg-amber-600/10',
    r'\bbg-amber-500/20\b': 'bg-amber-600/10',
    r'\bbg-amber-500/10\b': 'bg-amber-600/10',
    r'\bfrom-stone-950/80\b': 'from-stone-50/80',
    r'\bto-stone-950/0\b': 'to-stone-50/0',
    r'\bgrowing-ring border-amber-500/30\b': 'growing-ring border-amber-600/30'
}

files = glob.glob('src/components/**/*.tsx', recursive=True)
files.append('src/App.tsx')

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content)

    with open(file, 'w') as f:
        f.write(content)

print("Amber and opacity theme fixed successfully!")

import os
import glob
import re

replacements = {
    r'\bbg-stone-950\b': 'bg-stone-50',
    r'\bbg-stone-900\b': 'bg-white',
    r'\bbg-stone-800\b': 'bg-stone-100',
    r'\bbg-stone-700\b': 'bg-stone-200',
    r'\bborder-stone-800\b': 'border-stone-200',
    r'\bborder-stone-700\b': 'border-stone-300',
    r'\bborder-stone-600\b': 'border-stone-300',
    r'\btext-stone-100\b': 'text-stone-900',
    r'\btext-stone-200\b': 'text-stone-800',
    r'\btext-stone-300\b': 'text-stone-600',
    r'\btext-stone-400\b': 'text-stone-500',
    r'\btext-stone-500\b': 'text-stone-500',
    r'\bhover:bg-stone-800\b': 'hover:bg-stone-100',
    r'\bhover:bg-stone-900\b': 'hover:bg-stone-50',
    r'\btext-amber-400\b': 'text-amber-700',
    r'\btext-amber-500\b': 'text-amber-600',
    r'\bbg-amber-500\b': 'bg-amber-600',
    r'\bbg-amber-600\b': 'bg-amber-700',
    r'\bfrom-stone-950\b': 'from-stone-50',
    r'\bto-stone-900\b': 'to-white',
    r'\bvia-stone-900\b': 'via-white',
    r'\bfrom-stone-900\b': 'from-white',
    r'\bto-stone-950\b': 'to-stone-50',
    r'\bvia-stone-950\b': 'via-stone-50',
    r'\bfrom-amber-950\b': 'from-amber-50',
    r'\bvia-amber-950\b': 'via-amber-50',
    r'\bto-amber-950\b': 'to-amber-50',
    r'\btext-white\b': 'text-stone-900', # Careful with this one if it's on a dark button
    r'\bfrom-black\b': 'from-stone-100',
    r'\bbg-black\b': 'bg-stone-100',
}

# Fix specific button texts after global replace
post_replacements = {
    r'bg-amber-600 text-stone-900': 'bg-amber-600 text-white',
    r'bg-amber-700 text-stone-900': 'bg-amber-700 text-white',
    r'bg-emerald-500 text-stone-900': 'bg-emerald-600 text-white',
    r'bg-emerald-600 text-stone-900': 'bg-emerald-700 text-white',
}

files = glob.glob('src/components/**/*.tsx', recursive=True)
files.append('src/App.tsx')

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content)
        
    for pattern, replacement in post_replacements.items():
        content = re.sub(pattern, replacement, content)

    with open(file, 'w') as f:
        f.write(content)

print("Theme replaced successfully!")

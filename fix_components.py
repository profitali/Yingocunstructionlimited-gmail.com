import glob
import re

files_to_update = glob.glob('src/**/*.tsx', recursive=True)
for filepath in files_to_update:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. Update text-amber-600 font-bold from the navbar fix mistake
    content = content.replace('text-black font-bold uppercase tracking-widest text-[10px] hover:text-amber-600 transition-colors', 'text-amber-600 font-bold') # this was reverting an error in my replace script above where I accidentally replaced the Hero gradient replacement instead of navbar links. Let me be more precise.
    
    # Let's clean up Hero
    if 'Hero.tsx' in filepath:
        content = content.replace('text-amber-600 font-bold', 'text-amber-600 font-serif')
        # Ensure buttons have right padding
        content = content.replace('px-6 py-4 rounded-none bg-white', 'px-8 py-4 rounded-none bg-white')
        content = content.replace('px-6 py-4 rounded-none bg-black', 'px-8 py-4 rounded-none bg-black')
    
    with open(filepath, 'w') as f:
        f.write(content)

print("Cleaned up component classes")

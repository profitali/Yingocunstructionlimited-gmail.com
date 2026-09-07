import re
with open('src/components/AboutAndContactSection.tsx', 'r') as f:
    content = f.read()

# Make the feature blocks flat and sharp
content = content.replace('bg-white/60 border border-zinc-200', 'bg-white border-none rounded-none shadow-sm')
content = content.replace('rounded-none overflow-hidden border border-zinc-200 shadow-2xl relative h-96', 'rounded-none overflow-hidden border-none shadow-2xl relative h-[500px]')

with open('src/components/AboutAndContactSection.tsx', 'w') as f:
    f.write(content)

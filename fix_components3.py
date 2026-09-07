with open('src/components/SiteBuildingSection.tsx', 'r') as f:
    content = f.read()

# Make the feature blocks flat and sharp
content = content.replace('rounded-none bg-zinc-50/80 border border-zinc-200 overflow-hidden', 'rounded-none bg-zinc-50 border-none overflow-hidden shadow-xl shadow-black/5')

with open('src/components/SiteBuildingSection.tsx', 'w') as f:
    f.write(content)

with open('src/components/FurnitureStoreSection.tsx', 'r') as f:
    content = f.read()

content = content.replace('rounded-none bg-zinc-50 border border-zinc-200 overflow-hidden flex flex-col', 'rounded-none bg-zinc-50 border-none shadow-xl shadow-black/5 overflow-hidden flex flex-col')
content = content.replace('rounded-none bg-white/60 border border-zinc-200', 'rounded-none bg-white border border-zinc-200/50 shadow-xl shadow-black/5')

with open('src/components/FurnitureStoreSection.tsx', 'w') as f:
    f.write(content)

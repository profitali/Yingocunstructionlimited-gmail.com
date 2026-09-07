import re

# Update Hero for 100000x look
with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

# Slow pan on background image
content = content.replace(
    'className="w-full h-full object-cover object-center transition-all duration-1000 transform scale-105 opacity-25 filter brightness-75"',
    'className="w-full h-full object-cover object-center transition-all duration-[20s] ease-in-out transform scale-110 opacity-30 grayscale brightness-75 hover:scale-105 hover:grayscale-0"'
)

# Text transparency/gradients to solid stark colors
content = content.replace(
    'text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800',
    'text-amber-600 font-bold'
)

# Hero buttons layout
content = content.replace(
    'className="px-6 py-3.5 rounded-sm bg-white hover:bg-zinc-100 text-black border border-zinc-300 font-bold text-sm sm:text-base flex items-center gap-2 transition-all hover:border-amber-500/50"',
    'className="px-6 py-4 rounded-none bg-white hover:bg-black hover:text-white text-black border-2 border-black font-bold tracking-widest uppercase text-[11px] flex items-center gap-2 transition-all duration-300"'
)
content = content.replace(
    'className="px-6 py-3.5 rounded-sm bg-black hover:bg-amber-600 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-black/5 shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"',
    'className="px-6 py-4 rounded-none bg-black hover:bg-amber-600 text-white font-bold tracking-widest uppercase text-[11px] flex items-center gap-2 transition-all duration-300"'
)
content = content.replace(
    'className="px-5 py-3.5 rounded-sm bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-all hover:scale-105"',
    'className="px-6 py-4 rounded-none bg-zinc-900 hover:bg-emerald-600 text-white font-bold tracking-widest uppercase text-[11px] flex items-center gap-2 transition-all duration-300"'
)

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)

# Update Navbar
with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()

content = content.replace('bg-zinc-50/80 backdrop-blur-xl border-b border-zinc-200/50 shadow-sm', 'bg-white/80 backdrop-blur-2xl border-b border-zinc-200 shadow-sm transition-all duration-500')
content = content.replace('text-2xl font-serif font-bold tracking-tight text-black', 'text-2xl font-serif font-extrabold tracking-tighter text-black uppercase')
content = content.replace('text-amber-600 font-bold', 'text-black font-bold uppercase tracking-widest text-[10px] hover:text-amber-600 transition-colors')

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(content)

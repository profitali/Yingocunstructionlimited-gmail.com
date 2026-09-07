with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()

content = content.replace('text-zinc-500 hover:text-black', 'text-black font-bold uppercase tracking-widest text-[10px] hover:text-amber-600 transition-colors')
content = content.replace('className="w-4 h-4 text-black"', 'className="w-4 h-4 text-amber-600"')
content = content.replace('text-amber-600 font-serif', 'text-amber-600 font-bold uppercase tracking-widest text-[10px]')

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(content)

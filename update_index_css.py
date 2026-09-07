with open('src/index.css', 'r') as f:
    content = f.read()

content = content.replace('--font-sans: "Plus Jakarta Sans"', '--font-sans: "Manrope"')
content = content.replace('--font-serif: "Playfair Display"', '--font-serif: "Cinzel"')

with open('src/index.css', 'w') as f:
    f.write(content)

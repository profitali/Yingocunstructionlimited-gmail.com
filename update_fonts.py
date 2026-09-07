with open('index.html', 'r') as f:
    content = f.read()

# Add high-end fonts if not there
if 'Cinzel' not in content:
    content = content.replace(
        '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">',
        '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Manrope:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">'
    )

with open('index.html', 'w') as f:
    f.write(content)

with open('tailwind.config.js', 'r') as f:
    content = f.read()

content = content.replace('"Plus Jakarta Sans"', '"Manrope"')
content = content.replace('"Playfair Display"', '"Cinzel"')

with open('tailwind.config.js', 'w') as f:
    f.write(content)

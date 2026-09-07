import glob
files_to_update = glob.glob('src/**/*.tsx', recursive=True)
for filepath in files_to_update:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Update regular buttons to sharp and heavy font
    content = content.replace('px-5 py-3 rounded-sm', 'px-6 py-4 rounded-none uppercase tracking-widest text-[11px]')
    content = content.replace('px-4 py-2 rounded-sm', 'px-5 py-3 rounded-none uppercase tracking-widest text-[11px]')
    
    with open(filepath, 'w') as f:
        f.write(content)

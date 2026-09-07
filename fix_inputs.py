import glob
files_to_update = glob.glob('src/**/*.tsx', recursive=True)
for filepath in files_to_update:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Sharp inputs
    content = content.replace('rounded-sm px-3.5', 'rounded-none px-4')
    
    with open(filepath, 'w') as f:
        f.write(content)

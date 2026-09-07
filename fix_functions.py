import re
import glob

# For AboutAndContactSection
file = 'src/components/AboutAndContactSection.tsx'
with open(file, 'r') as f:
    content = f.read()
# Extract the broken global function
broken_func_match = re.search(r'const handleSubmit = \(e: React\.FormEvent\) => \{.*?\};\n', content, flags=re.DOTALL)
if broken_func_match:
    broken_func = broken_func_match.group(0)
    # Remove from global
    content = content.replace(broken_func, '')
    # Insert inside the component
    content = re.sub(
        r'(const \[submitSuccess, setSubmitSuccess\] = useState\(false\);\n)',
        r'\1\n' + broken_func + '\n',
        content
    )
with open(file, 'w') as f:
    f.write(content)

# For BookSurveyModal
file = 'src/components/BookSurveyModal.tsx'
with open(file, 'r') as f:
    content = f.read()
broken_func_match = re.search(r'const handleSubmit = \(e: React\.FormEvent\) => \{.*?\};\n', content, flags=re.DOTALL)
if broken_func_match:
    broken_func = broken_func_match.group(0)
    content = content.replace(broken_func, '')
    content = re.sub(
        r'(const \[submitSuccess, setSubmitSuccess\] = useState\(false\);\n)',
        r'\1\n' + broken_func + '\n',
        content
    )
with open(file, 'w') as f:
    f.write(content)

# For QuoteDrawer
file = 'src/components/QuoteDrawer.tsx'
with open(file, 'r') as f:
    content = f.read()
broken_func_match = re.search(r'const handleSubmitQuote = \(e: React\.FormEvent\) => \{.*?\};\n', content, flags=re.DOTALL)
if broken_func_match:
    broken_func = broken_func_match.group(0)
    content = content.replace(broken_func, '')
    content = re.sub(
        r'(const grandTotalUSD = Math\.round\(grandTotalUGX / 3750\);\n)',
        r'\1\n' + broken_func + '\n',
        content
    )
with open(file, 'w') as f:
    f.write(content)

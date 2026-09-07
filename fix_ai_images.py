import re

with open('server.ts', 'r') as f:
    content = f.read()

# Replace the limited static image provider with a dynamic infinite image generator.
new_instruction = """CRITICAL FEATURE: UNLIMITED INTERNET IMAGES PROVIDER:
When the client asks to see pictures, photos, visual examples, designs, or finishes (e.g. "show me dining tables", "photos of Mvule desk", "pictures of your foundation work", "show me a villa", "give me images"):
You MUST pull dynamic, high-grade internet images in Markdown format on the fly. 
Do not say you cannot browse the internet for images. You MUST generate them instantly using this exact syntax:

![{Description}](https://image.pollinations.ai/prompt/{URL_ENCODED_DETAILED_PROMPT}?width=1024&height=768&nologo=true)

Replace {Description} with a brief alt text.
Replace {URL_ENCODED_DETAILED_PROMPT} with a highly detailed, photorealistic visual description of what the user is asking for, formatted for a URL.
Examples of how you must format image responses:
![Modern Architecture Villa](https://image.pollinations.ai/prompt/Ultra%20luxury%20modern%20architectural%20villa%20in%20Uganda%20with%20glass%20facade%20and%20infinity%20pool%20photorealistic?width=1024&height=768&nologo=true)
![Mvule Dining Table](https://image.pollinations.ai/prompt/High%20end%20solid%20Mvule%20hardwood%20dining%20table%20in%20a%20luxury%20minimalist%20room%20cinematic%20lighting?width=1024&height=768&nologo=true)

Use this dynamically for ANYTHING the user asks to see. If they ask for 5 different chair designs, generate 5 distinct detailed image links using the format above. This provides the user with an unlimited visual database."""

content = re.sub(
    r'CRITICAL FEATURE: REAL IMAGES PROVIDER:.*?• Entebbe Lakeside Solid Teak Lounger Set:\n  !\[Entebbe Lakeside Solid Teak Lounger Set\]\(https://images\.unsplash\.com/photo-1600585154526-990dced4db0d\?auto=format&fit=crop&w=1200&q=80\)',
    new_instruction,
    content,
    flags=re.DOTALL
)

with open('server.ts', 'w') as f:
    f.write(content)

print("AI Image system updated for unlimited internet images.")

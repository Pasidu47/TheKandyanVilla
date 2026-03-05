import os
import glob

files = glob.glob(r"c:\Users\User\Desktop\HotelWebsite\*.html")
target_nav = """                    <a href="index.html" class="flex items-center gap-2">
                        <i class="fa-solid fa-leaf text-kv-gold text-2xl"></i>
                        <span class="font-playfair text-xl md:text-2xl font-bold text-kv-green">The Kandyan Villa</span>
                    </a>"""
repl_nav = """                    <a href="index.html" class="flex items-center gap-2">
                        <img src="images/logo.jpg" alt="The Kandyan Villa Logo" class="h-12 md:h-14 w-auto rounded-xl mix-blend-multiply">
                    </a>"""

target_foot = """                    <a href="index.html" class="flex items-center gap-2 mb-6">
                        <i class="fa-solid fa-leaf text-kv-gold text-2xl"></i>
                        <span class="font-playfair text-xl font-bold text-white">The Kandyan Villa</span>
                    </a>"""
repl_foot = """                    <div class="mb-6 inline-block bg-white p-2 rounded-2xl shadow-lg">
                        <a href="index.html" class="flex items-center">
                            <img src="images/logo.jpg" alt="The Kandyan Villa Logo" class="h-14 w-auto rounded-xl">
                        </a>
                    </div>"""

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We might have CR LF issues, so normalize before replacing
    content = content.replace("\r\n", "\n")
    target_nav = target_nav.replace("\r\n", "\n")
    repl_nav = repl_nav.replace("\r\n", "\n")
    target_foot = target_foot.replace("\r\n", "\n")
    repl_foot = repl_foot.replace("\r\n", "\n")
    
    content = content.replace(target_nav, repl_nav)
    content = content.replace(target_foot, repl_foot)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

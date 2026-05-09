import os
import json
import base64

files_to_include = [
    "./postcss.config.mjs",
    "./next-env.d.ts",
    "./README.md",
    "./package.json",
    "./tsconfig.json",
    "./AGENTS.md",
    "./eslint.config.mjs",
    "./CLAUDE.md",
    "./next.config.ts",
    "./src/app/layout.tsx",
    "./src/app/page.tsx",
    "./src/app/globals.css",
    "./src/components/Map.tsx",
    "./src/components/BottomBar.tsx",
    "./src/components/RightSidebar.tsx",
    "./src/components/Header.tsx",
    "./src/components/CaseProfile.tsx",
    "./src/hooks/useTokenData.ts",
    "./src/lib/data.ts",
    "./src/lib/tokenPrice.ts",
    "./src/lib/utils.ts",
    "./src/lib/token-config.ts",
    "./src/lib/arcUtils.ts",
    "./src/lib/liveData.ts"
]

# Note: public files and favicon are not included for now to avoid binary issues in simple content string
# but we can add them if we base64 them? No, push_files tool expects string content.

payload = []
for file_path in files_to_include:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Remove leading ./ from path
            clean_path = file_path[2:] if file_path.startswith('./') else file_path
            payload.append({
                "path": clean_path,
                "content": content
            })
    except Exception as e:
        print(f"Error reading {file_path}: {e}")

print(json.dumps(payload))

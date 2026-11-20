#!/usr/bin/env bash
# shadcn/ui Setup Verification Script
# Validates that a project is correctly configured for shadcn/ui

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Verifying shadcn/ui setup..."
echo ""

# Check if components.json exists
if [ -f "components.json" ]; then
    echo -e "${GREEN}✓${NC} components.json found"
else
    echo -e "${RED}✗${NC} components.json not found"
    echo -e "  ${YELLOW}Run:${NC} npx shadcn@latest init"
    exit 1
fi

# Read the configured CSS path. Tailwind v4 deliberately has no config file.
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}✗${NC} Node.js is required to read components.json"
    exit 1
fi
CSS_FILE=$(node -e '
    const fs = require("node:fs");
    const config = JSON.parse(fs.readFileSync("components.json", "utf8"));
    process.stdout.write(config.tailwind?.css || "");
')
if [ -z "$CSS_FILE" ]; then
    for candidate in src/index.css src/globals.css app/globals.css; do
        if [ -f "$candidate" ]; then
            CSS_FILE=$candidate
            break
        fi
    done
fi

TAILWIND_V4=false
if [ -f "$CSS_FILE" ] && node -e '
    const fs = require("node:fs");
    const css = fs.readFileSync(process.argv[1], "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    process.exit(/@import\s+(["\x27])tailwindcss\1/.test(css) ? 0 : 1);
' "$CSS_FILE"; then
    TAILWIND_V4=true
fi

if [ "$TAILWIND_V4" = true ]; then
    echo -e "${GREEN}✓${NC} Tailwind CSS-first setup found"
elif [ -f "tailwind.config.js" ] || [ -f "tailwind.config.ts" ]; then
    echo -e "${GREEN}✓${NC} Tailwind config found"
else
    echo -e "${RED}✗${NC} Tailwind config or CSS-first import not found"
    exit 1
fi

# Check if tsconfig.json has path aliases
if [ -f "tsconfig.json" ]; then
    if grep -q '"@/\*"' tsconfig.json; then
        echo -e "${GREEN}✓${NC} Path aliases configured in tsconfig.json"
    else
        echo -e "${YELLOW}⚠${NC} Path aliases not found in tsconfig.json"
        echo "  Add to compilerOptions.paths:"
        echo '  "@/*": ["./src/*"]'
    fi
else
    echo -e "${YELLOW}⚠${NC} tsconfig.json not found (TypeScript not configured)"
fi

# Check if globals.css or equivalent exists
if [ -n "$CSS_FILE" ] && [ -f "$CSS_FILE" ]; then
    echo -e "${GREEN}✓${NC} Global CSS file found"
    
    # Check for Tailwind directives
    if [ "$TAILWIND_V4" = true ] || grep -q "@tailwind base" "$CSS_FILE"; then
        echo -e "${GREEN}✓${NC} Tailwind directives present"
    else
        echo -e "${RED}✗${NC} Tailwind directives missing"
        echo "  Add to your CSS file:"
        echo "  @tailwind base;"
        echo "  @tailwind components;"
        echo "  @tailwind utilities;"
    fi
    
    # Check for CSS variables
    if grep -q "^:root" "$CSS_FILE" || grep -q "@layer base" "$CSS_FILE" || grep -q "@theme" "$CSS_FILE"; then
        echo -e "${GREEN}✓${NC} CSS variables defined"
    else
        echo -e "${YELLOW}⚠${NC} CSS variables not found"
        echo "  shadcn/ui requires CSS variables for theming"
    fi
else
    echo -e "${RED}✗${NC} Global CSS file not found"
fi

# Check if components/ui directory exists
if [ -d "src/components/ui" ] || [ -d "components/ui" ]; then
    echo -e "${GREEN}✓${NC} components/ui directory exists"
    
    # Count components
    COMPONENT_COUNT=$(find . -not -path "*/node_modules/*" \( -path "*/components/ui/*.tsx" -o -path "*/components/ui/*.jsx" \) | wc -l)
    echo -e "  ${COMPONENT_COUNT} components installed"
else
    echo -e "${YELLOW}⚠${NC} components/ui directory not found"
    echo "  Add your first component: npx shadcn@latest add button"
fi

# Check if lib/utils exists
if [ -f "src/lib/utils.ts" ] || [ -f "lib/utils.ts" ]; then
    echo -e "${GREEN}✓${NC} lib/utils.ts exists"
    
    # Check for cn function
    UTILS_FILE=$(find . -not -path "*/node_modules/*" -name "utils.ts" | grep "lib" | head -n 1)
    if grep -q "export function cn" "$UTILS_FILE"; then
        echo -e "${GREEN}✓${NC} cn() utility function present"
    else
        echo -e "${RED}✗${NC} cn() utility function missing"
    fi
else
    echo -e "${RED}✗${NC} lib/utils.ts not found"
fi

# Check package.json dependencies
if [ -f "package.json" ]; then
    echo ""
    echo "📦 Checking dependencies..."
    
    # Required dependencies
    REQUIRED_DEPS=("react" "tailwindcss")
    RECOMMENDED_DEPS=("class-variance-authority" "clsx" "tailwind-merge" "tailwindcss-animate")
    
    for dep in "${REQUIRED_DEPS[@]}"; do
        if grep -q "\"$dep\"" package.json; then
            echo -e "${GREEN}✓${NC} $dep installed"
        else
            echo -e "${RED}✗${NC} $dep not installed"
        fi
    done
    
    echo ""
    echo "Recommended dependencies:"
    for dep in "${RECOMMENDED_DEPS[@]}"; do
        if grep -q "\"$dep\"" package.json; then
            echo -e "${GREEN}✓${NC} $dep installed"
        else
            echo -e "${YELLOW}⚠${NC} $dep not installed (recommended)"
        fi
    done
fi

echo ""
echo -e "${GREEN}✓${NC} Setup verification complete!"
echo ""
echo "Next steps:"
echo "  1. Add components: npx shadcn@latest add [component]"
echo "  2. View catalog: npx shadcn@latest add --help"
echo "  3. Browse docs: https://ui.shadcn.com"

#!/usr/bin/env bash
# shadcn-vue Setup Verification Script
# Validates that a project is correctly configured for shadcn-vue

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Verifying shadcn-vue setup..."
echo ""

# Check if components.json exists
if [ -f "components.json" ]; then
    echo -e "${GREEN}✓${NC} components.json found"
else
    echo -e "${RED}✗${NC} components.json not found"
    echo -e "  ${YELLOW}Run:${NC} yarn dlx shadcn-vue@latest init"
    exit 1
fi

# Check if tailwind.config exists or vite plugin is used
if [ -f "tailwind.config.js" ] || [ -f "tailwind.config.ts" ] || grep -q "@tailwindcss/vite" package.json 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Tailwind CSS configuration found"
else
    echo -e "${RED}✗${NC} Tailwind CSS configuration not found"
    echo -e "  ${YELLOW}Install Tailwind:${NC} yarn add tailwindcss @tailwindcss/vite"
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
CSS_FILE=$(find . -name "style.css" -o -name "globals.css" -o -name "tailwind.css" | head -n 1)
if [ -n "$CSS_FILE" ]; then
    echo -e "${GREEN}✓${NC} Global CSS file found ($CSS_FILE)"
    
    # Check for Tailwind directives (Legacy or v4)
    if grep -q "@tailwind" "$CSS_FILE" || grep -q "@import \"tailwindcss\"" "$CSS_FILE"; then
        echo -e "${GREEN}✓${NC} Tailwind directives present"
    else
        echo -e "${RED}✗${NC} Tailwind directives missing"
        echo "  Add to your CSS file:"
        echo "  @import \"tailwindcss\";"
    fi
else
    echo -e "${RED}✗${NC} Global CSS file not found"
fi

# Check if components/ui directory exists
if [ -d "src/components/ui" ] || [ -d "components/ui" ]; then
    echo -e "${GREEN}✓${NC} components/ui directory exists"
    
    # Count components
    COMPONENT_COUNT=$(find . -path "*/components/ui/*.vue" | wc -l)
    echo -e "  ${COMPONENT_COUNT} components installed"
else
    echo -e "${YELLOW}⚠${NC} components/ui directory not found"
    echo "  Add your first component: yarn dlx shadcn-vue@latest add button"
fi

# Check if lib/utils exists
UTILS_FILE=$(find . -name "utils.ts" -o -name "utils.js" | grep "lib" | head -n 1)
if [ -n "$UTILS_FILE" ]; then
    echo -e "${GREEN}✓${NC} utility file found ($UTILS_FILE)"
    
    # Check for cn function
    if grep -q "export function cn" "$UTILS_FILE"; then
        echo -e "${GREEN}✓${NC} cn() utility function present"
    else
        echo -e "${RED}✗${NC} cn() utility function missing"
    fi
else
    echo -e "${RED}✗${NC} utility file not found (expecting lib/utils.ts or lib/utils.js)"
fi

# Check package.json dependencies
if [ -f "package.json" ]; then
    echo ""
    echo "📦 Checking dependencies..."
    
    # Required dependencies
    REQUIRED_DEPS=("vue" "tailwindcss" "radix-vue")
    RECOMMENDED_DEPS=("class-variance-authority" "clsx" "tailwind-merge" "lucide-vue-next")
    
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
echo "  1. Add components: yarn dlx shadcn-vue@latest add [component]"
echo "  2. Browse docs: https://www.shadcn-vue.com"

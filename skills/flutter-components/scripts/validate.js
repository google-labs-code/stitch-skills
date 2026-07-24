/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'node:fs';
import path from 'node:path';

async function validateFlutterComponent(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);

    console.log(`🔍 Scanning Flutter Component: ${filename}...`);

    let issues = [];

    // 1. Check for StatefulWidget requirement (from SKILL.md)
    const isStateful = /extends\s+StatefulWidget/.test(code);

    // 2. Check for "Props" (Constructor with parameters)
    // In Flutter, we look for a constructor that isn't just the default one.
    const hasConstructorWithParams = /[\w]+\(\{[\s\S]*?\}\)/.test(code);

    // 3. Check for hardcoded hex colors
    // Matches: 0xFFRRGGBB, 0xRRGGBB, #RRGGBB
    const hexPattern = /0x([0-9A-Fa-f]{6,8})|#([0-9A-Fa-f]{6})/g;
    let match;
    let hexIssues = [];
    while ((match = hexPattern.exec(code)) !== null) {
        hexIssues.push(match[0]);
    }

    console.log(`--- Validation for: ${filename} ---`);

    if (isStateful) {
        console.log("✅ Component is a StatefulWidget.");
    } else {
        console.error("❌ MISSING: Must be a StatefulWidget (as per SKILL.md).");
        issues.push("Not a StatefulWidget");
    }

    if (hasConstructorWithParams) {
        console.log("✅ Constructor with parameters found (Props equivalent).");
    } else {
        console.error("❌ MISSING: Constructor with parameters (Props).");
        issues.push("Missing constructor parameters");
    }

    if (hexIssues.length === 0) {
        console.log("✅ No hardcoded hex values found.");
    } else {
        console.error(`❌ STYLE: Found ${hexIssues.length} hardcoded hex codes.`);
        hexIssues.forEach(hex => console.error(`   - ${hex}`));
        issues.push("Hardcoded hex codes");
    }

    if (issues.length === 0) {
        console.log("\n✨ FLUTTER COMPONENT VALID.");
        process.exit(0);
    } else {
        console.error("\n🚫 VALIDATION FAILED.");
        process.exit(1);
    }
}

validateFlutterComponent(process.argv[2]);

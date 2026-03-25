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

import swc from '@swc/core';
import fs from 'node:fs';
import path from 'node:path';

const HEX_COLOR_REGEX = /#[0-9A-Fa-f]{6}/;
const HTML_ELEMENTS = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'button', 'a', 'input', 'ul', 'ol', 'li', 'section', 'header', 'footer', 'nav', 'main'];

async function validateComponent(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  try {
    const ast = await swc.parse(code, { syntax: "typescript", tsx: true });
    let hasInterface = false;
    let hexIssues = [];
    let htmlElements = [];

    console.log("Scanning AST...");

    const walk = (node) => {
      if (!node) return;

      if (node.type === 'TsInterfaceDeclaration' && node.id.value.endsWith('Props')) {
        hasInterface = true;
      }

      // Check for hardcoded hex in StyleSheet values
      if (node.type === 'StringLiteral' && HEX_COLOR_REGEX.test(node.value)) {
        hexIssues.push(node.value);
      }

      // Check for HTML elements used as JSX tags
      if (node.type === 'JSXOpeningElement' && node.name?.type === 'Identifier') {
        const tagName = node.name.value;
        if (HTML_ELEMENTS.includes(tagName)) {
          htmlElements.push(tagName);
        }
      }

      for (const key in node) {
        if (node[key] && typeof node[key] === 'object') walk(node[key]);
      }
    };
    walk(ast);

    console.log(`--- Validation for: ${filename} ---`);

    let valid = true;

    if (hasInterface) {
      console.log("PASS: Props declaration found.");
    } else {
      console.error("FAIL: Missing Props interface (must end in 'Props').");
      valid = false;
    }

    if (hexIssues.length === 0) {
      console.log("PASS: No hardcoded hex values found.");
    } else {
      console.error(`FAIL: Found ${hexIssues.length} hardcoded hex codes. Use theme.ts instead.`);
      hexIssues.forEach(hex => console.error(`   - ${hex}`));
      valid = false;
    }

    if (htmlElements.length === 0) {
      console.log("PASS: No HTML elements found. Using React Native primitives.");
    } else {
      const unique = [...new Set(htmlElements)];
      console.error(`FAIL: Found HTML elements: ${unique.join(', ')}. Replace with React Native components.`);
      valid = false;
    }

    if (valid) {
      console.log("\nCOMPONENT VALID.");
      process.exit(0);
    } else {
      console.error("\nVALIDATION FAILED.");
      process.exit(1);
    }
  } catch (err) {
    console.error("PARSE ERROR:", err.message);
    process.exit(1);
  }
}

validateComponent(process.argv[2]);

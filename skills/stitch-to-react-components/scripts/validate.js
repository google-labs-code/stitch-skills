import swc from '@swc/core';
import fs from 'node:fs';
import path from 'node:path';

async function validateComponent(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  try {
    const ast = await swc.parse(code, { syntax: "typescript", tsx: true });
    let hasInterface = false;
    let tailwindIssues = [];
    const walk = (node) => {
      if (!node) return;
      if (node.type === 'TsInterfaceDeclaration' && node.id.value.endsWith('Props')) hasInterface = true;
      if (node.type === 'JSXAttribute' && node.name.name === 'className') {
        if (node.value?.value && /#[0-9A-Fa-f]{6}/.test(node.value.value)) tailwindIssues.push(node.value.value);
      }
      for (const key in node) { if (node[key] && typeof node[key] === 'object') walk(node[key]); }
    };
    walk(ast);
    console.log(`--- Validation: ${filename} ---`);
    if (!hasInterface) console.error("❌ MISSING: Props interface.");
    if (tailwindIssues.length > 0) console.error("❌ STYLE: Hex codes found.");
    process.exit((hasInterface && tailwindIssues.length === 0) ? 0 : 1);
  } catch (err) { console.error("❌ PARSE ERROR"); process.exit(1); }
}

validateComponent(process.argv[2]);

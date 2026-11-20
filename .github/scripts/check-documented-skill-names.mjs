#!/usr/bin/env node
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

/**
 * Verifies that every `npx skills add google-labs-code/stitch-skills --skill <name>`
 * snippet in the docs uses a skill name the CLI can actually resolve.
 *
 * The skills CLI matches `--skill` against the `name` field of each SKILL.md
 * (exact, case-sensitive), not against the skill's directory name. A rename of
 * `name` therefore silently breaks every install snippet that still uses the
 * old value, and nothing else in the repo reads those snippets.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const IGNORED_DIRS = new Set(['node_modules', '.git']);

/** Reads the `name` field from a SKILL.md YAML frontmatter block. */
function readSkillName(filePath) {
  const text = fs.readFileSync(filePath, 'utf-8');
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) return null;
  const name = frontmatter[1].match(/^name:\s*(.+?)\s*$/m);
  if (!name) return null;
  return name[1].replace(/^["']|["']$/g, '');
}

/** Collects every declared skill name across all plugins. */
function collectSkillNames() {
  const names = new Set();
  const pluginsDir = path.join(REPO_ROOT, 'plugins');

  for (const plugin of fs.readdirSync(pluginsDir, { withFileTypes: true })) {
    if (!plugin.isDirectory()) continue;
    const skillsDir = path.join(pluginsDir, plugin.name, 'skills');
    if (!fs.existsSync(skillsDir)) continue;
    for (const skill of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (!skill.isDirectory()) continue;
      const skillFile = path.join(skillsDir, skill.name, 'SKILL.md');
      if (!fs.existsSync(skillFile)) continue;
      const name = readSkillName(skillFile);
      if (name) names.add(name);
    }
  }
  return names;
}

/** Walks the repo and returns every Markdown file path. */
function collectMarkdownFiles(dir = REPO_ROOT, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) collectMarkdownFiles(entryPath, found);
    else if (entry.name.endsWith('.md')) found.push(entryPath);
  }
  return found;
}

const INSTALL_SNIPPET = /npx\s+skills\s+add\s+google-labs-code\/stitch-skills\s+--skill\s+(?:"([^"]+)"|'([^']+)'|(\S+))/g;

const knownNames = collectSkillNames();
const mismatches = [];

for (const filePath of collectMarkdownFiles()) {
  const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const match of line.matchAll(INSTALL_SNIPPET)) {
      const referencedName = match[1] ?? match[2] ?? match[3];
      if (!knownNames.has(referencedName)) {
        mismatches.push({
          file: path.relative(REPO_ROOT, filePath).split(path.sep).join('/'),
          line: index + 1,
          referencedName,
        });
      }
    }
  });
}

if (mismatches.length > 0) {
  console.error('Undocumented skill name(s) in install snippets:');
  for (const { file, line, referencedName } of mismatches) {
    console.error(`  ${file}:${line} --skill ${referencedName}`);
  }
  console.error(`\nDeclared skill names:\n  ${[...knownNames].sort().join('\n  ')}`);
  process.exit(1);
}

console.log(`All documented install snippets resolve to one of ${knownNames.size} declared skills: OK`);

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const validator = fileURLToPath(new URL('../scripts/validate.js', import.meta.url));
function validate(source) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'stitch-native-calls-'));
  try {
    const component = path.join(directory, 'Card.tsx');
    writeFileSync(component, `export interface CardProps { readonly items: readonly string[] }\n${source}`);
    return spawnSync(process.execPath, [validator, component], { encoding: 'utf8' });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

// SWC keeps call arguments and array elements in `{ spread, expression }`
// wrappers and class method bodies in a `function` object. None of them has a
// `type`, and the validator has to look inside all of them.
for (const [name, source, expected] of [
  [
    'a hex color in StyleSheet.create',
    "const styles = StyleSheet.create({ card: { backgroundColor: '#ff0000' } });",
    /Found 1 hardcoded colors[\s\S]*- #ff0000/,
  ],
  [
    'an rgba color in StyleSheet.create',
    "const styles = StyleSheet.create({ card: { shadowColor: 'rgba(0, 0, 0, 0.25)' } });",
    /Found 1 hardcoded colors[\s\S]*- rgba\(0, 0, 0, 0\.25\)/,
  ],
  [
    'a hex color in a style array',
    "export const Card = () => <View style={[styles.card, { borderColor: '#00ff00' }]} />;",
    /Found 1 hardcoded colors[\s\S]*- #00ff00/,
  ],
  [
    'a web element in a map callback',
    'export const Card = ({ items }: CardProps) => <View>{items.map((item) => <div key={item} />)}</View>;',
    /Found HTML elements: div/,
  ],
  [
    'a web element in a memo wrapper',
    'export const Card = React.memo(({ items }: CardProps) => <span>{items.length}</span>);',
    /Found HTML elements: span/,
  ],
  [
    'a web element in a class component',
    'export class Card extends React.Component<CardProps> { render() { return <p>{this.props.items.length}</p>; } }',
    /Found HTML elements: p/,
  ],
]) {
  test(`rejects ${name}`, () => {
    const result = validate(source);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, expected);
  });
}

for (const [name, source] of [
  [
    'theme tokens in StyleSheet.create',
    'const styles = StyleSheet.create({ card: { backgroundColor: colors.surface, padding: 16 } });',
  ],
  [
    'native components in a style array and a map callback',
    'export const Card = ({ items }: CardProps) => <View style={[styles.card, styles.row]}>{items.map((item) => <Text key={item}>{item}</Text>)}</View>;',
  ],
  [
    'native components in a memo wrapper',
    'export const Card = React.memo(({ items }: CardProps) => <Text>{items.length}</Text>);',
  ],
  [
    'native components in a class component',
    'export class Card extends React.Component<CardProps> { render() { return <Text>{this.props.items.length}</Text>; } }',
  ],
]) {
  test(`allows ${name}`, () => {
    const result = validate(source);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  });
}

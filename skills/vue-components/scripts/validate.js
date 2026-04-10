/**
 * Vue 3 SFC Validator
 * Checks that a .vue component follows the skill's architectural rules:
 *  - Has a typed defineProps<Props>() declaration
 *  - Contains no hardcoded hex color values in the template
 */

import { parse } from '@vue/compiler-sfc'
import fs from 'node:fs'
import path from 'node:path'

const HEX_COLOR_REGEX = /#[0-9A-Fa-f]{6}/g

async function validateComponent(filePath) {
  if (!filePath) {
    console.error('Usage: node scripts/validate.js <file_path>')
    process.exit(1)
  }

  const source = fs.readFileSync(filePath, 'utf-8')
  const filename = path.basename(filePath)

  const { descriptor, errors } = parse(source, { filename })

  if (errors.length > 0) {
    console.error('❌ PARSE ERROR:', errors[0].message)
    process.exit(1)
  }

  const scriptContent =
    descriptor.scriptSetup?.content ?? descriptor.script?.content ?? ''
  const templateContent = descriptor.template?.content ?? ''

  // Check for typed defineProps
  const hasDefineProps = /defineProps\s*</.test(scriptContent)

  // Check for hardcoded hex values in template
  const hexMatches = [...templateContent.matchAll(HEX_COLOR_REGEX)].map(
    (m) => m[0],
  )

  console.log('🔍 Scanning Vue SFC...')
  console.log(`--- Validation for: ${filename} ---`)

  if (hasDefineProps) {
    console.log('✅ defineProps<Props>() declaration found.')
  } else {
    console.error(
      "❌ MISSING: Typed defineProps (use defineProps<YourProps>() pattern).",
    )
  }

  if (hexMatches.length === 0) {
    console.log('✅ No hardcoded hex values found in template.')
  } else {
    console.error(`❌ STYLE: Found ${hexMatches.length} hardcoded hex codes.`)
    hexMatches.forEach((hex) => console.error(`   - ${hex}`))
  }

  if (hasDefineProps && hexMatches.length === 0) {
    console.log('\n✨ COMPONENT VALID.')
    process.exit(0)
  } else {
    console.error('\n🚫 VALIDATION FAILED.')
    process.exit(1)
  }
}

validateComponent(process.argv[2])

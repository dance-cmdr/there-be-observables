#!/usr/bin/env node

/**
 * Sync Agent Files
 * 
 * This script keeps CLAUDE.md and .cursor/rules/project.mdc in sync.
 * CLAUDE.md is the source of truth.
 * 
 * Usage:
 *   node scripts/sync-agent-files.js
 * 
 * Can be added to pre-commit hook or npm scripts.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CLAUDE_MD = path.join(ROOT, 'CLAUDE.md');
const CURSOR_RULES = path.join(ROOT, '.cursor', 'rules', 'project.mdc');

function readClaudeMd() {
  if (!fs.existsSync(CLAUDE_MD)) {
    console.error('CLAUDE.md not found');
    process.exit(1);
  }
  return fs.readFileSync(CLAUDE_MD, 'utf-8');
}

function extractSections(content) {
  // Extract key sections from CLAUDE.md for Cursor rules
  const sections = {
    purpose: '',
    commands: '',
    patterns: '',
    issues: ''
  };

  // Extract Project Purpose section
  const purposeMatch = content.match(/## Project Purpose\n\n([\s\S]*?)(?=\n## )/);
  if (purposeMatch) {
    sections.purpose = purposeMatch[1].trim();
  }

  // Extract Build & Run Commands
  const commandsMatch = content.match(/## Build & Run Commands\n\n```bash\n([\s\S]*?)```/);
  if (commandsMatch) {
    sections.commands = commandsMatch[1].trim();
  }

  // Extract Architecture Patterns
  const patternsMatch = content.match(/## Architecture Patterns\n\n([\s\S]*?)(?=\n## )/);
  if (patternsMatch) {
    sections.patterns = patternsMatch[1].trim();
  }

  // Extract Known Issues
  const issuesMatch = content.match(/## Known Issues & Deprecations\n\n([\s\S]*?)(?=\n## )/);
  if (issuesMatch) {
    sections.issues = issuesMatch[1].trim();
  }

  return sections;
}

function generateCursorRules(sections) {
  return `---
description: Project conventions for There Be Observables - a reactive programming experiment
globs: ["**/*.ts", "**/*.tsx"]
---

# There Be Observables - Project Rules

## Project Context

${sections.purpose}

## Code Patterns

${sections.patterns}

## Known Technical Debt

${sections.issues}

## Commands

\`\`\`bash
${sections.commands}
\`\`\`

---
*Auto-generated from CLAUDE.md by scripts/sync-agent-files.js*
`;
}

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function main() {
  console.log('Syncing agent files...');
  
  const claudeContent = readClaudeMd();
  const sections = extractSections(claudeContent);
  const cursorRules = generateCursorRules(sections);
  
  ensureDirectoryExists(CURSOR_RULES);
  fs.writeFileSync(CURSOR_RULES, cursorRules);
  
  console.log(`✓ Updated ${CURSOR_RULES}`);
  console.log('Sync complete.');
}

main();

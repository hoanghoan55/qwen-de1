#!/usr/bin/env node

/**
 * Quick Verification Script
 * Kiểm tra nhanh project có hoạt động không
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Quick Verification\n');

let passed = 0;
let failed = 0;

function check(name, condition) {
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    failed++;
  }
}

// 1. Check required files
console.log('📁 Checking files...');
check('package.json exists', fs.existsSync('package.json'));
check('src/App.tsx exists', fs.existsSync('src/App.tsx'));
check('src/main.tsx exists', fs.existsSync('src/main.tsx'));
check('index.html exists', fs.existsSync('index.html'));
check('vite.config.js exists', fs.existsSync('vite.config.js'));
check('tsconfig.json exists', fs.existsSync('tsconfig.json'));

// 2. Check services
console.log('\n🔧 Checking services...');
check('LLM service exists', fs.existsSync('src/services/llm.ts'));
check('TTS service exists', fs.existsSync('src/services/tts.ts'));
check('Audio service exists', fs.existsSync('src/services/audio.ts'));
check('Renderer service exists', fs.existsSync('src/services/renderer.ts'));
check('Exporter service exists', fs.existsSync('src/services/exporter.ts'));

// 3. Check tests
console.log('\n🧪 Checking tests...');
check('API test exists', fs.existsSync('tests/api/test-connections.js'));
check('Unit tests exist', fs.existsSync('tests/unit/services.test.ts'));
check('E2E tests exist', fs.existsSync('tests/e2e/app.spec.ts'));

// 4. Check documentation
console.log('\n📚 Checking documentation...');
check('README.md exists', fs.existsSync('README.md'));
check('USAGE.md exists', fs.existsSync('USAGE.md'));
check('TESTING.md exists', fs.existsSync('TESTING.md'));
check('LOCAL_TESTING.md exists', fs.existsSync('LOCAL_TESTING.md'));

// 5. Check package.json scripts
console.log('\n📦 Checking package.json...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
check('Has dev script', 'dev' in packageJson.scripts);
check('Has build script', 'build' in packageJson.scripts);
check('Has typecheck script', 'typecheck' in packageJson.scripts);

// 6. Check dependencies
console.log('\n📦 Checking dependencies...');
check('Has react', 'react' in packageJson.dependencies);
check('Has react-dom', 'react-dom' in packageJson.dependencies);
check('Has typescript', 'typescript' in packageJson.devDependencies);
check('Has vite', 'vite' in packageJson.devDependencies);
check('Has tailwindcss', 'tailwindcss' in packageJson.devDependencies);

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('✅ All checks passed! Project is ready.\n');
  console.log('Next steps:');
  console.log('  1. npm install');
  console.log('  2. npm run dev');
  console.log('  3. Open http://localhost:5173');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Please fix the issues.\n');
  process.exit(1);
}

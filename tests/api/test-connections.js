#!/usr/bin/env node

/**
 * Test API Connections
 * Kiểm tra kết nối đến 9Router và TTS APIs
 */

const NINEROUTER_URL = 'https://9router-production-bcf1.up.railway.app';
const NINEROUTER_KEY = 'sk-3a3d0c15eaf15d37-y9i1da-9ceeb339';
const TTS_URL = 'https://tts.delyai.site';
const TTS_KEY = 'WwlIYBeO3SxiN4Wpa7swanK7ozOl2nQWLpcb2iRnRvY';

async function test9Router() {
  console.log('\n🔍 Testing 9Router API...');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${NINEROUTER_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.ok ? 'OK' : 'FAILED');
    
    // Test models endpoint
    const modelsResponse = await fetch(`${NINEROUTER_URL}/v1/models`, {
      headers: {
        'Authorization': `Bearer ${NINEROUTER_KEY}`,
      },
    });
    
    if (!modelsResponse.ok) {
      throw new Error(`HTTP ${modelsResponse.status}`);
    }
    
    const modelsData = await modelsResponse.json();
    const modelCount = modelsData.data?.length || 0;
    console.log(`✅ Models endpoint: ${modelCount} models available`);
    
    // Test chat completion
    const chatResponse = await fetch(`${NINEROUTER_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NINEROUTER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
      }),
    });
    
    if (!chatResponse.ok) {
      throw new Error(`HTTP ${chatResponse.status}`);
    }
    
    const chatData = await chatResponse.json();
    console.log('✅ Chat completion: Working');
    
    return true;
  } catch (error) {
    console.error('❌ 9Router API Error:', error.message);
    return false;
  }
}

async function testTTS() {
  console.log('\n🔍 Testing TTS API...');
  
  try {
    // Test voices endpoint
    const voicesResponse = await fetch(`${TTS_URL}/v1/voices`, {
      headers: {
        'x-api-key': TTS_KEY,
      },
    });
    
    if (!voicesResponse.ok) {
      throw new Error(`HTTP ${voicesResponse.status}`);
    }
    
    const voicesData = await voicesResponse.json();
    const voiceCount = voicesData.voices?.length || 0;
    console.log(`✅ Voices endpoint: ${voiceCount} voices available`);
    
    // Test TTS generation (short text)
    const ttsResponse = await fetch(`${TTS_URL}/v1/text-to-speech/default`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TTS_KEY,
      },
      body: JSON.stringify({
        text: 'Test',
        language: 'en',
        output_format: 'mp3',
      }),
    });
    
    if (!ttsResponse.ok) {
      throw new Error(`HTTP ${ttsResponse.status}`);
    }
    
    const audioBlob = await ttsResponse.blob();
    const duration = ttsResponse.headers.get('X-Audio-Duration');
    console.log(`✅ TTS generation: Working (${duration || 'unknown'}s)`);
    
    return true;
  } catch (error) {
    console.error('❌ TTS API Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🧪 API Connection Tests\n');
  console.log('='.repeat(50));
  
  const results = {
    ninerouter: await test9Router(),
    tts: await testTTS(),
  };
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Results:');
  console.log(`  9Router: ${results.ninerouter ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  TTS:     ${results.tts ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(r => r);
  console.log(`\n${allPassed ? '✅ All tests passed!' : '⚠️  Some tests failed'}`);
  
  process.exit(allPassed ? 0 : 1);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

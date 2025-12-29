#!/usr/bin/env node

/**
 * 安全防护测试脚本
 * 用于测试限流和防爬虫功能
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';
const LANG = 'zh';

// 测试配置
const TESTS = {
  normalRequest: {
    name: '正常请求测试',
    count: 5,
    interval: 2000, // 2秒间隔
    shouldPass: true,
  },
  rapidRequests: {
    name: '快速请求测试（触发限流）',
    count: 25,
    interval: 100, // 0.1秒间隔
    shouldPass: false,
  },
  botUserAgent: {
    name: '爬虫User-Agent测试',
    count: 1,
    interval: 0,
    shouldPass: false,
    userAgent: 'python-requests/2.28.0',
  },
  validUserAgent: {
    name: '正常User-Agent测试',
    count: 3,
    interval: 1000,
    shouldPass: true,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
};

// 测试结果统计
const results = {
  passed: 0,
  failed: 0,
  errors: 0,
};

/**
 * 发送搜索请求
 * @param {string} keyword 
 * @param {string} [userAgent]
 */
async function sendSearchRequest(keyword, userAgent) {
  const url = `${API_URL}/${LANG}/api/search`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      body: JSON.stringify({ keyword }),
    });

    return {
      status: response.status,
      ok: response.ok,
      data: await response.json().catch(() => null),
    };
  } catch (error) {
    const err = /** @type {Error} */ (error);
    return {
      status: 0,
      ok: false,
      error: err.message,
    };
  }
}

/**
 * 延迟函数
 * @param {number} ms
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 运行单个测试
 * @param {string} testName
 * @param {any} config
 */
async function runTest(testName, config) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 测试: ${config.name}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`配置: 请求${config.count}次, 间隔${config.interval}ms`);
  if (config.userAgent) {
    console.log(`User-Agent: ${config.userAgent}`);
  }
  console.log(`预期结果: ${config.shouldPass ? '✅ 通过' : '❌ 被拦截'}\n`);

  let successCount = 0;
  let blockedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < config.count; i++) {
    const response = await sendSearchRequest(
      `测试${i + 1}`,
      config.userAgent
    );

    if (response.ok) {
      successCount++;
      console.log(`✅ 请求 ${i + 1}/${config.count}: 成功 (${response.status})`);
    } else if (response.status === 429 || response.status === 403) {
      blockedCount++;
      console.log(`🚫 请求 ${i + 1}/${config.count}: 被拦截 (${response.status}) - ${response.data?.error || ''}`);
    } else if (response.status === 0) {
      errorCount++;
      console.log(`❌ 请求 ${i + 1}/${config.count}: 网络错误 - ${response.error}`);
    } else {
      errorCount++;
      console.log(`⚠️  请求 ${i + 1}/${config.count}: 异常 (${response.status})`);
    }

    if (i < config.count - 1) {
      await delay(config.interval);
    }
  }

  // 判断测试结果
  const testPassed = config.shouldPass
    ? (successCount > 0 && blockedCount === 0)
    : (blockedCount > 0);

  console.log(`\n📊 统计:`);
  console.log(`   成功: ${successCount}`);
  console.log(`   拦截: ${blockedCount}`);
  console.log(`   错误: ${errorCount}`);
  console.log(`\n结果: ${testPassed ? '✅ 测试通过' : '❌ 测试失败'}`);

  if (testPassed) {
    results.passed++;
  } else {
    results.failed++;
  }
  if (errorCount > 0) {
    results.errors++;
  }

  // 等待一段时间再进行下一个测试
  await delay(3000);
}

/**
 * 主测试函数
 */
async function main() {
  console.log('\n🔒 开始安全防护测试...\n');
  console.log(`测试目标: ${API_URL}`);
  console.log(`测试时间: ${new Date().toLocaleString()}\n`);

  for (const [testName, config] of Object.entries(TESTS)) {
    try {
      await runTest(testName, config);
    } catch (error) {
      const err = /** @type {Error} */ (error);
      console.error(`\n❌ 测试 "${config.name}" 出错:`, err.message);
      results.errors++;
    }
  }

  // 打印总结
  console.log('\n' + '='.repeat(60));
  console.log('📈 测试总结');
  console.log('='.repeat(60));
  console.log(`总测试数: ${Object.keys(TESTS).length}`);
  console.log(`✅ 通过: ${results.passed}`);
  console.log(`❌ 失败: ${results.failed}`);
  console.log(`⚠️  错误: ${results.errors}`);
  console.log('='.repeat(60));

  if (results.failed === 0 && results.errors === 0) {
    console.log('\n🎉 所有测试通过！安全防护正常工作。\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  部分测试失败或出错，请检查配置。\n');
    process.exit(1);
  }
}

// 运行测试
main().catch(error => {
  console.error('测试执行失败:', error);
  process.exit(1);
});

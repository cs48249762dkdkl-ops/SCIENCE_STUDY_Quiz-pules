const assert = require('node:assert/strict');
const test = require('node:test');
const handler = require('../api/astronomy-search.js');

function responseCapture() {
  return {
    code: null,
    headers: {},
    body: null,
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('Korean astronomical terms become useful provider queries', () => {
  assert.equal(handler.__test__.externalQueryFor('블랙홀 중력파'), 'black hole gravitational wave');
  assert.equal(handler.__test__.normaliseQuery('  외계행성\n  통과법 '), '외계행성 통과법');
});

test('search endpoint retains a successful external response shape', async () => {
  const realFetch = global.fetch;
  global.fetch = async (url) => {
    if (url.includes('images-api.nasa.gov')) {
      return { ok: true, json: async () => ({ collection: { items: [{ data: [{ title: 'Black Hole', description: 'NASA observation', nasa_id: 'black-hole', date_created: '2026-01-02' }] }] } }) };
    }
    if (url.includes('export.arxiv.org')) {
      return { ok: true, text: async () => '<feed><entry><id>https://arxiv.org/abs/2601.00001</id><title>Black hole observation</title><summary>Research summary</summary><published>2026-01-03T00:00:00Z</published></entry></feed>' };
    }
    throw new Error(`Unexpected URL: ${url}`);
  };
  try {
    const res = responseCapture();
    await handler({ method: 'GET', query: { q: '블랙홀' } }, res);
    assert.equal(res.code, 200);
    assert.ok(res.body.results.some((item) => item.source === 'NASA'));
    assert.ok(res.body.results.some((item) => item.source === 'arXiv'));
    assert.ok(res.body.results.every((item) => item.translation.includes('한국어')));
  } finally {
    global.fetch = realFetch;
  }
});

test('short searches are rejected without contacting external providers', async () => {
  const res = responseCapture();
  await handler({ method: 'GET', query: { q: '별' } }, res);
  assert.equal(res.code, 400);
  assert.equal(res.body.results.length, 0);
});


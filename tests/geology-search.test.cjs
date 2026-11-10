const assert = require('node:assert/strict');
const test = require('node:test');
const handler = require('../api/geology-search.js');

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

test('Korean mineral query yields safe, verifiable external references', async () => {
  const res = responseCapture();
  await handler({ method: 'GET', query: { q: '석영' } }, res);
  assert.equal(res.code, 200);
  assert.ok(res.body.results.some((item) => item.source === 'Mindat'));
  assert.ok(res.body.results.some((item) => item.source === 'RRUFF'));
  assert.ok(res.body.results.every((item) => item.origin === 'external'));
  assert.ok(res.body.results.every((item) => item.link.startsWith('https://')));
});

test('ore query includes USGS and Korean geology reference', async () => {
  const results = handler.__test__.searchExternalReferences('황동석 광석');
  assert.ok(results.some((item) => item.source === 'USGS'));
  assert.ok(results.some((item) => item.source === 'KIGAM'));
});

test('chemical formula query is classified as a mineral search', () => {
  const results = handler.__test__.searchExternalReferences('Fe3O4');
  assert.ok(results.some((item) => item.source === 'Mindat'));
  assert.ok(results.some((item) => item.source === 'RRUFF'));
});

test('short query is rejected without an external result list', async () => {
  const res = responseCapture();
  await handler({ method: 'GET', query: { q: '암' } }, res);
  assert.equal(res.code, 400);
  assert.deepEqual(res.body.results, []);
});


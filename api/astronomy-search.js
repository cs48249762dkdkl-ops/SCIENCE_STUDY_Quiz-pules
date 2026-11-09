'use strict';

const PROVIDER_TIMEOUT_MS = 4500;
const MAX_QUERY_LENGTH = 80;
const EXOPLANET_TERMS = /외계행성|행성|exoplanet|planet|transit|통과|kepler|tess|외계/iu;

const CURATED_PARTNERS = [
  {
    source: 'ESA',
    kind: '관측 자료',
    title: 'ESA Gaia 과학 자료',
    description: 'Gaia 임무의 별 위치·거리·운동 자료와 과학 정보를 확인할 수 있는 공식 페이지입니다.',
    link: 'https://www.cosmos.esa.int/web/gaia',
    keywords: ['별', '항성', 'star', 'stellar', '은하', 'galaxy', '거리', 'gaia', 'astrometry'],
  },
  {
    source: 'ESA',
    kind: '연구 자료',
    title: 'ESA 우주과학 탐사',
    description: 'ESA의 우주과학 임무와 연구 성과를 제공하는 공식 탐사 자료입니다.',
    link: 'https://www.esa.int/Science_Exploration/Space_Science',
    keywords: ['블랙홀', 'black hole', '우주', '천문', 'astrophysics', '은하', 'galaxy', '외계행성', 'exoplanet'],
  },
  {
    source: 'KASI',
    kind: '연구 자료',
    title: '한국천문연구원(KASI) 천문우주과학 연구',
    description: '한국천문연구원의 관측·우주과학 연구 및 연구 자료를 확인할 수 있는 공식 페이지입니다.',
    link: 'https://www.kasi.re.kr/eng/',
    keywords: ['천문', '우주', 'astronomy', 'space', '행성', 'planet', '항성', 'star', '블랙홀', 'black hole', '외계행성', 'exoplanet'],
  },
];

function normaliseQuery(value) {
  return String(value || '').replace(/\s+/gu, ' ').trim().slice(0, MAX_QUERY_LENGTH);
}

function externalQueryFor(query) {
  const glossary = [
    [/블랙홀|사건지평선/iu, 'black hole'],
    [/외계행성|통과법|시선속도/iu, 'exoplanet transit'],
    [/암흑물질/iu, 'dark matter'],
    [/중성미자/iu, 'neutrino astrophysics'],
    [/중력파/iu, 'gravitational wave'],
    [/항성|별의|별\b/iu, 'stellar evolution'],
    [/은하/iu, 'galaxy'],
    [/우주론/iu, 'cosmology'],
    [/카이퍼|오르트|소행성/iu, 'Kuiper belt'],
    [/행성/iu, 'planetary science'],
    [/상대성이론|시공간/iu, 'relativity astrophysics'],
  ];
  const matches = glossary.filter(([pattern]) => pattern.test(query)).map(([, term]) => term);
  return matches.length ? [...new Set(matches)].join(' ') : query;
}

function cleanText(value, limit = 340) {
  return String(value || '')
    .replace(/<[^>]*>/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
    .slice(0, limit);
}

function decodeXml(value) {
  return cleanText(value)
    .replace(/&amp;/gu, '&')
    .replace(/&lt;/gu, '<')
    .replace(/&gt;/gu, '>')
    .replace(/&quot;/gu, '"')
    .replace(/&#39;/gu, "'");
}

function dateOnly(value) {
  const match = String(value || '').match(/^\d{4}-\d{2}-\d{2}/u);
  return match ? match[0] : null;
}

function scoreText(query, ...values) {
  const haystack = values.join(' ').toLocaleLowerCase('ko-KR');
  const words = normaliseQuery(query).toLocaleLowerCase('ko-KR').split(' ').filter(Boolean);
  return words.reduce((score, word) => score + (haystack.includes(word) ? 8 : 0), 0);
}

function externalResult({ source, kind, title, description, publishedAt, link, relevance = 1, summaryKo }) {
  return {
    id: `external-${source}-${link}`,
    origin: 'external',
    source,
    kind,
    title: cleanText(title, 180) || `${source} 자료`,
    description: cleanText(description, 360) || '원문 링크에서 자료의 상세 내용을 확인하세요.',
    summaryKo: summaryKo || `${source}의 공식 자료입니다. 원문 링크에서 세부 내용을 확인하세요.`,
    publishedAt: dateOnly(publishedAt),
    link,
    translation: '한국어 요약 제공 · 원문 번역은 브라우저 번역 기능 이용',
    relevance,
  };
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json, application/atom+xml;q=0.9, text/xml;q=0.8',
        'User-Agent': 'SCIENCE-STUDY-Astronomy-Search/1.0',
        ...(options.headers || {}),
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function searchNasaImages(query) {
  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;
  const response = await fetchWithTimeout(url);
  const payload = await response.json();
  const items = payload?.collection?.items || [];
  return items.slice(0, 3).flatMap((item) => {
    const data = item?.data?.[0] || {};
    if (!data.title || !data.nasa_id) return [];
    return [externalResult({
      source: 'NASA',
      kind: '관측 자료',
      title: data.title,
      description: data.description || 'NASA 공개 이미지와 관련 메타데이터입니다.',
      publishedAt: data.date_created,
      link: `https://images.nasa.gov/details-${encodeURIComponent(data.nasa_id)}`,
      relevance: 32 + scoreText(query, data.title, data.description),
      summaryKo: `NASA 공개 관측 자료입니다. “${cleanText(data.title, 90)}”의 원문 설명과 메타데이터를 확인할 수 있습니다.`,
    })];
  });
}

function atomValue(entry, tag) {
  const match = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'iu'));
  return match ? decodeXml(match[1]) : '';
}

async function searchArxiv(query) {
  const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=3&sortBy=relevance&sortOrder=descending`;
  const response = await fetchWithTimeout(url);
  const xml = await response.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/giu)].map((match) => match[1]);
  return entries.slice(0, 3).flatMap((entry) => {
    const id = atomValue(entry, 'id');
    const title = atomValue(entry, 'title');
    if (!id || !title) return [];
    const published = atomValue(entry, 'published');
    const summary = atomValue(entry, 'summary');
    return [externalResult({
      source: 'arXiv',
      kind: '논문',
      title,
      description: summary || 'arXiv에 공개된 연구 초록입니다.',
      publishedAt: published,
      link: id,
      relevance: 36 + scoreText(query, title, summary),
      summaryKo: `arXiv에 공개된 천문학 연구 논문입니다. 제목·초록은 원문 기준이며, 원문 링크에서 전체 논문을 확인할 수 있습니다.`,
    })];
  });
}

function safeSqlTerm(query) {
  return cleanText(query, 48).replace(/[^A-Za-z0-9 .-]/gu, '').toLowerCase();
}

async function searchExoplanetArchive(query, originalQuery) {
  if (!EXOPLANET_TERMS.test(originalQuery)) return [];
  const term = safeSqlTerm(query);
  const where = term && !/exoplanet|planetary science/iu.test(term)
    ? ` where lower(pl_name) like '%${term}%' or lower(hostname) like '%${term}%'`
    : '';
  const statement = `select top 4 pl_name,hostname,discoverymethod,disc_pubdate,disc_refname from pscomppars${where} order by disc_pubdate desc`;
  const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(statement)}&format=json`;
  const response = await fetchWithTimeout(url);
  const rows = await response.json();
  return Array.isArray(rows) ? rows.slice(0, 4).flatMap((row) => {
    if (!row.pl_name) return [];
    const details = [row.hostname, row.discoverymethod].filter(Boolean).join(' · ');
    return [externalResult({
      source: 'NASA Exoplanet Archive',
      kind: '관측 데이터',
      title: row.pl_name,
      description: details || 'NASA Exoplanet Archive의 공개 행성계 항목입니다.',
      publishedAt: row.disc_pubdate,
      link: 'https://exoplanetarchive.ipac.caltech.edu/',
      relevance: 34 + scoreText(originalQuery, row.pl_name, details),
      summaryKo: `NASA Exoplanet Archive의 공개 카탈로그 항목입니다${row.hostname ? ` · 모항성: ${row.hostname}` : ''}${row.discoverymethod ? ` · 발견 방법: ${row.discoverymethod}` : ''}.`,
    })];
  }) : [];
}

async function searchAds(query) {
  const token = process.env.NASA_ADS_TOKEN;
  if (!token) return [];
  const params = new URLSearchParams({
    q: query,
    fl: 'title,abstract,pubdate,bibcode',
    rows: '3',
    sort: 'score desc',
  });
  const response = await fetchWithTimeout(`https://api.adsabs.harvard.edu/v1/search/query?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await response.json();
  return (payload?.response?.docs || []).slice(0, 3).flatMap((doc) => {
    const title = Array.isArray(doc.title) ? doc.title[0] : doc.title;
    if (!title || !doc.bibcode) return [];
    return [externalResult({
      source: 'NASA ADS',
      kind: '논문',
      title,
      description: doc.abstract || 'NASA ADS 서지·초록 자료입니다.',
      publishedAt: doc.pubdate,
      link: `https://ui.adsabs.harvard.edu/abs/${encodeURIComponent(doc.bibcode)}/abstract`,
      relevance: 40 + scoreText(query, title, doc.abstract),
      summaryKo: 'NASA ADS의 천문학 논문 서지·초록 자료입니다. 원문 접근 범위는 출판사와 ADS 표시 조건에 따라 달라질 수 있습니다.',
    })];
  });
}

function searchCuratedPartners(query) {
  const lower = query.toLocaleLowerCase('ko-KR');
  return CURATED_PARTNERS.filter((item) => item.keywords.some((keyword) => lower.includes(keyword.toLocaleLowerCase('ko-KR'))))
    .map((item) => externalResult({
      ...item,
      relevance: 24 + scoreText(query, item.title, item.description, item.keywords.join(' ')),
      summaryKo: `${item.source}의 공식 연구·관측 자료로 연결됩니다. 제공 기관 페이지에서 최신 원문과 데이터 접근 조건을 확인하세요.`,
    }));
}

function uniqueAndSort(results) {
  const unique = new Map();
  for (const result of results.flat()) {
    if (!result?.link || unique.has(result.link)) continue;
    unique.set(result.link, result);
  }
  return [...unique.values()].sort((a, b) => b.relevance - a.relevance || a.title.localeCompare(b.title, 'ko'));
}

async function handler(req, res) {
  if (req.method && req.method !== 'GET') {
    res.status(405).json({ error: 'GET 요청만 지원합니다.' });
    return;
  }

  const query = normaliseQuery(req.query?.q);
  if (query.length < 2) {
    res.status(400).json({ error: '두 글자 이상 입력하세요.', results: [], warnings: [] });
    return;
  }

  const providerQuery = externalQueryFor(query);
  const tasks = [
    ['NASA', () => searchNasaImages(providerQuery)],
    ['arXiv', () => searchArxiv(providerQuery)],
    ['NASA Exoplanet Archive', () => searchExoplanetArchive(providerQuery, query)],
    ['NASA ADS', () => searchAds(providerQuery)],
  ].map(async ([name, run]) => {
    try {
      return { name, results: await run(), warning: null };
    } catch {
      return { name, results: [], warning: `${name} 자료를 이번 검색에서 불러오지 못했습니다.` };
    }
  });

  const settled = await Promise.all(tasks);
  const results = uniqueAndSort([
    ...settled.map((item) => item.results),
    searchCuratedPartners(query),
  ]);
  const warnings = settled.map((item) => item.warning).filter(Boolean);

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
  res.status(200).json({
    query,
    results,
    warnings,
    sources: ['NASA', 'ESA', 'KASI', 'NASA Exoplanet Archive', 'arXiv', ...(process.env.NASA_ADS_TOKEN ? ['NASA ADS'] : [])],
  });
}

module.exports = handler;
module.exports.__test__ = { normaliseQuery, externalQueryFor, decodeXml, atomValue, searchCuratedPartners, uniqueAndSort };


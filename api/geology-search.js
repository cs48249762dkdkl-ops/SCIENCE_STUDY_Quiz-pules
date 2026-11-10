const MAX_QUERY_LENGTH = 80;

function normaliseQuery(value) {
  return String(value || '')
    .replace(/[<>]/gu, '')
    .replace(/\s+/gu, ' ')
    .trim()
    .slice(0, MAX_QUERY_LENGTH);
}

function encoded(url, query) {
  return `${url}${encodeURIComponent(query)}`;
}

function classify(query) {
  const value = query.toLocaleLowerCase('ko-KR');
  const formula = /[a-z]{1,2}\d+[a-z0-9]*/u.test(value);
  const mineral = formula || /석영|quartz|방해석|calcite|황철석|pyrite|자철석|magnetite|적철석|hematite|황동석|chalcopyrite|광물|mineral|결정|crystal|모스|mohs|경도|화학식|formula|규산염|silicate/u.test(value);
  const ore = /광석|ore|철광|iron ore|동광|copper ore|보크사이트|bauxite|방연석|galena|섬아연석|sphalerite|우라늄|uranium|광상|deposit|자원|resource/u.test(value);
  const rock = /암석|rock|화강암|granite|현무암|basalt|석회암|limestone|사암|sandstone|셰일|shale|대리암|marble|편마암|gneiss|규암|quartzite/u.test(value);
  const korea = /한국|korea|한반도|korean|지질도|geologic map/u.test(value);
  return { mineral, ore, rock, korea };
}

function externalResult({ source, title, description, link, kind }) {
  return {
    id: `external-${source}-${link}`,
    origin: 'external',
    source,
    type: kind,
    title,
    description,
    link,
    sourceNote: '외부 공개 원문으로 이동합니다. 원문 안의 사진·데이터 이용 조건을 확인하세요.',
  };
}

function searchExternalReferences(query) {
  const kind = classify(query);
  const results = [];

  if (kind.mineral) {
    results.push(externalResult({
      source: 'Mindat',
      kind: 'mineral',
      title: `Mindat 원문 검색 · ${query}`,
      description: '광물명·동의어·산지와 사진 원문을 Mindat에서 확인합니다. 이 서비스는 Mindat API 데이터를 수집하거나 재게시하지 않습니다.',
      link: encoded('https://www.mindat.org/search.php?search=', query),
    }));
    results.push(externalResult({
      source: 'RRUFF',
      kind: 'mineral',
      title: `RRUFF 광물 식별 자료 · ${query}`,
      description: '결정구조·라만/회절 등 식별 자료는 RRUFF 원문 검색에서 확인합니다.',
      link: encoded('https://rruff.info/?search=', query),
    }));
  }

  if (kind.ore) {
    results.push(externalResult({
      source: 'USGS',
      kind: 'ore',
      title: `USGS 광물자원 자료 · ${query}`,
      description: '광물 자원·생산·수요 맥락은 USGS National Minerals Information Center의 원문에서 확인합니다.',
      link: 'https://www.usgs.gov/centers/national-minerals-information-center/mineral-commodity-summaries',
    }));
  }

  results.push(externalResult({
    source: 'KIGAM',
    kind: kind.korea ? 'geology' : (kind.ore ? 'ore' : kind.mineral ? 'mineral' : kind.rock ? 'rock' : 'geology'),
    title: `KIGAM 지오빅데이터 원문 검색 · ${query}`,
    description: '한국지질자원연구원(KIGAM) 지오빅데이터 오픈플랫폼의 공개 지질·자원 자료 검색으로 연결합니다.',
    link: encoded('https://data.kigam.re.kr/search?q=', query),
  }));

  results.push(externalResult({
    source: 'British Geological Survey',
    kind: kind.ore ? 'ore' : kind.mineral ? 'mineral' : kind.rock ? 'rock' : 'geology',
    title: `BGS 지질학 원문 검색 · ${query}`,
    description: '암석·광물·지질 개념의 영문 원문은 British Geological Survey의 공개 자료에서 확인합니다.',
    link: encoded('https://www.bgs.ac.uk/?s=', query),
  }));

  return results;
}

async function handler(req, res) {
  if (req.method && req.method !== 'GET') {
    res.status(405).json({ error: 'GET 요청만 지원합니다.', results: [] });
    return;
  }

  const query = normaliseQuery(req.query?.q);
  if (query.length < 2) {
    res.status(400).json({ error: '두 글자 이상 입력하세요.', results: [] });
    return;
  }

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).json({
    query,
    results: searchExternalReferences(query),
    sources: ['Mindat', 'RRUFF', 'USGS', 'KIGAM', 'British Geological Survey'],
    notice: 'Mindat API는 별도 승인·키가 필요하므로 호출하지 않습니다. 이 결과는 원문 검색·공개 기관 링크만 제공합니다.',
  });
}

module.exports = handler;
module.exports.__test__ = { normaliseQuery, classify, searchExternalReferences };


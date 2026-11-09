(() => {
  const internalItems = [
    { id: 'overview', kind: '내부 강의', category: 'learning', title: '천문학: 우주를 구조적으로 이해하기', description: '중력·운동·빛·시공간의 관점으로 우주의 현상을 연결해 학습합니다.', tags: ['천문학', '우주', '중력', '빛', '시공간', 'astronomy'], link: '#integrated-search' },
    { id: 'planets', kind: '내부 강의', category: 'learning', title: '태양계의 8개 행성', description: '수성부터 해왕성까지 각 행성의 환경·구조·관측 포인트를 하나의 강의로 학습합니다.', tags: ['행성', '태양계', '수성', '금성', '지구', '화성', '목성', '토성', '천왕성', '해왕성', 'planet'], link: '#planet-lessons' },
    { id: 'stars', kind: '내부 강의', category: 'learning', title: '항성의 탄생과 진화', description: '분자 구름에서 태어난 별이 질량에 따라 백색왜성·중성자별·블랙홀로 진화하는 과정을 다룹니다.', tags: ['항성', '별', 'stellar', 'star', '초신성', '중성자별'], link: '#cosmic-frontier' },
    { id: 'galaxy', kind: '내부 강의', category: 'learning', title: '은하와 우주 거리 사다리', description: '표준 촉광·세페이드 변광성·적색편이를 통해 우주 거리를 추정하는 단서를 살펴봅니다.', tags: ['은하', '적색편이', '거리', 'galaxy', 'cosmology'], link: '#cosmic-frontier' },
    { id: 'exoplanet', kind: '내부 강의', category: 'learning', title: '외계행성: 통과법과 시선속도법', description: '별빛의 감소와 도플러 이동으로 외계행성의 반지름·최소 질량을 추정하는 방법을 설명합니다.', tags: ['외계행성', '통과법', '시선속도', 'exoplanet', 'transit', 'kepler', 'tess'], link: '#cosmic-frontier' },
    { id: 'small-bodies', kind: '내부 강의', category: 'learning', title: '소행성대·카이퍼 벨트·오르트 구름', description: '태양계의 작은 천체와 장주기 혜성의 먼 저장고 모형을 구분합니다.', tags: ['소행성', '카이퍼', '오르트', '혜성', 'kuiper belt'], link: '#cosmic-frontier' },
    { id: 'neutrino', kind: '내부 강의', category: 'learning', title: '중성미자와 IceCube', description: '빙하 속 체렌코프 빛 관측을 이용한 고에너지 천체물리 중성미자 연구를 설명합니다.', tags: ['중성미자', 'icecube', '체렌코프', 'neutrino'], link: '#cosmic-frontier' },
    { id: 'dark-matter', kind: '내부 개념', category: 'learning', title: '암흑물질: 증거와 미해결 질문', description: '회전 곡선·중력렌즈·우주배경복사가 가리키는 질량 성분과 남은 문제를 구분합니다.', tags: ['암흑물질', '중력렌즈', '우주배경복사', 'dark matter'], link: '#cosmic-frontier' },
    { id: 'black-hole', kind: '내부 강의', category: 'learning', title: '블랙홀과 강한 중력', description: '주변 별·가스 운동, 중력파, 그림자 관측을 통해 블랙홀의 증거를 이해합니다.', tags: ['블랙홀', '사건지평선', '중력파', 'black hole', 'event horizon'], link: '#cosmic-frontier' },
    { id: 'kepler', kind: '내부 수식', category: 'formula', title: '케플러 제3법칙: P² = a³', description: '태양 질량이 지배적인 경우 공전주기와 장반경의 근사 관계 및 계산 예제를 제공합니다.', tags: ['케플러', '공전주기', '장반경', 'kepler', 'orbit', 'formula'], link: '#calculations' },
    { id: 'distance', kind: '내부 수식', category: 'formula', title: '거리 모듈러스', description: '겉보기등급과 절대등급의 차이로 거리를 추정하는 식과 학습용 계산기를 제공합니다.', tags: ['거리 모듈러스', '등급', '광도', 'distance modulus', 'formula'], link: '#calculations' },
    { id: 'escape', kind: '내부 수식', category: 'formula', title: '탈출속도: vₑ = √(2GM / r)', description: '이상화된 중력장에서 탈출속도를 계산할 때의 가정과 지구 예시를 설명합니다.', tags: ['탈출속도', '중력', 'escape velocity', 'formula'], link: '#calculations' },
    { id: 'relativity', kind: '내부 수식', category: 'formula', title: '상대론 시간 지연', description: 'Δt = γΔτ 식의 관성계·빛의 속도·고속 조건을 분명히 하며 학습합니다.', tags: ['상대성이론', '시간 지연', '시공간', 'relativity', 'formula'], link: '#calculations' },
    { id: 'quiz', kind: '내부 퀴즈', category: 'formula', title: '천문학 퀴즈와 나의 학습 노트', description: '케플러 법칙·외계행성·오르트 구름·중성미자·암흑물질·블랙홀 개념을 확인하고 기기에 노트를 저장합니다.', tags: ['퀴즈', '노트', '케플러', '외계행성', '블랙홀', '중성미자'], link: '#review' },
    { id: 'research', kind: '내부 연구 링크', category: 'research', title: '천문학 연구 자료 모음', description: 'NASA Solar System, NASA Exoplanet Archive, IceCube, EHT, ESA Gaia, Planck의 공식 원문 링크를 제공합니다.', tags: ['nasa', 'esa', 'kasi', 'ads', 'arxiv', '연구', '논문', '관측'], link: '#research-sources' },
  ];

  const form = document.getElementById('astronomy-search-form');
  const input = document.getElementById('astronomy-search-input');
  const resultsRoot = document.getElementById('astronomy-search-results');
  const status = document.getElementById('astronomy-search-status');
  const warning = document.getElementById('astronomy-search-warning');
  const clearButton = document.getElementById('astronomy-search-clear');
  const filterButtons = [...document.querySelectorAll('[data-search-filter]')];
  let activeFilter = 'all';
  let currentResults = [];
  let requestVersion = 0;
  let pendingRequest = null;
  let debounceTimer = null;

  function normalise(value) {
    return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('ko-KR');
  }

  function countMatches(text, term) {
    if (!term) return 0;
    return text.split(term).length - 1;
  }

  function searchInternal(query) {
    const terms = normalise(query).split(' ').filter(Boolean);
    return internalItems.map((item) => {
      const title = normalise(item.title);
      const details = normalise(`${item.description} ${item.tags.join(' ')}`);
      const score = terms.reduce((total, term) => total + countMatches(title, term) * 32 + countMatches(details, term) * 9, 0);
      return { ...item, origin: 'internal', source: 'SCIENCE STUDY', publishedAt: null, translation: '한국어 원문', relevance: score + 30 };
    }).filter((item) => item.relevance > 30).sort((a, b) => b.relevance - a.relevance || a.title.localeCompare(b.title, 'ko'));
  }

  function passesFilter(item) {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'internal' || activeFilter === 'external') return item.origin === activeFilter;
    if (activeFilter === 'learning') return item.origin === 'internal' && item.category === 'learning';
    if (activeFilter === 'formula') return item.origin === 'internal' && item.category === 'formula';
    return item.origin === 'external' || item.category === 'research';
  }

  function createElement(name, className, text) {
    const element = document.createElement(name);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function renderResults() {
    const visible = currentResults.filter(passesFilter);
    resultsRoot.replaceChildren();
    if (!visible.length && input.value.trim()) {
      resultsRoot.append(createElement('p', 'search-status', '선택한 조건에서 일치하는 결과가 없습니다. 필터를 바꾸거나 더 구체적으로 검색해 보세요.'));
      return;
    }
    visible.forEach((item) => {
      const card = createElement('article', 'search-card');
      const badge = createElement('span', 'tag', item.origin === 'internal' ? `내부 · ${item.kind}` : `외부 · ${item.source}`);
      const title = createElement('h3', '', item.title);
      const description = createElement('p', '', item.description);
      const summary = item.summaryKo ? createElement('p', 'search-summary', item.summaryKo) : null;
      const metadata = createElement('div', 'search-meta');
      metadata.append(
        createElement('span', '', item.origin === 'internal' ? '출처: SCIENCE STUDY' : `출처: ${item.source}`),
        createElement('span', '', item.origin === 'internal' ? '학습 콘텐츠' : `발행일: ${item.publishedAt || '미상'}`),
        createElement('span', '', item.translation || '한국어 요약 여부 미상'),
      );
      const link = createElement('a', '', item.origin === 'internal' ? '학습 내용으로 이동 →' : '원문 열기 ↗');
      link.href = item.link;
      if (item.origin === 'external') {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      card.append(badge, title, description);
      if (summary) card.append(summary);
      card.append(metadata, link);
      resultsRoot.append(card);
    });
  }

  function mergeAndSort(internal, external) {
    const unique = new Map();
    [...internal, ...external].forEach((item) => {
      const key = `${item.origin}:${item.link}`;
      if (!unique.has(key)) unique.set(key, item);
    });
    return [...unique.values()].sort((a, b) => b.relevance - a.relevance || a.title.localeCompare(b.title, 'ko'));
  }

  async function runSearch() {
    const query = input.value.trim().replace(/\s+/g, ' ');
    const version = ++requestVersion;
    if (pendingRequest) pendingRequest.abort();
    warning.textContent = '';
    if (!query) {
      currentResults = [];
      status.textContent = '검색어를 입력하면 내부 학습 콘텐츠와 외부 공식 자료를 하나의 관련성 순 목록으로 표시합니다.';
      renderResults();
      return;
    }

    const internal = searchInternal(query);
    currentResults = internal;
    renderResults();
    if (query.length < 2) {
      status.textContent = `내부 결과 ${internal.length}개를 표시했습니다. 외부 자료 검색은 두 글자 이상에서 함께 실행됩니다.`;
      return;
    }

    status.textContent = `내부 결과 ${internal.length}개와 외부 공식 자료를 함께 검색하고 있습니다…`;
    resultsRoot.setAttribute('aria-busy', 'true');
    pendingRequest = new AbortController();
    try {
      const response = await fetch(`/api/astronomy-search?q=${encodeURIComponent(query)}`, { signal: pendingRequest.signal });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || '외부 검색 요청에 실패했습니다.');
      if (version !== requestVersion) return;
      const external = Array.isArray(payload.results) ? payload.results : [];
      currentResults = mergeAndSort(internal, external);
      status.textContent = `관련성 순으로 내부 ${internal.length}개와 외부 ${external.length}개를 한 목록에 표시했습니다.`;
      warning.textContent = (payload.warnings || []).join(' ');
      renderResults();
    } catch (error) {
      if (error.name === 'AbortError' || version !== requestVersion) return;
      currentResults = internal;
      status.textContent = `내부 결과 ${internal.length}개를 표시했습니다.`;
      warning.textContent = '외부 자료를 이번 검색에서 불러오지 못했습니다. 내부 검색은 정상적으로 사용할 수 있습니다.';
      renderResults();
    } finally {
      if (version === requestVersion) {
        resultsRoot.setAttribute('aria-busy', 'false');
        pendingRequest = null;
      }
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearTimeout(debounceTimer);
    runSearch();
  });

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runSearch, 350);
  });

  clearButton.addEventListener('click', () => {
    clearTimeout(debounceTimer);
    input.value = '';
    runSearch();
    input.focus();
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.searchFilter;
      filterButtons.forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
      renderResults();
    });
  });
})();


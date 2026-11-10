(() => {
  'use strict';

  const sourceLinks = {
    Mindat: 'https://www.mindat.org/',
    RRUFF: 'https://rruff.info/',
    USGS: 'https://www.usgs.gov/centers/national-minerals-information-center',
    KIGAM: 'https://data.kigam.re.kr/',
    'British Geological Survey': 'https://www.bgs.ac.uk/',
  };

  const mineral = (id, ko, en, aliases, formula, elements, composition, properties, formation, locality, uses, related) => ({
    id, type: 'mineral', origin: 'internal', title: ko, titleEn: en, aliases, formula, elements, composition,
    properties, formation, locality, uses, related,
    description: `${en} · 광물`,
    sourceNote: '내부 학습 데이터 · 물성은 대표적인 순수 광물의 일반 범위입니다. 자연 시료는 치환·내포물·불순물에 따라 달라질 수 있습니다.',
    sources: ['Mindat', 'RRUFF'],
  });
  const ore = (id, ko, en, aliases, metals, components, formation, locality, uses, related) => ({
    id, type: 'ore', origin: 'internal', title: ko, titleEn: en, aliases, metals, components, formation, locality, uses, related,
    description: `${en} · 광석`,
    composition: '광석은 경제적 채굴 대상인 암석 또는 광물 집합체입니다. 단일 화학식·고정 함량으로 표기하지 않으며, 품위와 불순물은 광상·시료마다 변합니다.',
    sourceNote: '내부 학습 데이터 · 금속 회수 가능성·품위는 광상별 시험 분석과 자원 보고서로 확인해야 합니다.',
    sources: ['USGS', 'KIGAM'],
  });
  const rock = (id, ko, en, aliases, kind, composition, formation, uses, related) => ({
    id, type: 'rock', origin: 'internal', title: ko, titleEn: en, aliases, kind, composition, formation, uses, related,
    description: `${en} · ${kind}`,
    sourceNote: '내부 학습 데이터 · 암석 조성은 산지와 분류 기준에 따라 달라집니다.',
    sources: ['British Geological Survey', 'KIGAM'],
  });
  const lesson = (id, title, level, summary, aliases) => ({
    id, type: 'geology', origin: 'internal', title, titleEn: 'Geology learning module', aliases, level, summary,
    description: `${level} 강의 · 퀴즈 · 실습`,
    sourceNote: '내부 학습 데이터 · 개념 학습 뒤 퀴즈와 관찰·지도 읽기 실습으로 이어집니다.',
    sources: ['KIGAM', 'British Geological Survey'],
  });

  const records = [
    mineral('quartz', '석영', 'Quartz', 'silica 수정 크리스탈 SiO2', 'SiO₂', '규소(Si), 산소(O)', '이론 조성(순수 SiO₂, 질량 %): Si 46.74%, O 53.26%. 자연 시료의 미량 치환·내포물은 별도 분석이 필요합니다.', '결정계: 삼방정계 · 경도: Mohs 7 · 밀도: 약 2.65 g/cm³ · 색/광택: 무색~다양 · 유리광택', '규산염질 마그마·열수·변성·퇴적 환경에서 흔히 생성됩니다.', '전 세계 화강암·사암·열수맥 등에 널리 산출', '유리·세라믹·전자·연마재', '규소 · 장석 · 화강암 · 규암'),
    mineral('calcite', '방해석', 'Calcite', 'calcium carbonate 석회석 CaCO3', 'CaCO₃', '칼슘(Ca), 탄소(C), 산소(O)', '이론 조성(순수 CaCO₃, 질량 %): Ca 40.04%, C 12.00%, O 47.96%. Mg·Fe 치환과 불순물에 따라 자연 시료는 달라질 수 있습니다.', '결정계: 삼방정계 · 경도: Mohs 3 · 밀도: 약 2.71 g/cm³ · 색/광택: 무색~백색 등 · 유리~진주광택', '해수·호수의 화학 침전, 생물 기원 퇴적, 열수·변성 환경에서 생성됩니다.', '석회암·대리암·동굴 생성물에 흔함', '시멘트·석회·건축재·토양 개량', '칼슘 · 석회암 · 대리암 · 백운석'),
    mineral('pyrite', '황철석', 'Pyrite', 'fools gold iron disulfide FeS2', 'FeS₂', '철(Fe), 황(S)', '이론 조성(순수 FeS₂, 질량 %): Fe 46.55%, S 53.45%. 산화·미량 원소·내포물에 따라 달라질 수 있습니다.', '결정계: 등축정계(입방정계) · 경도: Mohs 6–6.5 · 밀도: 약 4.9–5.2 g/cm³ · 색/광택: 황동색 · 금속광택', '환원성 퇴적 환경·열수맥·변성 및 화성 환경에서 형성됩니다.', '퇴적암·열수 광상·석탄층 등에 널리 산출', '황·철의 지구화학 지시자; 산성광산배수 관리에서 중요', '철 · 황 · 황화물 광상 · 산성광산배수'),
    mineral('magnetite', '자철석', 'Magnetite', 'iron oxide Fe3O4 magnetic', 'Fe₃O₄', '철(Fe), 산소(O)', '이론 조성(순수 Fe₃O₄, 질량 %): Fe 72.36%, O 27.64%. Ti·V 치환 및 맥석 혼입에 따라 광석 시료는 달라집니다.', '결정계: 등축정계(입방정계) · 경도: Mohs 5.5–6.5 · 밀도: 약 5.15–5.20 g/cm³ · 색/광택: 흑색 · 금속~반금속광택', '마그마 분화, 접촉변성·스카른, 퇴적·변성 과정에서 생성됩니다.', '층상 철광층·마그마성 Fe-Ti-V 광상·스카른', '철강 원료의 주요 광물; 고자기 기록 연구', '철광석 · 적철석 · 철(Fe) · 티탄철석'),
    mineral('hematite', '적철석', 'Hematite', 'iron oxide Fe2O3', 'Fe₂O₃', '철(Fe), 산소(O)', '이론 조성(순수 Fe₂O₃, 질량 %): Fe 69.94%, O 30.06%. 맥석과 수산화철 혼입에 따라 광석 품위는 달라집니다.', '결정계: 삼방정계 · 경도: Mohs 5–6.5 · 밀도: 약 5.26 g/cm³ · 색/광택: 강철회색~적갈색 · 금속~토상광택', '산화성 퇴적·열수·변성 및 풍화 환경에서 형성됩니다.', '층상 철광층·스카른·풍화대', '철강 원료·안료', '철광석 · 자철석 · 철(Fe) · 갈철석'),
    mineral('chalcopyrite', '황동석', 'Chalcopyrite', 'copper iron sulfide CuFeS2', 'CuFeS₂', '구리(Cu), 철(Fe), 황(S)', '이론 조성(순수 CuFeS₂, 질량 %): Cu 34.62%, Fe 30.43%, S 34.95%. 풍화·동반 광물·맥석에 따라 광석 시료는 달라집니다.', '결정계: 정방정계 · 경도: Mohs 3.5–4 · 밀도: 약 4.1–4.3 g/cm³ · 색/광택: 황동색(변색 가능) · 금속광택', '주로 열수·반암형·스카른·VMS형 황화물 광상에서 생성됩니다.', '반암동 광상·열수맥·화산성 괴상황화물 광상', '구리 생산의 대표 광물', '동광석 · 구리(Cu) · 황철석 · 보나이트'),
    mineral('galena', '방연석', 'Galena', 'lead sulfide PbS', 'PbS', '납(Pb), 황(S)', '이론 조성(순수 PbS, 질량 %): Pb 86.60%, S 13.40%. 은 등 동반 원소와 맥석은 산지에 따라 다릅니다.', '결정계: 등축정계(입방정계) · 경도: Mohs 2.5 · 밀도: 약 7.2–7.6 g/cm³ · 색/광택: 납회색 · 금속광택', '열수성 다금속 광상에서 흔히 생성됩니다.', '납-아연 열수맥·MVT형 광상', '납 생산; 은을 동반할 수 있음', '납광석 · 아연광석 · 섬아연석 · 납(Pb)'),
    mineral('sphalerite', '섬아연석', 'Sphalerite', 'zinc sulfide ZnS blende', 'ZnS', '아연(Zn), 황(S)', '이론 조성(순수 ZnS, 질량 %): Zn 67.10%, S 32.90%. Fe 치환으로 조성·색·밀도가 달라질 수 있습니다.', '결정계: 등축정계(입방정계) · 경도: Mohs 3.5–4 · 밀도: 약 3.9–4.1 g/cm³ · 색/광택: 황갈색~흑색 · 수지광택', '열수·퇴적 분지·화산성 황화물 광상에서 생성됩니다.', 'MVT형·SEDEX형·VMS형·열수맥', '아연 생산; Cd·In·Ga 등이 동반될 수 있음', '아연광석 · 방연석 · 아연(Zn) · 황화물'),
    mineral('fluorite', '형석', 'Fluorite', 'calcium fluoride CaF2 fluorspar', 'CaF₂', '칼슘(Ca), 플루오린(F)', '이론 조성(순수 CaF₂, 질량 %): Ca 51.33%, F 48.67%. 희토류 등 미량 원소와 색 중심에 따라 색이 달라질 수 있습니다.', '결정계: 등축정계(입방정계) · 경도: Mohs 4 · 밀도: 약 3.18 g/cm³ · 색/광택: 무색~보라·녹색 등 · 유리광택', '열수맥·탄산염암 교대·일부 화성 환경에서 생성됩니다.', '열수 광상·탄산염암 관련 광상', '불소 화학·금속 제련·광학', '플루오린(F) · 방해석 · 열수 광상'),
    mineral('apatite', '인회석', 'Apatite', 'phosphate Ca5 PO4 fluor apatite', 'Ca₅(PO₄)₃(F,Cl,OH)', '칼슘(Ca), 인(P), 산소(O), 플루오린(F)/염소(Cl)/수산기(OH)', '고용체 계열 광물로 F·Cl·OH 비율이 변합니다. 단일 고정 질량%로 일반화하지 않습니다.', '결정계: 육방정계 · 경도: Mohs 5 · 밀도: 약 3.1–3.2 g/cm³ · 색/광택: 녹색·청색·갈색 등 · 유리광택', '화성암 부성분 광물, 인산염 퇴적층·열수·변성 환경에서 생성됩니다.', '탄산염암·알칼리 화성암·퇴적성 인광층', '인 비료·화학 원료', '인(P) · 인광석 · 화성암'),

    ore('iron-ore', '철광석', 'Iron ore', 'iron ore 철광 적철석 자철석', '철(Fe)', '주요 광물: 적철석(Fe₂O₃), 자철석(Fe₃O₄), 침철석·갈철석 계열. 맥석: 석영·점토 등.', '층상 철광층(BIF), 마그마성, 스카른, 풍화 농집 등 다양한 과정', '세계 여러 철광상; 산지별 광물·품위 상이', '철강 생산', '적철석 · 자철석 · 철(Fe)'),
    ore('copper-ore', '동광석', 'Copper ore', 'copper ore 동광 황동석', '구리(Cu)', '주요 광물: 황동석(CuFeS₂), 보나이트, 휘동석 등. 산화대에는 공작석·남동석 등이 산출될 수 있음.', '반암형·스카른·VMS형·퇴적성 구리 광상 등', '광상 유형별로 전 세계에 분포', '전선·전자·합금', '황동석 · 구리(Cu) · 몰리브데넘'),
    ore('bauxite', '보크사이트', 'Bauxite', 'aluminium aluminum ore 알루미늄 광석', '알루미늄(Al)', '주요 광물: 깁사이트·뵈마이트·다이아스포어와 철 산화물·점토. 단일 광물이 아님.', '고온다습 환경의 강한 화학 풍화로 Al이 잔류·농집', '열대·아열대 라테라이트 풍화 지각', '알루미나·알루미늄 생산', '알루미늄(Al) · 깁사이트 · 라테라이트'),
    ore('lead-ore', '납광석', 'Lead ore', 'lead ore 납 광석 방연석', '납(Pb), 은(Ag, 동반 가능)', '주요 광물: 방연석(PbS). 아연·은·구리·황화물 광물이 동반될 수 있음.', '열수성 다금속·MVT형·SEDEX형 광상', '퇴적 분지·열수맥 등', '납 생산; 동반 금속 회수 가능', '방연석 · 아연광석 · 섬아연석'),
    ore('zinc-ore', '아연광석', 'Zinc ore', 'zinc ore 아연 광석 섬아연석', '아연(Zn), 카드뮴(Cd, 동반 가능)', '주요 광물: 섬아연석(ZnS), 스미소나이트·헤미모파이트(산화대) 등.', 'MVT·SEDEX·VMS·열수맥 등', '퇴적 분지·화산성 환경·열수맥', '도금·합금·배터리', '섬아연석 · 방연석 · 아연(Zn)'),
    ore('uranium-ore', '우라늄광석', 'Uranium ore', 'uranium ore 우라늄 광석 우라니나이트', '우라늄(U)', '주요 광물: 우라니나이트, 코피나이트 등. 탄산염·규산염·황화물 등과 동반될 수 있음.', '불일치형·사암형·화강암 관련·각력암형 등 다양', '광상 유형별로 산출; 방사선 안전·규제가 핵심', '규제된 핵연료 주기 원료', '우라니나이트 · 우라늄(U) · 방사성 원소'),
    ore('gold-ore', '금광석', 'Gold ore', 'gold ore 금 광석 자연금', '금(Au), 은(Ag, 동반 가능)', '자연금·텔루르화물·황화물 속 미세 금 등 다양한 산출 형태. 단일 조성으로 표기할 수 없음.', '조산대 열수맥·반암형/에피서멀·사금 등', '열수맥·변질대·하천 퇴적물', '귀금속·전자', '자연금 · 황철석 · 열수 광상'),

    rock('granite', '화강암', 'Granite', 'granite 화성암 심성암', '화성암(심성암)', '주로 석영·알칼리장석·사장석·운모. 정확한 비율은 암체마다 다릅니다.', '규산질 마그마가 지하에서 서서히 냉각·결정화', '건축석재·지각 분화 학습', '석영 · 장석 · 판 구조론'),
    rock('basalt', '현무암', 'Basalt', 'basalt 화성암 화산암', '화성암(화산암)', '주로 사장석·휘석·감람석과 유리질. 조성은 마그마·변질 정도에 따라 다릅니다.', '현무질 마그마가 지표 또는 해저에서 빠르게 냉각', '화산·해양지각·제주도 지질 학습', '화산 · 맨틀 · 판 구조론'),
    rock('limestone', '석회암', 'Limestone', 'limestone sedimentary rock 석회암', '퇴적암', '주로 방해석(CaCO₃), 때로 백운석·화석·점토질을 포함합니다.', '탄산염의 화학·생물학적 퇴적 및 재결정', '시멘트·카르스트·화석 학습', '방해석 · 대리암 · 지하수'),
    rock('sandstone', '사암', 'Sandstone', 'sandstone sedimentary rock 사암', '퇴적암', '주로 석영·장석 입자와 규질·탄산염·점토질 교결물.', '풍화된 입자가 운반·퇴적·다짐·교결', '퇴적 구조·지하수 저류층 학습', '석영 · 퇴적암 · 층서학'),
    rock('shale', '셰일', 'Shale', 'shale mudstone 이암 셰일', '퇴적암', '점토광물·실트 입자와 유기물 비율이 다양합니다.', '저에너지 수역에서 세립질 퇴적물이 층리 형성', '화석·유기물·사면 안정성 학습', '층서학 · 화석 · 지질재해'),
    rock('marble', '대리암', 'Marble', 'marble metamorphic rock 대리석', '변성암', '석회암 또는 백운암이 재결정되어 주로 방해석 또는 백운석으로 구성됩니다.', '열·압력·유체 작용에 따른 탄산염암의 변성', '건축석재·변성 작용 학습', '방해석 · 석회암 · 변성암'),
    rock('gneiss', '편마암', 'Gneiss', 'gneiss metamorphic rock 편마암', '변성암', '장석·석영·운모 등이 띠 모양으로 분리되는 경우가 많습니다.', '고온·고압 변성 및 변형으로 광물 분대 형성', '대륙지각·변성 등급 학습', '변성암 · 판 구조론 · 광물학'),
    rock('quartzite', '규암', 'Quartzite', 'quartzite 규암', '변성암', '석영이 재결정되어 치밀하게 맞물린 암석; 원암과 변성 정도에 따라 다릅니다.', '사암의 변성 재결정', '변성 작용·내구성 학습', '석영 · 사암 · 변성암'),

    lesson('earth-interior-basic', '지구 내부 구조: 지각·맨틀·핵', '기초', '지진파와 밀도 차이로 추론하는 지구 내부 구조', '지구 내부 구조 mantle core crust 지각 맨틀 핵'),
    lesson('earth-interior-advanced', '지구 내부 구조: 지진파·맨틀 대류', '고급', 'P파·S파와 맨틀 대류를 자료로 해석하는 실습', '지진파 S파 P파 맨틀 대류'),
    lesson('plate-basic', '판 구조론: 판 경계와 지형', '기초', '발산·수렴·보존 경계가 만드는 지형과 지진·화산', '판 구조론 tectonics 판 경계'),
    lesson('plate-advanced', '판 구조론: 섭입·조산·초대륙', '고급', '섭입대 단면과 고지자기 자료로 판 운동 추론', '섭입 조산 운동 고지자기'),
    lesson('mineral-basic', '광물학: 화학식·결정·물성', '기초', '광물과 암석의 구분, 화학식·경도·벽개 관찰', '광물학 mineralogy 결정 화학식 경도'),
    lesson('crystal-advanced', '결정학: 대칭·결정계·XRD', '고급', '결정 대칭과 회절 자료의 기초 해석', '결정학 crystallography XRD 결정계'),
    lesson('petrology-basic', '암석학: 화성암·퇴적암·변성암', '기초', '암석 순환과 세 암석군의 관찰 포인트', '암석학 petrology 화성암 퇴적암 변성암'),
    lesson('igneous-intermediate', '화성암: 마그마 분화와 조직', '중급', '냉각 속도·조직·광물 조성으로 화성암 읽기', '화성암 마그마 분화 현무암 화강암'),
    lesson('sedimentary-intermediate', '퇴적암: 퇴적 구조와 환경', '중급', '입도·층리·화석으로 퇴적 환경 해석', '퇴적암 층리 사암 셰일'),
    lesson('metamorphic-intermediate', '변성암: 변성상과 광물 조합', '중급', '온도·압력·유체 조건과 변성 광물의 관계', '변성암 변성상 편마암 대리암'),
    lesson('geologic-time-basic', '지질시대: 상대 연대와 절대 연대', '기초', '지층 누중·교차 관계와 방사성 연대 측정의 역할', '지질시대 연대 층서학 방사성'),
    lesson('stratigraphy-advanced', '층서학·화석: 지층 대비 실습', '고급', '화석군과 부정합으로 지질 단면을 대비', '층서학 화석 부정합 지층'),
    lesson('geochemistry-basic', '지구화학: 원소 순환과 동위원소', '기초', '친석·친철·친동 원소와 지구 내부 분화', '지구화학 geochemistry 원소 동위원소'),
    lesson('geochemistry-advanced', '지구화학: 미량 원소·동위원소 해석', '고급', '원소 거동과 동위원소비로 마그마·유체 과정 추론', '미량 원소 동위원소 마그마'),
    lesson('ore-basic', '광상·자원: 광물과 광석의 구분', '기초', '광물, 광석, 맥석, 품위의 정확한 구분', '광상 자원 광석 맥석 품위'),
    lesson('ore-advanced', '광상·자원: 광상 유형과 탐사', '고급', '반암형·VMS·MVT·사암형 광상과 탐사 지시자', '광상 탐사 반암 VMS MVT'),
    lesson('earthquake-basic', '지진: 단층과 지진파', '기초', '단층 운동과 지진파의 기본 측정', '지진 단층 지진파'),
    lesson('volcano-basic', '화산: 마그마와 분화 양식', '기초', '점성·휘발성분·판 환경에 따른 분화 차이', '화산 마그마 분화'),
    lesson('volcano-advanced', '화산·지진: 재해 지도 읽기', '고급', '위험도 지도와 관측 자료로 재해 의사결정 연습', '화산 지진 재해 위험 지도'),
    lesson('groundwater-basic', '지하수: 대수층과 물 순환', '기초', '공극·투수성·대수층과 오염 이동', '지하수 대수층 수문지질'),
    lesson('hazard-intermediate', '지질재해: 산사태·싱크홀·해안', '중급', '지질 조건과 강우·인간 활동이 만드는 위험', '지질재해 산사태 싱크홀'),
    lesson('korea-basic', '한국 지질: 한반도의 지질 단위', '기초', '한반도 지질의 큰 틀과 지질도 활용법', '한국 지질 한반도 KIGAM 지질도'),
    lesson('korea-advanced', '한국 지질: 지오빅데이터 지도 실습', '고급', 'KIGAM 공개 지도와 자료를 읽는 실습', '한국 지질 KIGAM 지오빅데이터 지도'),
    lesson('analysis-basic', '광석 원소 분석: 시료·단위·품위', '기초', 'ppm·wt%·품위와 대표성 있는 시료 채취', '광석 원소 분석 ppm 품위'),
    lesson('analysis-advanced', '광석 원소 분석: XRF·ICP·QA/QC', '고급', 'XRF·ICP 분석값과 표준물질·공시료로 품질 확인', 'XRF ICP QA QC 분석'),
    lesson('field-basic', '지질 답사: 안전·관찰·기록', '기초', '노두 관찰, 방위·경사 측정, 안전한 기록 실습', '지질 답사 노두 실습'),
    lesson('field-advanced', '지질 단면 작성과 자원 해석', '고급', '지질도·단면·시료 기록을 하나의 해석으로 연결', '지질 단면 지질도 자원'),
    lesson('quiz-mineral', '광물 식별 퀴즈: 화학식과 물성', '기초', '석영·방해석·황철석을 화학식·경도·광택으로 구별', '퀴즈 광물 식별 석영 방해석'),
    lesson('quiz-ore', '광석 퀴즈: 금속과 주요 광물', '중급', '철·구리·납·아연 광석의 주요 광물 구분', '퀴즈 광석 철 구리 납 아연'),
    lesson('lab-crystal', '실습: 결정계와 광물 카드 분류', '중급', '결정계·화학식·물성을 기준으로 카드 분류', '실습 결정계 광물'),
    lesson('lab-ore', '실습: 광석 조성과 변동성 읽기', '고급', '단일 광물 화학식과 광석 전체 조성·품위의 차이', '실습 광석 조성 품위 변동'),
    lesson('lab-map', '실습: 한국 지질도에서 암석 찾기', '중급', '공개 지질도에서 암석·단층·자원 정보 찾아보기', '실습 한국 지질도 암석 KIGAM'),
    lesson('lab-hazard', '실습: 지질재해 위험 요인 점검', '중급', '경사·암종·강우·배수 조건으로 위험 요인 정리', '실습 지질재해 산사태'),
    lesson('review-geology', '종합 복습: 지구 시스템과 자원', '고급', '판 구조·암석 순환·지구화학·광상을 연결하는 종합 퀴즈', '종합 복습 지질학 자원'),
  ];

  const typeLabels = { mineral: '광물', ore: '광석', rock: '암석', geology: '지질학' };
  const normalise = (value) => String(value || '').toLocaleLowerCase('ko-KR').replace(/[₀₁₂₃₄₅₆₇₈₉]/gu, (digit) => '0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(digit)]).replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const words = (value) => normalise(value).split(' ').filter(Boolean);
  const searchText = (record) => normalise([record.title, record.titleEn, record.aliases, record.formula, record.elements, record.metals, record.components, record.formation, record.composition, record.summary, record.related].filter(Boolean).join(' '));
  const matches = (record, query) => {
    const queryWords = words(query);
    const text = searchText(record);
    return queryWords.every((word) => text.includes(word));
  };
  const score = (record, query) => {
    const title = normalise(`${record.title} ${record.titleEn} ${record.aliases || ''}`);
    return words(query).reduce((total, word) => total + (title.includes(word) ? 10 : searchText(record).includes(word) ? 2 : 0), 0);
  };

  const form = document.getElementById('geology-unified-search-form');
  const input = document.getElementById('geology-unified-search-input');
  const filter = document.getElementById('geology-unified-search-filter');
  const status = document.getElementById('geology-unified-search-status');
  const results = document.getElementById('geology-unified-search-results');
  const summary = document.getElementById('geology-unified-search-summary');
  const notice = document.getElementById('geology-unified-search-notice');
  let currentExternal = [];
  let controller;
  let timer;

  function el(name, className, text) {
    const node = document.createElement(name);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function badge(text, mode) { return el('span', `geo-badge ${mode}`, text); }

  function sourcePill(source) {
    const link = el('a', 'geo-source', source);
    link.href = sourceLinks[source] || '#';
    link.target = '_blank';
    link.rel = 'noreferrer noopener';
    return link;
  }

  function addField(card, label, value) {
    if (!value) return;
    const field = el('div', 'geo-field');
    field.append(el('span', '', label), el('strong', '', value));
    card.append(field);
  }

  function internalCard(record) {
    const card = el('article', 'geo-result-card internal-result');
    const header = el('div', 'geo-result-header');
    const title = el('h3', '', record.title);
    const english = el('p', 'geo-english', record.titleEn);
    const badges = el('div', 'geo-badges');
    badges.append(badge('내부', 'internal'), badge(typeLabels[record.type], 'type'));
    header.append(title, english, badges);
    card.append(header, el('p', 'geo-result-description', record.description));

    if (record.type === 'mineral') {
      addField(card, '화학식', record.formula);
      addField(card, '주요 구성 원소', record.elements);
      addField(card, '화학 조성·함량', record.composition);
      addField(card, '결정계·물성', record.properties);
      addField(card, '생성 과정', record.formation);
      addField(card, '산지·산출', record.locality);
      addField(card, '활용', record.uses);
    } else if (record.type === 'ore') {
      addField(card, '금속 원소', record.metals);
      addField(card, '주요 광물 구성 성분', record.components);
      addField(card, '광석 조성 표기', record.composition);
      addField(card, '생성 과정', record.formation);
      addField(card, '산지·산출', record.locality);
      addField(card, '채굴·활용', record.uses);
    } else if (record.type === 'rock') {
      addField(card, '분류', record.kind);
      addField(card, '주요 구성 성분', record.composition);
      addField(card, '생성 과정', record.formation);
      addField(card, '활용·관찰', record.uses);
    } else {
      addField(card, '학습 내용', record.summary);
      addField(card, '수준', record.level);
    }
    addField(card, '관련', record.related);
    card.append(el('p', 'geo-caveat', record.sourceNote));
    const footer = el('div', 'geo-card-footer');
    footer.append(el('span', 'geo-sources-label', '원문 출처'));
    (record.sources || []).forEach((source) => footer.append(sourcePill(source)));
    card.append(footer);
    return card;
  }

  function externalCard(record) {
    const card = el('article', 'geo-result-card external-result');
    const header = el('div', 'geo-result-header');
    const title = el('h3', '', record.title);
    const badges = el('div', 'geo-badges');
    badges.append(badge('외부', 'external'), badge(record.source, 'source-badge'));
    header.append(title, badges);
    card.append(header, el('p', 'geo-result-description', record.description));
    card.append(el('p', 'geo-caveat', record.sourceNote));
    const open = el('a', 'geo-open-source', '원문 열기 ↗');
    open.href = record.link;
    open.target = '_blank';
    open.rel = 'noreferrer noopener';
    card.append(open);
    return card;
  }

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('error', isError);
  }

  function render() {
    const query = input.value.trim();
    const kind = filter.value;
    results.replaceChildren();
    notice.hidden = true;
    if (!query) {
      summary.textContent = '광물명·화학식·원소·암석·지질학 개념을 한 번에 검색하세요.';
      setStatus('검색어를 입력하면 내부 학습 자료와 외부 원문 자료를 하나의 목록으로 보여줍니다.');
      return;
    }
    const internal = records.filter((record) => (kind === 'all' || record.type === kind) && matches(record, query)).sort((a, b) => score(b, query) - score(a, query));
    const external = currentExternal.filter((record) => kind === 'all' || record.type === kind || (kind === 'geology' && record.type === 'ore'));
    summary.textContent = `통합 결과 ${internal.length + external.length}건 · 내부 ${internal.length}건 · 외부 ${external.length}건`;
    if (!internal.length && !external.length) {
      const empty = el('div', 'geo-empty');
      empty.append(el('strong', '', '일치하는 결과가 없습니다.'), el('p', '', '한국어·영문명, 동의어, 화학식(예: Fe3O4), 원소 기호(예: Cu), 지질학 개념으로 다시 검색해 보세요.'));
      results.append(empty);
      return;
    }
    [...internal.map(internalCard), ...external.map(externalCard)].forEach((card) => results.append(card));
  }

  async function loadExternal(query) {
    if (query.length < 2) {
      currentExternal = [];
      render();
      return;
    }
    if (controller) controller.abort();
    controller = new AbortController();
    setStatus('내부 학습 자료와 외부 원문 자료를 함께 찾는 중…');
    try {
      const response = await fetch(`/api/geology-search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || '외부 자료를 불러오지 못했습니다.');
      if (input.value.trim() !== query) return;
      currentExternal = Array.isArray(payload.results) ? payload.results : [];
      notice.textContent = payload.notice || '';
      notice.hidden = !notice.textContent;
      setStatus('검색을 마쳤습니다. 내부 자료는 외부 연결 상태와 관계없이 계속 사용할 수 있습니다.');
    } catch (error) {
      if (error.name === 'AbortError') return;
      currentExternal = [];
      notice.textContent = '외부 원문 자료를 지금 불러오지 못했습니다. 내부 학습 검색 결과는 그대로 사용할 수 있습니다.';
      notice.hidden = false;
      setStatus('외부 자료 연결에 실패했습니다. 내부 검색 결과를 표시합니다.', true);
    }
    render();
  }

  function scheduleSearch() {
    clearTimeout(timer);
    const query = input.value.trim();
    currentExternal = [];
    render();
    timer = setTimeout(() => loadExternal(query), 280);
  }

  form.addEventListener('submit', (event) => { event.preventDefault(); clearTimeout(timer); loadExternal(input.value.trim()); });
  input.addEventListener('input', scheduleSearch);
  filter.addEventListener('change', render);
  render();
})();


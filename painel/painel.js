// ==========================================================================
// PAINEL DE ANÁLISE DO EXPERIMENTO (/painel)
// ==========================================================================
(function () {
  'use strict';

  const SHEETDB_URL = 'https://sheetdb.io/api/v1/0hz7t51f4ukq9';
  // Hash SHA-256 da senha de acesso ao painel. Para trocar, gere o SHA-256 da nova senha.
  const PAINEL_SENHA_HASH = '74158d939669eaaca363d37a6cc1e89343b38a90f239937b519882d739d1603d';
  const AUTH_STORAGE_KEY = 'painel_autenticado_v1';
  const S = window.PainelStats;

  let todosRegistros = [];

  const VARIAVEIS_DESCRITIVAS = [
    { campo: 'acertos_numeracia', nome: 'Numeracia (BNT)', escala: '0 a 4' },
    { campo: 'acertos_vlat', nome: 'Mini-VLAT (Corrigido)', escala: '-6 a 12' },
    { campo: 'comp_icones', nome: 'Compreensão — Com Ícones', escala: '0 a 4' },
    { campo: 'comp_sem_icones', nome: 'Compreensão — Sem Ícones', escala: '0 a 4' },
    { campo: 'mem_icones', nome: 'Memória — Com Ícones', escala: '0 a 4' },
    { campo: 'mem_sem_icones', nome: 'Memória — Sem Ícones', escala: '0 a 4' },
    { campo: 'engajamento_icones', nome: 'Engajamento — Com Ícones', escala: '1 a 5' },
    { campo: 'engajamento_sem_icones', nome: 'Engajamento — Sem Ícones', escala: '1 a 5' }
  ];

  const VARIAVEIS_PAREADAS = [
    { nome: 'Compreensão', a: 'comp_icones', b: 'comp_sem_icones', maxEscala: 4 },
    { nome: 'Memória / Recordação', a: 'mem_icones', b: 'mem_sem_icones', maxEscala: 4 },
    { nome: 'Engajamento (Likert)', a: 'engajamento_icones', b: 'engajamento_sem_icones', maxEscala: 5 }
  ];

  // -------------------------
  // Formatação
  // -------------------------
  function fmt(num, casas = 2) {
    if (num === null || num === undefined || !Number.isFinite(num)) {
      return num === Infinity ? '∞' : (num === -Infinity ? '-∞' : '—');
    }
    return num.toFixed(casas).replace('.', ',');
  }

  function fmtP(p) {
    if (p === null || p === undefined || !Number.isFinite(p)) return '—';
    if (p < 0.001) return '< 0,001';
    return p.toFixed(4).replace('.', ',');
  }

  function badgeConclusao(teste) {
    if (!teste.valido) {
      return `<span class="badge badge-warn">Dados insuficientes</span>`;
    }
    if (teste.significativo) {
      return `<span class="badge badge-sig">Significativo (p &lt; 0,05)</span>`;
    }
    return `<span class="badge badge-nonsig">Não significativo</span>`;
  }

  function setStatus(texto, tipo = '') {
    const el = document.getElementById('status-banner');
    if (!el) return;
    el.textContent = texto;
    el.className = 'status-banner' + (tipo ? ` ${tipo}` : '');
  }

  // -------------------------
  // Dados e filtros
  // -------------------------
  function obterRegistrosFiltrados() {
    const filtro = document.getElementById('filtro-instituicao').value;
    if (filtro === 'TODAS') return todosRegistros;
    return todosRegistros.filter(r => r.instituicao === filtro);
  }

  function extrairCampo(registros, campo) {
    return registros.map(r => r[campo]);
  }

  // -------------------------
  // Renderização
  // -------------------------
  function renderKPIs(registros) {
    const nTotal = registros.length;
    const nEsdi = registros.filter(r => r.instituicao === 'ESDI').length;
    const nEnce = registros.filter(r => r.instituicao === 'ENCE').length;

    const descNum = S.calcularDescritiva(extrairCampo(registros, 'acertos_numeracia'));
    const descVlat = S.calcularDescritiva(extrairCampo(registros, 'acertos_vlat'));
    const descTempo = S.calcularDescritiva(extrairCampo(registros, 'tempo_segundos'));

    document.getElementById('kpi-n').textContent = String(nTotal);
    document.getElementById('kpi-dist').textContent = `ESDI: ${nEsdi} | ENCE: ${nEnce}`;
    document.getElementById('kpi-num').textContent = descNum.media !== null ? fmt(descNum.media) : '—';
    document.getElementById('kpi-vlat').textContent = descVlat.media !== null ? fmt(descVlat.media) : '—';
    document.getElementById('kpi-tempo').textContent = descTempo.media !== null ? `${Math.round(descTempo.media)} s` : '—';
  }

  function renderDescritiva(registros) {
    const tbody = document.getElementById('tbody-descritiva');
    if (registros.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8">Nenhum dado disponível para os filtros selecionados.</td></tr>';
      return;
    }

    tbody.innerHTML = VARIAVEIS_DESCRITIVAS.map(v => {
      const d = S.calcularDescritiva(extrairCampo(registros, v.campo));
      return `
        <tr>
          <th scope="row">${v.nome}</th>
          <td>${v.escala}</td>
          <td class="num-col">${d.n}</td>
          <td class="num-col">${fmt(d.media)}</td>
          <td class="num-col">${fmt(d.dp)}</td>
          <td class="num-col">${fmt(d.mediana)}</td>
          <td class="num-col">${fmt(d.min)}</td>
          <td class="num-col">${fmt(d.max)}</td>
        </tr>
      `;
    }).join('');
  }

  function renderTPareado(registros) {
    const tbody = document.getElementById('tbody-t-pareado');
    const chartsDiv = document.getElementById('graficos-comparativos');

    if (registros.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10">Nenhum dado disponível.</td></tr>';
      chartsDiv.innerHTML = '';
      return;
    }

    const rowsHtml = [];
    const cardsHtml = [];

    VARIAVEIS_PAREADAS.forEach(v => {
      const grupoA = extrairCampo(registros, v.a);
      const grupoB = extrairCampo(registros, v.b);
      const res = S.testeTPareado(grupoA, grupoB);

      rowsHtml.push(`
        <tr>
          <th scope="row">${v.nome}</th>
          <td class="num-col">${res.n}</td>
          <td class="num-col">${fmt(res.mediaA)}</td>
          <td class="num-col">${fmt(res.mediaB)}</td>
          <td class="num-col">${fmt(res.mediaDif)}</td>
          <td class="num-col">${fmt(res.t, 3)}</td>
          <td class="num-col">${res.gl !== null ? res.gl : '—'}</td>
          <td class="num-col">${fmtP(res.pValor)}</td>
          <td class="num-col">${fmt(res.cohenD)}</td>
          <td>${badgeConclusao(res)}</td>
        </tr>
      `);

      const pctA = res.mediaA !== null ? Math.max(0, Math.min(100, (res.mediaA / v.maxEscala) * 100)) : 0;
      const pctB = res.mediaB !== null ? Math.max(0, Math.min(100, (res.mediaB / v.maxEscala) * 100)) : 0;

      cardsHtml.push(`
        <div class="chart-card">
          <h3>${v.nome} (máx. ${v.maxEscala})</h3>
          <div class="bar-row">
            <div class="bar-meta">
              <span>Com Ícones</span>
              <span>${fmt(res.mediaA)} / ${v.maxEscala}</span>
            </div>
            <div class="bar-track" role="img" aria-label="Com ícones: média ${fmt(res.mediaA)} de ${v.maxEscala}">
              <div class="bar-fill-icones" style="width: ${pctA.toFixed(1)}%"></div>
            </div>
          </div>
          <div class="bar-row">
            <div class="bar-meta">
              <span>Sem Ícones</span>
              <span>${fmt(res.mediaB)} / ${v.maxEscala}</span>
            </div>
            <div class="bar-track" role="img" aria-label="Sem ícones: média ${fmt(res.mediaB)} de ${v.maxEscala}">
              <div class="bar-fill-sem" style="width: ${pctB.toFixed(1)}%"></div>
            </div>
          </div>
        </div>
      `);
    });

    tbody.innerHTML = rowsHtml.join('');
    chartsDiv.innerHTML = cardsHtml.join('');
  }

  function renderTestesUmaAmostra(registros) {
    const tbody = document.getElementById('tbody-t-uma-amostra');
    const testesRef = [
      { nome: 'Numeracia (BNT)', campo: 'acertos_numeracia', mu0: 2 },
      { nome: 'Mini-VLAT (Corrigido)', campo: 'acertos_vlat', mu0: 0 }
    ];

    tbody.innerHTML = testesRef.map(item => {
      const desc = S.calcularDescritiva(extrairCampo(registros, item.campo));
      const res = S.testeTUmaAmostra(extrairCampo(registros, item.campo), item.mu0);
      return `
        <tr>
          <th scope="row">${item.nome}</th>
          <td class="num-col">${fmt(item.mu0, 1)}</td>
          <td class="num-col">${res.n}</td>
          <td class="num-col">${fmt(res.media)}</td>
          <td class="num-col">${fmt(desc.dp)}</td>
          <td class="num-col">${fmt(res.t, 3)}</td>
          <td class="num-col">${res.gl !== null ? res.gl : '—'}</td>
          <td class="num-col">${fmtP(res.pValor)}</td>
          <td class="num-col">${fmt(res.cohenD)}</td>
          <td>${badgeConclusao(res)}</td>
        </tr>
      `;
    }).join('');
  }

  function renderTestesInstituicoes() {
    const tbody = document.getElementById('tbody-t-instituicoes');
    const esdi = todosRegistros.filter(r => r.instituicao === 'ESDI');
    const ence = todosRegistros.filter(r => r.instituicao === 'ENCE');

    tbody.innerHTML = VARIAVEIS_DESCRITIVAS.map(v => {
      const res = S.testeTIndependente(extrairCampo(esdi, v.campo), extrairCampo(ence, v.campo));
      return `
        <tr>
          <th scope="row">${v.nome}</th>
          <td class="num-col">${res.nA}</td>
          <td class="num-col">${fmt(res.mediaA)}</td>
          <td class="num-col">${res.nB}</td>
          <td class="num-col">${fmt(res.mediaB)}</td>
          <td class="num-col">${fmt(res.t, 3)}</td>
          <td class="num-col">${res.gl !== null ? fmt(res.gl, 1) : '—'}</td>
          <td class="num-col">${fmtP(res.pValor)}</td>
          <td class="num-col">${fmt(res.cohenD)}</td>
          <td>${badgeConclusao(res)}</td>
        </tr>
      `;
    }).join('');
  }

  function renderParticipantes(registros) {
    const tbody = document.getElementById('tbody-participantes');
    if (registros.length === 0) {
      tbody.innerHTML = '<tr><td colspan="11">Nenhum registro encontrado.</td></tr>';
      return;
    }

    tbody.innerHTML = registros.map(r => `
      <tr>
        <th scope="row">${r.id_participante}</th>
        <td>${r.instituicao}</td>
        <td class="num-col">${r.tempo_segundos !== null ? r.tempo_segundos : '—'}</td>
        <td class="num-col">${r.acertos_numeracia !== null ? r.acertos_numeracia : '—'}</td>
        <td class="num-col">${fmt(r.acertos_vlat)}</td>
        <td class="num-col">${r.comp_icones !== null ? r.comp_icones : '—'}</td>
        <td class="num-col">${r.comp_sem_icones !== null ? r.comp_sem_icones : '—'}</td>
        <td class="num-col">${r.mem_icones !== null ? r.mem_icones : '—'}</td>
        <td class="num-col">${r.mem_sem_icones !== null ? r.mem_sem_icones : '—'}</td>
        <td class="num-col">${fmt(r.engajamento_icones)}</td>
        <td class="num-col">${fmt(r.engajamento_sem_icones)}</td>
      </tr>
    `).join('');
  }

  function atualizarPainel() {
    const filtrados = obterRegistrosFiltrados();
    renderKPIs(filtrados);
    renderDescritiva(filtrados);
    renderTPareado(filtrados);
    renderTestesUmaAmostra(filtrados);
    renderTestesInstituicoes();
    renderParticipantes(filtrados);
  }

  // -------------------------
  // Fontes de dados
  // -------------------------
  async function carregarSheetDB() {
    setStatus('Carregando dados do SheetDB...');
    try {
      const resp = await fetch(SHEETDB_URL);
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const dados = await resp.json();
      if (!Array.isArray(dados)) {
        throw new Error('Formato inesperado retornado pelo SheetDB.');
      }
      todosRegistros = dados.map(S.normalizarRegistro);
      atualizarPainel();

      if (todosRegistros.length === 0) {
        setStatus('Conectado ao SheetDB, mas ainda não há respostas coletadas. Você pode importar arquivos JSON ou carregar dados de exemplo.', 'is-warn');
      } else {
        setStatus(`${todosRegistros.length} registro(s) carregado(s) do SheetDB com sucesso.`, 'is-ok');
      }
    } catch (err) {
      atualizarPainel();
      setStatus(`Não foi possível carregar o SheetDB (${err.message}). Você pode importar arquivos JSON locais ou usar os dados de exemplo.`, 'is-error');
    }
  }

  async function importarJSONs(files) {
    if (!files || files.length === 0) return;
    const novos = [];
    for (const file of files) {
      try {
        const texto = await file.text();
        const json = JSON.parse(texto);
        if (Array.isArray(json)) {
          json.forEach(item => novos.push(S.normalizarRegistro(item)));
        } else {
          novos.push(S.normalizarRegistro(json));
        }
      } catch (err) {
        setStatus(`Erro ao ler "${file.name}": ${err.message}`, 'is-error');
        return;
      }
    }
    todosRegistros = todosRegistros.concat(novos);
    atualizarPainel();
    setStatus(`${novos.length} registro(s) importado(s) via JSON. Total atual: ${todosRegistros.length}.`, 'is-ok');
  }

  function carregarDadosExemplo() {
    const exemplo = [
      { id_participante: 'ESDI101', instituicao: 'ESDI', tempo_segundos: 310, acertos_numeracia: 2, acertos_vlat: 7.33, comp_icones: 4, comp_sem_icones: 3, mem_icones: 4, mem_sem_icones: 2, engajamento_icones: 4.5, engajamento_sem_icones: 3.17 },
      { id_participante: 'ESDI102', instituicao: 'ESDI', tempo_segundos: 295, acertos_numeracia: 3, acertos_vlat: 8.67, comp_icones: 3, comp_sem_icones: 2, mem_icones: 3, mem_sem_icones: 2, engajamento_icones: 4.25, engajamento_sem_icones: 3.0 },
      { id_participante: 'ESDI103', instituicao: 'ESDI', tempo_segundos: 340, acertos_numeracia: 1, acertos_vlat: 6.0, comp_icones: 4, comp_sem_icones: 2, mem_icones: 3, mem_sem_icones: 1, engajamento_icones: 4.67, engajamento_sem_icones: 2.92 },
      { id_participante: 'ESDI104', instituicao: 'ESDI', tempo_segundos: 280, acertos_numeracia: 2, acertos_vlat: 9.0, comp_icones: 3, comp_sem_icones: 3, mem_icones: 4, mem_sem_icones: 2, engajamento_icones: 4.08, engajamento_sem_icones: 3.42 },
      { id_participante: 'ENCE201', instituicao: 'ENCE', tempo_segundos: 260, acertos_numeracia: 4, acertos_vlat: 10.67, comp_icones: 4, comp_sem_icones: 3, mem_icones: 4, mem_sem_icones: 3, engajamento_icones: 4.17, engajamento_sem_icones: 3.5 },
      { id_participante: 'ENCE202', instituicao: 'ENCE', tempo_segundos: 245, acertos_numeracia: 4, acertos_vlat: 11.0, comp_icones: 4, comp_sem_icones: 4, mem_icones: 3, mem_sem_icones: 2, engajamento_icones: 3.92, engajamento_sem_icones: 3.25 },
      { id_participante: 'ENCE203', instituicao: 'ENCE', tempo_segundos: 275, acertos_numeracia: 3, acertos_vlat: 9.67, comp_icones: 4, comp_sem_icones: 3, mem_icones: 4, mem_sem_icones: 2, engajamento_icones: 4.33, engajamento_sem_icones: 3.17 },
      { id_participante: 'ENCE204', instituicao: 'ENCE', tempo_segundos: 255, acertos_numeracia: 4, acertos_vlat: 12.0, comp_icones: 3, comp_sem_icones: 2, mem_icones: 4, mem_sem_icones: 3, engajamento_icones: 4.42, engajamento_sem_icones: 3.08 }
    ];
    todosRegistros = exemplo.map(S.normalizarRegistro);
    atualizarPainel();
    setStatus('8 registros de exemplo carregados (4 ESDI e 4 ENCE). Os dados reais do SheetDB não foram alterados.', 'is-warn');
  }

  // -------------------------
  // Checagem automática no navegador
  // -------------------------
  function executarAuditoria() {
    const checks = [
      {
        nome: 'Mini-VLAT: 10 certas + 1 erro (2 opc.) + 1 erro (4 opc.) = 8,67',
        run: () => {
          const r = S.calcularMiniVlatCorrigido({
            vlat1: 'Verdadeiro', // erro (2 opc -> -1)
            vlat2: 'EUA',        // erro (4 opc -> -1/3)
            vlat3: '30 – 40 km',
            vlat4: 'Verdadeiro',
            vlat5: '25,3%',
            vlat6: 'Xangai',
            vlat7: '$7,5',
            vlat8: '$50,54',
            vlat9: '40,51 Mbps',
            vlat10: '$0,80',
            vlat11: '1 para 2',
            vlat12: 'Falso'
          });
          return r.corrigido === 8.67 && r.brutos === 10;
        }
      },
      {
        nome: 'Mini-VLAT: todas puladas = 0 (sem penalidade)',
        run: () => {
          const r = S.calcularMiniVlatCorrigido({});
          return r.corrigido === 0 && r.brutos === 0;
        }
      },
      {
        nome: 'Mini-VLAT: 12 erradas = -6,00',
        run: () => {
          const obj = {};
          for (let i = 1; i <= 12; i++) obj['vlat' + i] = 'X';
          const r = S.calcularMiniVlatCorrigido(obj);
          return r.corrigido === -6 && r.brutos === 0;
        }
      },
      {
        nome: 'Descritiva: média = 5, mediana = 4,5 e DP amostral ≈ 2,138',
        run: () => {
          const d = S.calcularDescritiva([2, 4, 4, 4, 5, 5, 7, 9]);
          return d.n === 8 && d.media === 5 && d.mediana === 4.5 && Math.abs(d.dp - 2.13809) < 1e-4;
        }
      },
      {
        nome: 'Distribuição t: valor crítico t = 2,2281 (gl = 10) → p ≈ 0,05',
        run: () => {
          const p = S.pValorTDistribution(2.22813885, 10);
          return Math.abs(p - 0.05) < 1e-5;
        }
      },
      {
        nome: 'Teste t pareado: t ≈ 6,532 (gl = 4, p ≈ 0,0028)',
        run: () => {
          const res = S.testeTPareado([4, 4, 3, 4, 3], [3, 2, 2, 2, 1]);
          return res.valido && res.gl === 4 && Math.abs(res.t - 6.53197) < 1e-3 && res.significativo;
        }
      },
      {
        nome: 'Teste t de Welch independente: t ≈ 2,530 (gl ≈ 5,88, p ≈ 0,0455)',
        run: () => {
          const res = S.testeTIndependente([10, 12, 14, 16, 18], [8, 9, 10, 11, 12]);
          return res.valido && Math.abs(res.t - 2.52982) < 1e-3 && Math.abs(res.gl - 5.88235) < 1e-3 && res.significativo;
        }
      }
    ];

    let okCount = 0;
    const lista = document.getElementById('auditoria-lista');
    lista.innerHTML = checks.map(c => {
      let passou = false;
      try {
        passou = Boolean(c.run());
      } catch (_) {
        passou = false;
      }
      if (passou) okCount++;
      return `
        <li class="audit-item">
          <span>${c.nome}</span>
          <span class="badge ${passou ? 'badge-sig' : 'badge-warn'}">${passou ? 'OK' : 'FALHOU'}</span>
        </li>
      `;
    }).join('');

    const resumo = document.getElementById('auditoria-resumo');
    resumo.textContent = `Checagem concluída: ${okCount} de ${checks.length} verificações aprovadas.`;
    resumo.className = 'status-banner ' + (okCount === checks.length ? 'is-ok' : 'is-error');
  }

  // -------------------------
  // Autenticação do painel
  // -------------------------
  function sha256Fallback(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const maxWord = Math.pow(2, 32);
    const words = [];
    const asciiBitLength = ascii.length * 8;
    let hash = [];
    const k = [];
    let primeCounter = 0;
    const isComposite = {};

    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (let i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    ascii += '\x80';
    while ((ascii.length % 64) - 56) ascii += '\x00';
    for (let i = 0; i < ascii.length; i++) {
      const j = ascii.charCodeAt(i);
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;

    for (let j = 0; j < words.length;) {
      const w = words.slice(j, (j += 16));
      const oldHash = hash;
      hash = hash.slice(0, 8);

      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15];
        const w2 = w[i - 2];
        const a = hash[0];
        const e = hash[4];
        const temp1 = hash[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
          ((e & hash[5]) ^ ((~e) & hash[6])) +
          k[i] +
          (w[i] = (i < 16) ? w[i] : (
            w[i - 16] +
            (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
            w[i - 7] +
            (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0);
        const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
          ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }

      for (let i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    let result = '';
    for (let i = 0; i < 8; i++) {
      for (let j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }

  async function sha256Hex(texto) {
    if (window.crypto && window.crypto.subtle && typeof TextEncoder !== 'undefined') {
      const bytes = new TextEncoder().encode(texto);
      const buffer = await window.crypto.subtle.digest('SHA-256', bytes);
      return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }
    return sha256Fallback(unescape(encodeURIComponent(texto)));
  }

  let dadosInicializados = false;

  function desbloquearPainel() {
    document.getElementById('auth-gate').hidden = true;
    document.getElementById('painel-conteudo').hidden = false;
    document.getElementById('btn-sair').hidden = false;

    if (!dadosInicializados) {
      dadosInicializados = true;
      executarAuditoria();
      carregarSheetDB();
    }
  }

  function bloquearPainel() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    document.getElementById('painel-conteudo').hidden = true;
    document.getElementById('btn-sair').hidden = true;
    document.getElementById('auth-gate').hidden = false;
    document.getElementById('input-senha').value = '';
    document.getElementById('auth-erro').hidden = true;
    document.getElementById('input-senha').focus();
  }

  // -------------------------
  // Eventos
  // -------------------------
  window.addEventListener('DOMContentLoaded', () => {
    const formAuth = document.getElementById('form-auth');
    const inputSenha = document.getElementById('input-senha');
    const btnToggleSenha = document.getElementById('btn-toggle-senha');
    const authErro = document.getElementById('auth-erro');

    btnToggleSenha.addEventListener('click', () => {
      const mostrando = inputSenha.type === 'text';
      inputSenha.type = mostrando ? 'password' : 'text';
      btnToggleSenha.textContent = mostrando ? 'Mostrar' : 'Ocultar';
      btnToggleSenha.setAttribute('aria-pressed', String(!mostrando));
    });

    formAuth.addEventListener('submit', async e => {
      e.preventDefault();
      const senha = inputSenha.value;
      if (!senha) {
        authErro.textContent = 'Informe a senha de acesso.';
        authErro.hidden = false;
        inputSenha.focus();
        return;
      }

      const hash = await sha256Hex(senha);
      if (hash === PAINEL_SENHA_HASH) {
        authErro.hidden = true;
        sessionStorage.setItem(AUTH_STORAGE_KEY, '1');
        desbloquearPainel();
      } else {
        authErro.textContent = 'Senha incorreta. Tente novamente.';
        authErro.hidden = false;
        inputSenha.select();
      }
    });

    document.getElementById('btn-sair').addEventListener('click', bloquearPainel);
    document.getElementById('filtro-instituicao').addEventListener('change', atualizarPainel);
    document.getElementById('btn-atualizar').addEventListener('click', carregarSheetDB);
    document.getElementById('btn-exemplo').addEventListener('click', carregarDadosExemplo);
    document.getElementById('btn-auditoria').addEventListener('click', executarAuditoria);
    document.getElementById('input-json').addEventListener('change', e => {
      importarJSONs(e.target.files);
      e.target.value = '';
    });

    if (sessionStorage.getItem(AUTH_STORAGE_KEY) === '1') {
      desbloquearPainel();
    }
  });
})();

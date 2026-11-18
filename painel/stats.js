// ==========================================================================
// MÓDULO DE ESTATÍSTICA DESCRITIVA E TESTE T (Browser + Node.js)
// ==========================================================================
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PainelStats = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Gabarito e número de alternativas do Mini-VLAT para normalização de registros antigos
  const GABARITO_VLAT = {
    vlat1: 'Falso',
    vlat2: 'Grã-Bretanha',
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
  };

  const OPCOES_VLAT = {
    vlat1: 2, vlat2: 4, vlat3: 4, vlat4: 2,
    vlat5: 4, vlat6: 4, vlat7: 4, vlat8: 4,
    vlat9: 4, vlat10: 4, vlat11: 4, vlat12: 2
  };

  const TOPICOS_GRAFICOS = [
    { id: 1, tema: 'Uso de Bicicleta (%)', compCorreta: 'c', memCorreta: 'c' },
    { id: 2, tema: 'Uso de Automóveis (%)', compCorreta: 'c', memCorreta: 'c' },
    { id: 3, tema: 'Arborização (%)', compCorreta: 'a', memCorreta: 'b' },
    { id: 4, tema: 'Conexão à rede de água (%)', compCorreta: 'c', memCorreta: 'c' },
    { id: 5, tema: 'População por região', compCorreta: 'b', memCorreta: 'a' },
    { id: 6, tema: 'População rural por região (%)', compCorreta: 'a', memCorreta: 'b' },
    { id: 7, tema: 'População urbana por região (%)', compCorreta: 'a', memCorreta: 'c' },
    { id: 8, tema: 'População de 70 anos ou mais (%)', compCorreta: 'b', memCorreta: 'c' }
  ];

  // -------------------------
  // Funções matemáticas base
  // -------------------------
  function logGamma(z) {
    const c = [
      76.18009172947146,
      -86.50532032941677,
      24.01409824083091,
      -1.231739572450155,
      0.001208650973866179,
      -0.000005395239384953
    ];
    let x = z;
    let y = z;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j < 6; j++) {
      y += 1;
      ser += c[j] / y;
    }
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }

  function betacf(a, b, x) {
    const MAXIT = 200;
    const EPS = 3.0e-12;
    const FPMIN = 1.0e-30;

    const qab = a + b;
    const qap = a + 1.0;
    const qam = a - 1.0;
    let c = 1.0;
    let d = 1.0 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1.0 / d;
    let h = d;

    for (let m = 1; m <= MAXIT; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1.0 + aa * d;
      if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1.0 + aa / c;
      if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1.0 / d;
      h *= d * c;

      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1.0 + aa * d;
      if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1.0 + aa / c;
      if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1.0 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1.0) < EPS) break;
    }
    return h;
  }

  function betainc(a, b, x) {
    if (x <= 0.0) return 0.0;
    if (x >= 1.0) return 1.0;
    const bt = Math.exp(
      logGamma(a + b) - logGamma(a) - logGamma(b) +
      a * Math.log(x) + b * Math.log(1.0 - x)
    );
    if (x < (a + 1.0) / (a + b + 2.0)) {
      return bt * betacf(a, b, x) / a;
    }
    return 1.0 - bt * betacf(b, a, 1.0 - x) / b;
  }

  /**
   * Calcula o p-valor bilateral exato da distribuição t de Student.
   */
  function pValorTDistribution(tAbs, gl) {
    if (!Number.isFinite(tAbs) || !Number.isFinite(gl) || gl <= 0) return null;
    if (tAbs === 0) return 1.0;
    const x = gl / (gl + tAbs * tAbs);
    return betainc(gl / 2.0, 0.5, x);
  }

  // -------------------------
  // Estatística descritiva
  // -------------------------
  function filtrarNumeros(arr) {
    return (arr || []).filter(v => typeof v === 'number' && Number.isFinite(v));
  }

  function calcularDescritiva(valores) {
    const nums = filtrarNumeros(valores);
    const n = nums.length;
    if (n === 0) {
      return { n: 0, media: null, dp: null, mediana: null, min: null, max: null };
    }

    const soma = nums.reduce((acc, v) => acc + v, 0);
    const media = soma / n;

    let dp = 0;
    if (n > 1) {
      const somaQuad = nums.reduce((acc, v) => acc + Math.pow(v - media, 2), 0);
      dp = Math.sqrt(somaQuad / (n - 1));
    }

    const ordenados = [...nums].sort((a, b) => a - b);
    const meio = Math.floor(n / 2);
    const mediana = n % 2 !== 0
      ? ordenados[meio]
      : (ordenados[meio - 1] + ordenados[meio]) / 2;

    return {
      n,
      media,
      dp,
      mediana,
      min: ordenados[0],
      max: ordenados[n - 1]
    };
  }

  // -------------------------
  // Testes t
  // -------------------------

  /**
   * Teste t pareado (intra-sujeito): compara grupoA - grupoB.
   */
  function testeTPareado(grupoA, grupoB) {
    const pares = [];
    const len = Math.min((grupoA || []).length, (grupoB || []).length);
    for (let i = 0; i < len; i++) {
      const a = grupoA[i];
      const b = grupoB[i];
      if (typeof a === 'number' && Number.isFinite(a) && typeof b === 'number' && Number.isFinite(b)) {
        pares.push({ a, b, d: a - b });
      }
    }

    const n = pares.length;
    if (n < 2) {
      return {
        valido: false,
        motivo: 'Necessário ao menos 2 pares válidos.',
        n,
        mediaA: n === 1 ? pares[0].a : null,
        mediaB: n === 1 ? pares[0].b : null,
        mediaDif: null,
        dpDif: null,
        t: null,
        gl: null,
        pValor: null,
        cohenD: null,
        significativo: false
      };
    }

    const descA = calcularDescritiva(pares.map(p => p.a));
    const descB = calcularDescritiva(pares.map(p => p.b));
    const descD = calcularDescritiva(pares.map(p => p.d));

    const gl = n - 1;
    const ep = descD.dp / Math.sqrt(n);
    if (ep === 0) {
      const tInf = descD.media === 0 ? 0 : Infinity;
      const p = descD.media === 0 ? 1.0 : 0.0;
      return {
        valido: true,
        n,
        mediaA: descA.media,
        mediaB: descB.media,
        mediaDif: descD.media,
        dpDif: 0,
        t: tInf,
        gl,
        pValor: p,
        cohenD: descD.media === 0 ? 0 : Infinity,
        significativo: p < 0.05
      };
    }

    const t = descD.media / ep;
    const pValor = pValorTDistribution(Math.abs(t), gl);
    const cohenD = descD.media / descD.dp;

    return {
      valido: true,
      n,
      mediaA: descA.media,
      mediaB: descB.media,
      mediaDif: descD.media,
      dpDif: descD.dp,
      t,
      gl,
      pValor,
      cohenD,
      significativo: pValor !== null && pValor < 0.05
    };
  }

  /**
   * Teste t de Welch para amostras independentes (ex.: ESDI vs. ENCE).
   */
  function testeTIndependente(grupoA, grupoB) {
    const numsA = filtrarNumeros(grupoA);
    const numsB = filtrarNumeros(grupoB);
    const nA = numsA.length;
    const nB = numsB.length;

    const descA = calcularDescritiva(numsA);
    const descB = calcularDescritiva(numsB);

    if (nA < 2 || nB < 2) {
      return {
        valido: false,
        motivo: 'Necessário ao menos 2 participantes em cada grupo.',
        nA,
        nB,
        mediaA: descA.media,
        mediaB: descB.media,
        dpA: descA.dp,
        dpB: descB.dp,
        difMedias: (descA.media !== null && descB.media !== null) ? descA.media - descB.media : null,
        t: null,
        gl: null,
        pValor: null,
        cohenD: null,
        significativo: false
      };
    }

    const varA = descA.dp * descA.dp;
    const varB = descB.dp * descB.dp;
    const epA = varA / nA;
    const epB = varB / nB;
    const epTotal = Math.sqrt(epA + epB);
    const difMedias = descA.media - descB.media;

    if (epTotal === 0) {
      const p = difMedias === 0 ? 1.0 : 0.0;
      return {
        valido: true,
        nA,
        nB,
        mediaA: descA.media,
        mediaB: descB.media,
        dpA: 0,
        dpB: 0,
        difMedias,
        t: difMedias === 0 ? 0 : Infinity,
        gl: nA + nB - 2,
        pValor: p,
        cohenD: 0,
        significativo: p < 0.05
      };
    }

    const t = difMedias / epTotal;
    const glNum = Math.pow(epA + epB, 2);
    const glDen = (Math.pow(epA, 2) / (nA - 1)) + (Math.pow(epB, 2) / (nB - 1));
    const gl = glNum / glDen;
    const pValor = pValorTDistribution(Math.abs(t), gl);

    // d de Cohen com desvio padrão agrupado
    const dpAgrupado = Math.sqrt(((nA - 1) * varA + (nB - 1) * varB) / (nA + nB - 2));
    const cohenD = dpAgrupado > 0 ? difMedias / dpAgrupado : 0;

    return {
      valido: true,
      nA,
      nB,
      mediaA: descA.media,
      mediaB: descB.media,
      dpA: descA.dp,
      dpB: descB.dp,
      difMedias,
      t,
      gl,
      pValor,
      cohenD,
      significativo: pValor !== null && pValor < 0.05
    };
  }

  /**
   * Teste t para uma amostra contra valor de referência mu0.
   */
  function testeTUmaAmostra(valores, mu0) {
    const nums = filtrarNumeros(valores);
    const n = nums.length;
    const desc = calcularDescritiva(nums);

    if (n < 2) {
      return {
        valido: false,
        motivo: 'Necessário ao menos 2 participantes.',
        n,
        media: desc.media,
        dp: desc.dp,
        mu0,
        t: null,
        gl: null,
        pValor: null,
        cohenD: null,
        significativo: false
      };
    }

    const gl = n - 1;
    const ep = desc.dp / Math.sqrt(n);
    if (ep === 0) {
      const dif = desc.media - mu0;
      const p = dif === 0 ? 1.0 : 0.0;
      return {
        valido: true,
        n,
        media: desc.media,
        dp: 0,
        mu0,
        t: dif === 0 ? 0 : Infinity,
        gl,
        pValor: p,
        cohenD: 0,
        significativo: p < 0.05
      };
    }

    const t = (desc.media - mu0) / ep;
    const pValor = pValorTDistribution(Math.abs(t), gl);
    const cohenD = (desc.media - mu0) / desc.dp;

    return {
      valido: true,
      n,
      media: desc.media,
      dp: desc.dp,
      mu0,
      t,
      gl,
      pValor,
      cohenD,
      significativo: pValor !== null && pValor < 0.05
    };
  }

  // -------------------------
  // Normalização de registros (SheetDB ou JSON exportado)
  // -------------------------
  function calcularMiniVlatCorrigido(vlatObj) {
    if (!vlatObj || typeof vlatObj !== 'object') return null;
    let brutos = 0;
    let pontuacao = 0;
    for (let i = 1; i <= 12; i++) {
      const chave = 'vlat' + i;
      const resp = vlatObj[chave];
      const limpa = resp ? resp.toString().trim() : '';
      if (!limpa) continue;
      if (limpa === GABARITO_VLAT[chave]) {
        brutos++;
        pontuacao += 1;
      } else {
        pontuacao -= 1 / ((OPCOES_VLAT[chave] || 4) - 1);
      }
    }
    return {
      corrigido: Number(pontuacao.toFixed(2)),
      brutos
    };
  }

  function toNumOrNull(val) {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'number') return Number.isFinite(val) ? val : null;
    const texto = String(val).trim().replace(',', '.');
    if (!texto) return null;
    const n = Number(texto);
    return Number.isFinite(n) ? n : null;
  }

  function normalizarRegistro(row) {
    let parsedJson = null;
    if (row && typeof row.json_completo === 'string' && row.json_completo.trim()) {
      try {
        parsedJson = JSON.parse(row.json_completo);
      } catch (_) {
        parsedJson = null;
      }
    } else if (row && row.resumo_desempenho) {
      parsedJson = row;
    }

    const resumo = parsedJson && parsedJson.resumo_desempenho ? parsedJson.resumo_desempenho : {};
    const vlatBrutoObj = parsedJson && parsedJson.respostas && parsedJson.respostas.vlat
      ? parsedJson.respostas.vlat
      : null;

    const vlatRecalculado = calcularMiniVlatCorrigido(vlatBrutoObj);

    const acertosVlat = vlatRecalculado
      ? vlatRecalculado.corrigido
      : toNumOrNull(row.acertos_vlat !== undefined ? row.acertos_vlat : resumo.acertos_vlat);

    const acertosVlatBrutos = vlatRecalculado
      ? vlatRecalculado.brutos
      : toNumOrNull(resumo.acertos_vlat_brutos);

    // Extrai respostas individuais por tópico (1..8) a partir do JSON completo ou colunas t1..t8
    const porTopico = {};
    const graficosResp = parsedJson && parsedJson.respostas && parsedJson.respostas.graficos
      ? parsedJson.respostas.graficos
      : null;
    const alocList = parsedJson && Array.isArray(parsedJson.alocacao_graficos)
      ? parsedJson.alocacao_graficos
      : [];

    if (graficosResp && typeof graficosResp === 'object') {
      for (let i = 1; i <= 8; i++) {
        const g = graficosResp['g' + i];
        if (!g) continue;
        const alocItem = alocList.find(a => a.ordem === i) || {};
        const tema = g.tema || alocItem.tema || '';
        const topicoMeta = TOPICOS_GRAFICOS.find(t => t.id === alocItem.id_topico || t.tema === tema);
        if (!topicoMeta) continue;

        const condicao = g.condicao || alocItem.condicao || '';
        const e1 = toNumOrNull(g.e1);
        const e2 = toNumOrNull(g.e2);
        const e3 = toNumOrNull(g.e3);
        const eng = (e1 !== null && e2 !== null && e3 !== null) ? (e1 + e2 + e3) / 3 : null;

        porTopico[topicoMeta.id] = {
          id: topicoMeta.id,
          tema: topicoMeta.tema,
          condicao,
          comp: g.compreensao ? (g.compreensao === topicoMeta.compCorreta ? 1 : 0) : null,
          mem: g.memoria ? (g.memoria === topicoMeta.memCorreta ? 1 : 0) : null,
          eng,
          e1, e2, e3
        };
      }
    } else {
      TOPICOS_GRAFICOS.forEach(t => {
        const condicao = row[`t${t.id}_condicao`];
        if (!condicao) return;
        porTopico[t.id] = {
          id: t.id,
          tema: t.tema,
          condicao,
          comp: toNumOrNull(row[`t${t.id}_comp`]),
          mem: toNumOrNull(row[`t${t.id}_mem`]),
          eng: toNumOrNull(row[`t${t.id}_eng`]),
          e1: toNumOrNull(row[`t${t.id}_e1`]),
          e2: toNumOrNull(row[`t${t.id}_e2`]),
          e3: toNumOrNull(row[`t${t.id}_e3`])
        };
      });
    }

    return {
      id_participante: row.id_participante || (parsedJson && parsedJson.id_participante) || '—',
      instituicao: row.instituicao || (parsedJson && parsedJson.instituicao) || 'Não informada',
      data_hora: row.data_hora || (parsedJson && parsedJson.timestamp) || '',
      tempo_segundos: toNumOrNull(row.tempo_segundos !== undefined ? row.tempo_segundos : (parsedJson && parsedJson.tempo_total_segundos)),
      acertos_numeracia: toNumOrNull(row.acertos_numeracia !== undefined ? row.acertos_numeracia : resumo.acertos_numeracia),
      acertos_vlat: acertosVlat,
      acertos_vlat_brutos: acertosVlatBrutos,
      comp_icones: toNumOrNull(row.comp_icones !== undefined ? row.comp_icones : resumo.comp_com_icones_acertos),
      comp_sem_icones: toNumOrNull(row.comp_sem_icones !== undefined ? row.comp_sem_icones : resumo.comp_sem_icones_acertos),
      mem_icones: toNumOrNull(row.mem_icones !== undefined ? row.mem_icones : resumo.mem_com_icones_acertos),
      mem_sem_icones: toNumOrNull(row.mem_sem_icones !== undefined ? row.mem_sem_icones : resumo.mem_sem_icones_acertos),
      engajamento_icones: toNumOrNull(row.engajamento_icones !== undefined ? row.engajamento_icones : resumo.engajamento_medio_com_icones),
      engajamento_sem_icones: toNumOrNull(row.engajamento_sem_icones !== undefined ? row.engajamento_sem_icones : resumo.engajamento_medio_sem_icones),
      por_topico: porTopico,
      vlat_recalculado: Boolean(vlatRecalculado)
    };
  }

  /**
   * Analisa cada gráfico/tópico individualmente (Com Ícones vs. Sem Ícones) usando teste t de Welch.
   */
  function analisarPorTopico(registros) {
    return TOPICOS_GRAFICOS.map(t => {
      const compIcon = [];
      const compSem = [];
      const memIcon = [];
      const memSem = [];
      const engIcon = [];
      const engSem = [];

      (registros || []).forEach(r => {
        const item = r.por_topico && r.por_topico[t.id];
        if (!item) return;
        if (item.condicao === 'com_icones') {
          if (item.comp !== null) compIcon.push(item.comp);
          if (item.mem !== null) memIcon.push(item.mem);
          if (item.eng !== null) engIcon.push(item.eng);
        } else if (item.condicao === 'sem_icones') {
          if (item.comp !== null) compSem.push(item.comp);
          if (item.mem !== null) memSem.push(item.mem);
          if (item.eng !== null) engSem.push(item.eng);
        }
      });

      return {
        id: t.id,
        tema: t.tema,
        comp: testeTIndependente(compIcon, compSem),
        mem: testeTIndependente(memIcon, memSem),
        eng: testeTIndependente(engIcon, engSem)
      };
    });
  }

  return {
    TOPICOS_GRAFICOS,
    calcularDescritiva,
    testeTPareado,
    testeTIndependente,
    testeTUmaAmostra,
    pValorTDistribution,
    calcularMiniVlatCorrigido,
    normalizarRegistro,
    analisarPorTopico
  };
}));

// ==========================================================================
// ESTRUTURA DE CHECAGEM DOS CÁLCULOS DO EXPERIMENTO E DO PAINEL
// Execução: node experimental-instrument/tests/calculos.test.js
// ==========================================================================
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const stats = require('../painel/stats.js');

// -------------------------
// Carrega script.js em contexto isolado (sem DOM real)
// -------------------------
function carregarScriptExperimento() {
  const scriptPath = path.join(__dirname, '..', 'script.js');
  const code = fs.readFileSync(scriptPath, 'utf8');

  const sandbox = {
    console,
    Date,
    Math,
    Set,
    Number,
    String,
    Array,
    Object,
    JSON,
    URLSearchParams,
    Blob: function () {},
    URL: { createObjectURL: () => '', revokeObjectURL: () => {} },
    localStorage: { setItem: () => {}, getItem: () => null },
    fetch: () => Promise.resolve({ json: () => Promise.resolve({}) }),
    alert: () => {},
    window: {
      addEventListener: () => {},
      scrollTo: () => {},
      location: { search: '', hash: '' }
    },
    document: {
      getElementById: () => null,
      querySelectorAll: () => [],
      getElementsByName: () => [],
      createElement: () => ({ click: () => {}, appendChild: () => {} })
    }
  };

  vm.createContext(sandbox);
  // Expõe let/const de topo para inspeção e testes
  const wrapped = `
    ${code}
    globalThis.__exp = {
      GABARITO_NUMERACIA,
      GABARITO_VLAT,
      OPCOES_VLAT,
      DADOS_GRAFICOS,
      sortearAlocacaoIntraSujeito,
      calcularEstatisticas,
      setEstado(novoEstado) {
        if (novoEstado.alocacaoGraficos) alocacaoGraficos = novoEstado.alocacaoGraficos;
        if (novoEstado.respostas) respostas = novoEstado.respostas;
      }
    };
  `;
  vm.runInContext(wrapped, sandbox);
  return sandbox.__exp;
}

const testes = [];
function test(nome, fn) {
  testes.push({ nome, fn });
}

function approxEqual(atual, esperado, tolerancia = 1e-4, msg = '') {
  assert.ok(
    Math.abs(atual - esperado) <= tolerancia,
    `${msg ? msg + ': ' : ''}esperado ~${esperado}, recebido ${atual}`
  );
}

// -------------------------
// 1. Testes de Numeracia (BNT)
// -------------------------
test('Numeracia: 4 acertos com gabarito oficial (30, 25, 20, 50)', () => {
  const exp = carregarScriptExperimento();
  exp.setEstado({
    alocacaoGraficos: [],
    respostas: {
      numeracia: { num1: '30', num2: '25', num3: '20', num4: '50' },
      vlat: {},
      graficos: {}
    }
  });
  const res = exp.calcularEstatisticas();
  assert.strictEqual(res.acertos_numeracia, 4);
});

test('Numeracia: aceita decimais equivalentes em num2/num4 e rejeita erros ou vazios', () => {
  const exp = carregarScriptExperimento();
  exp.setEstado({
    alocacaoGraficos: [],
    respostas: {
      numeracia: { num1: '29', num2: '25.0', num3: '', num4: '50.00' },
      vlat: {},
      graficos: {}
    }
  });
  const res = exp.calcularEstatisticas();
  assert.strictEqual(res.acertos_numeracia, 2);
});

// -------------------------
// 2. Testes do Mini-VLAT (R - W / (C - 1))
// -------------------------
test('Mini-VLAT: 12 acertos resulta em pontuação 12 e brutos 12', () => {
  const exp = carregarScriptExperimento();
  exp.setEstado({
    alocacaoGraficos: [],
    respostas: {
      numeracia: {},
      vlat: { ...exp.GABARITO_VLAT },
      graficos: {}
    }
  });
  const res = exp.calcularEstatisticas();
  assert.strictEqual(res.acertos_vlat, 12);
  assert.strictEqual(res.acertos_vlat_brutos, 12);
});

test('Mini-VLAT: todas puladas resulta em 0 sem penalidade', () => {
  const exp = carregarScriptExperimento();
  exp.setEstado({
    alocacaoGraficos: [],
    respostas: { numeracia: {}, vlat: {}, graficos: {} }
  });
  const res = exp.calcularEstatisticas();
  assert.strictEqual(res.acertos_vlat, 0);
  assert.strictEqual(res.acertos_vlat_brutos, 0);
});

test('Mini-VLAT: erro em questão de 2 opções desconta 1 ponto; erro em 4 opções desconta 1/3', () => {
  const exp = carregarScriptExperimento();
  // 10 certas, vlat1 (2 opções) errada (-1), vlat2 (4 opções) errada (-0.333...) => 10 - 1 - 1/3 = 8.67
  exp.setEstado({
    alocacaoGraficos: [],
    respostas: {
      numeracia: {},
      vlat: { ...exp.GABARITO_VLAT, vlat1: 'Verdadeiro', vlat2: 'EUA' },
      graficos: {}
    }
  });
  const res = exp.calcularEstatisticas();
  assert.strictEqual(res.acertos_vlat_brutos, 10);
  assert.strictEqual(res.acertos_vlat, 8.67);
});

test('Mini-VLAT: 12 erros resulta em -6 (3*[-1] + 9*[-1/3])', () => {
  const exp = carregarScriptExperimento();
  const vlatErrado = {};
  for (let i = 1; i <= 12; i++) vlatErrado['vlat' + i] = 'ERRADA';
  exp.setEstado({
    alocacaoGraficos: [],
    respostas: { numeracia: {}, vlat: vlatErrado, graficos: {} }
  });
  const res = exp.calcularEstatisticas();
  assert.strictEqual(res.acertos_vlat, -6);
  assert.strictEqual(res.acertos_vlat_brutos, 0);
});

// -------------------------
// 3. Testes dos Gráficos e Alocação Intra-Sujeito
// -------------------------
test('Alocação intra-sujeito: exatamente 4 com_icones e 4 sem_icones nos 8 tópicos', () => {
  const exp = carregarScriptExperimento();
  for (let r = 0; r < 10; r++) {
    const aloc = exp.sortearAlocacaoIntraSujeito();
    assert.strictEqual(aloc.length, 8);
    const comIcones = aloc.filter(a => a.condicao === 'com_icones').length;
    const semIcones = aloc.filter(a => a.condicao === 'sem_icones').length;
    assert.strictEqual(comIcones, 4);
    assert.strictEqual(semIcones, 4);
  }
});

test('Gráficos: calcula acertos de compreensão, memória e média de engajamento por condição', () => {
  const exp = carregarScriptExperimento();
  // Índices 0..3 com ícones, 4..7 sem ícones
  const alocacaoFixa = exp.DADOS_GRAFICOS.map((dado, idx) => ({
    index: idx + 1,
    id: dado.id,
    tema: dado.tema,
    condicao: idx < 4 ? 'com_icones' : 'sem_icones',
    imgSrc: '',
    dado
  }));

  const graficos = {};
  alocacaoFixa.forEach((item, idx) => {
    const num = idx + 1;
    if (item.condicao === 'com_icones') {
      // 3 acertos de compreensão, 2 acertos de memória, Likert médio: (5+4+5)/3 = 4.6667 em todos
      graficos['g' + num] = {
        compreensao: idx < 3 ? item.dado.compreensao.correta : 'errada',
        memoria: idx < 2 ? item.dado.memoria.correta : 'errada',
        e1: '5', e2: '4', e3: '5'
      };
    } else {
      // 1 acerto de compreensão, 4 acertos de memória, Likert médio: (2+3+2)/3 = 2.3333 em todos
      graficos['g' + num] = {
        compreensao: idx === 4 ? item.dado.compreensao.correta : 'errada',
        memoria: item.dado.memoria.correta,
        e1: '2', e2: '3', e3: '2'
      };
    }
  });

  exp.setEstado({
    alocacaoGraficos: alocacaoFixa,
    respostas: { numeracia: {}, vlat: {}, graficos }
  });
  const res = exp.calcularEstatisticas();

  assert.strictEqual(res.comp_com_icones_acertos, 3);
  assert.strictEqual(res.comp_sem_icones_acertos, 1);
  assert.strictEqual(res.mem_com_icones_acertos, 2);
  assert.strictEqual(res.mem_sem_icones_acertos, 4);
  assert.strictEqual(res.engajamento_medio_com_icones, 4.67);
  assert.strictEqual(res.engajamento_medio_sem_icones, 2.33);
});

// -------------------------
// 4. Testes de Estatística Descritiva e Testes t (painel/stats.js)
// -------------------------
test('Descritiva: média, desvio padrão amostral, mediana, min e max', () => {
  const d = stats.calcularDescritiva([2, 4, 4, 4, 5, 5, 7, 9]);
  assert.strictEqual(d.n, 8);
  assert.strictEqual(d.media, 5);
  approxEqual(d.dp, 2.13809, 1e-4);
  assert.strictEqual(d.mediana, 4.5);
  assert.strictEqual(d.min, 2);
  assert.strictEqual(d.max, 9);
});

test('Distribuição t: p-valor bilateral confere com valores críticos clássicos', () => {
  // gl = 10, t = 2.22813885 => p = 0.05
  approxEqual(stats.pValorTDistribution(2.22813885, 10), 0.05, 1e-5, 'gl=10, p=0.05');
  // gl = 1, t = 12.7062047 => p = 0.05
  approxEqual(stats.pValorTDistribution(12.7062047, 1), 0.05, 1e-5, 'gl=1, p=0.05');
  // gl = 20, t = 2.84534 => p = 0.01
  approxEqual(stats.pValorTDistribution(2.84534, 20), 0.01, 1e-5, 'gl=20, p=0.01');
  // t = 0 => p = 1
  assert.strictEqual(stats.pValorTDistribution(0, 15), 1.0);
});

test('Teste t pareado: calcula t, gl, p-valor e Cohen d corretamente', () => {
  // Diferenças: [1, 2, 1, 2, 2] -> média = 1.6, dp = 0.5477225, t = 1.6 / (0.5477225 / sqrt(5)) = 6.53197
  const a = [4, 4, 3, 4, 3];
  const b = [3, 2, 2, 2, 1];
  const res = stats.testeTPareado(a, b);
  assert.strictEqual(res.valido, true);
  assert.strictEqual(res.n, 5);
  assert.strictEqual(res.gl, 4);
  approxEqual(res.mediaDif, 1.6, 1e-6);
  approxEqual(res.t, 6.5319726, 1e-4);
  approxEqual(res.pValor, 0.002837, 1e-4);
  assert.strictEqual(res.significativo, true);
});

test('Teste t independente de Welch: calcula t, gl e p-valor corretamente', () => {
  const g1 = [10, 12, 14, 16, 18]; // media 14, var 10
  const g2 = [8, 9, 10, 11, 12];   // media 10, var 2.5
  // ep = sqrt(10/5 + 2.5/5) = sqrt(2.5) = 1.5811388; t = 4 / 1.5811388 = 2.529822
  // gl = 2.5^2 / (4/4 + 0.25/4) = 6.25 / 1.0625 = 5.88235
  const res = stats.testeTIndependente(g1, g2);
  assert.strictEqual(res.valido, true);
  assert.strictEqual(res.nA, 5);
  assert.strictEqual(res.nB, 5);
  approxEqual(res.difMedias, 4, 1e-6);
  approxEqual(res.t, 2.529822, 1e-4);
  approxEqual(res.gl, 5.88235, 1e-4);
  approxEqual(res.pValor, 0.04547, 1e-4);
  assert.strictEqual(res.significativo, true);
});

test('Teste t de uma amostra: calcula t, gl e p-valor contra mu0', () => {
  const res = stats.testeTUmaAmostra([3, 4, 3, 4, 3], 2);
  assert.strictEqual(res.valido, true);
  assert.strictEqual(res.gl, 4);
  approxEqual(res.media, 3.4, 1e-6);
  // dp = 0.5477225, ep = 0.244949, t = 1.4 / 0.244949 = 5.715476
  approxEqual(res.t, 5.715476, 1e-4);
  approxEqual(res.pValor, 0.004636, 1e-4);
  assert.strictEqual(res.significativo, true);
});

test('Normalização de registro: recalcula Mini-VLAT antigo a partir de json_completo', () => {
  const exp = carregarScriptExperimento();
  const rowAntiga = {
    id_participante: 'ESDI123',
    instituicao: 'ESDI',
    tempo_segundos: '240',
    acertos_numeracia: '3',
    acertos_vlat: '10', // valor antigo sem penalidade
    comp_icones: '4',
    comp_sem_icones: '2',
    mem_icones: '3',
    mem_sem_icones: '2',
    engajamento_icones: '4.5',
    engajamento_sem_icones: '3.25',
    json_completo: JSON.stringify({
      respostas: {
        vlat: { ...exp.GABARITO_VLAT, vlat1: 'Verdadeiro', vlat2: 'EUA' }
      }
    })
  };

  const norm = stats.normalizarRegistro(rowAntiga);
  assert.strictEqual(norm.acertos_vlat_brutos, 10);
  assert.strictEqual(norm.acertos_vlat, 8.67);
  assert.strictEqual(norm.vlat_recalculado, true);
});

test('Normalização de registro: aceita decimais com vírgula vindos do Google Sheets (PT-BR)', () => {
  const rowPtBr = {
    id_participante: 'ESDI801',
    instituicao: 'ESDI',
    tempo_segundos: '310',
    acertos_numeracia: '2',
    acertos_vlat: '7,67',
    comp_icones: '4',
    comp_sem_icones: '3',
    mem_icones: '3',
    mem_sem_icones: '2',
    engajamento_icones: '4,67',
    engajamento_sem_icones: '2,75'
  };

  const norm = stats.normalizarRegistro(rowPtBr);
  assert.strictEqual(norm.acertos_vlat, 7.67);
  assert.strictEqual(norm.engajamento_icones, 4.67);
  assert.strictEqual(norm.engajamento_sem_icones, 2.75);
});

test('Análise por tópico individual: extrai respostas de json_completo e calcula teste t por gráfico', () => {
  const registros = [];
  for (let i = 0; i < 6; i++) {
    const comIcones = i < 3;
    registros.push(stats.normalizarRegistro({
      id_participante: `ESDI90${i}`,
      instituicao: 'ESDI',
      json_completo: JSON.stringify({
        alocacao_graficos: [{ ordem: 1, id_topico: 1, tema: 'Uso de Bicicleta (%)', condicao: comIcones ? 'com_icones' : 'sem_icones' }],
        respostas: {
          vlat: {},
          graficos: {
            g1: {
              tema: 'Uso de Bicicleta (%)',
              condicao: comIcones ? 'com_icones' : 'sem_icones',
              compreensao: comIcones ? 'c' : 'a',
              memoria: comIcones ? 'c' : 'b',
              e1: comIcones ? '5' : '2',
              e2: comIcones ? '5' : '2',
              e3: comIcones ? '4' : '2'
            }
          }
        }
      })
    }));
  }

  const analise = stats.analisarPorTopico(registros);
  const t1 = analise.find(t => t.id === 1);
  assert.strictEqual(t1.comp.nA, 3);
  assert.strictEqual(t1.comp.nB, 3);
  assert.strictEqual(t1.comp.mediaA, 1);
  assert.strictEqual(t1.comp.mediaB, 0);
  approxEqual(t1.eng.mediaA, 4.6667, 1e-3);
  assert.strictEqual(t1.eng.mediaB, 2);
});

// -------------------------
// Executor
// -------------------------
let passaram = 0;
let falharam = 0;

for (const t of testes) {
  try {
    t.fn();
    passaram++;
    console.log(`✔ ${t.nome}`);
  } catch (err) {
    falharam++;
    console.error(`✖ ${t.nome}`);
    console.error(`  ${err.message}`);
  }
}

console.log(`\nResultado: ${passaram}/${testes.length} checagens passaram.`);
if (falharam > 0) {
  process.exit(1);
}

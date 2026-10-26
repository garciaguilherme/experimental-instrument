// ==========================================================================
// INSTRUMENTO EXPERIMENTAL: Ícones em Visualização de Dados e Letramento
// Pesquisador: Guilherme da Costa Garcia (ESDI/UERJ)
// ==========================================================================

// ================================
// CONSTANTES E DADOS DOS GRÁFICOS
// ================================
const NUM_GRAFICOS = 8;
const SHEETDB_URL = 'https://sheetdb.io/api/v1/0hz7t51f4ukq9';

// Gabaritos para cálculo de acurácia
const GABARITO_NUMERACIA = {
  num1: 30, // 3/5 de 50 = 30
  num2: 25, // 100 homens no coral / 400 homens total = 25%
  num3: 20, // (2/7) * 70 = 20
  num4: 50  // 0.04 / (0.04 + 0.04) = 50%
};

const GABARITO_VLAT = {
  vlat1: "Falso",
  vlat2: "Grã-Bretanha",
  vlat3: "30 – 40 km",
  vlat4: "Verdadeiro",
  vlat5: "25,3%",
  vlat6: "Xangai",
  vlat7: "$7,5",
  vlat8: "$50,54",
  vlat9: "40,51 Mbps",
  vlat10: "$0,80",
  vlat11: "1 para 2",
  vlat12: "Falso"
};

// 8 tópicos de dados do Censo 2022 com versões Controle (sem ícones) e Experimental (com ícones)
const DADOS_GRAFICOS = [
  {
    id: 1,
    tema: "Uso de Bicicleta (%)",
    imgControle: "assets/experimento/1.png",
    imgExperimental: "assets/experimento/2.png",
    compreensao: {
      pergunta: "Quais regiões tem uso de bicicleta menor que o Nordeste?",
      opcoes: [
        { valor: "a", texto: "Sudeste" },
        { valor: "b", texto: "Sudeste, Sul e Centro-Oeste" },
        { valor: "c", texto: "Sul e Sudeste" }
      ],
      correta: "c"
    },
    memoria: {
      pergunta: "Que região apresentava o maior uso de bicicletas?",
      opcoes: [
        { valor: "a", texto: "Centro-Oeste" },
        { valor: "b", texto: "Nordeste" },
        { valor: "c", texto: "Norte" }
      ],
      correta: "c"
    }
  },
  {
    id: 2,
    tema: "Uso de Automóveis (%)",
    imgControle: "assets/experimento/3.png",
    imgExperimental: "assets/experimento/4.png",
    compreensao: {
      pergunta: "Quais regiões tem uso de automóveis maior que o Sudeste?",
      opcoes: [
        { valor: "a", texto: "Norte" },
        { valor: "b", texto: "Sul" },
        { valor: "c", texto: "Sul e Centro-Oeste" }
      ],
      correta: "c"
    },
    memoria: {
      pergunta: "Que regiões apresentavam o menor uso de automóveis?",
      opcoes: [
        { valor: "a", texto: "Norte e Sudeste" },
        { valor: "b", texto: "Nordeste" },
        { valor: "c", texto: "Norte e Nordeste" }
      ],
      correta: "c"
    }
  },
  {
    id: 3,
    tema: "Arborização (%)",
    imgControle: "assets/experimento/5.png",
    imgExperimental: "assets/experimento/6.png",
    compreensao: {
      pergunta: "Quais regiões tem aproximadamente a mesma arborização que a região Norte?",
      opcoes: [
        { valor: "a", texto: "Nordeste" },
        { valor: "b", texto: "Nordeste e Sudeste" },
        { valor: "c", texto: "Sudeste e Sul" }
      ],
      correta: "a"
    },
    memoria: {
      pergunta: "Que regiões apresentavam a mesma arborização que a região Sul?",
      opcoes: [
        { valor: "a", texto: "Norte" },
        { valor: "b", texto: "Sudeste" },
        { valor: "c", texto: "Centro-Oeste" }
      ],
      correta: "b"
    }
  },
  {
    id: 4,
    tema: "Conexão à rede de água (%)",
    imgControle: "assets/experimento/7.png",
    imgExperimental: "assets/experimento/8.png",
    compreensao: {
      pergunta: "Que regiões tem conexão à rede de água próxima de 80%?",
      opcoes: [
        { valor: "a", texto: "Sudeste" },
        { valor: "b", texto: "Sul e Centro-Oeste" },
        { valor: "c", texto: "Sudeste, Sul e Centro-Oeste" }
      ],
      correta: "c"
    },
    memoria: {
      pergunta: "Que região tem menos conexão com a rede de água?",
      opcoes: [
        { valor: "a", texto: "Sudeste" },
        { valor: "b", texto: "Nordeste" },
        { valor: "c", texto: "Norte" }
      ],
      correta: "c"
    }
  },
  {
    id: 5,
    tema: "População por região",
    imgControle: "assets/experimento/9.png",
    imgExperimental: "assets/experimento/10.png",
    compreensao: {
      pergunta: "Quantas regiões tem a população maior que 20 milhões?",
      opcoes: [
        { valor: "a", texto: "Sudeste" },
        { valor: "b", texto: "Nordeste, sudeste e sul" },
        { valor: "c", texto: "Norte, Nordeste, Sudeste e Sul" }
      ],
      correta: "b"
    },
    memoria: {
      pergunta: "Que regiões tem menos população?",
      opcoes: [
        { valor: "a", texto: "Norte e Centro-oeste" },
        { valor: "b", texto: "Norte" },
        { valor: "c", texto: "Centro-oeste" }
      ],
      correta: "a"
    }
  },
  {
    id: 6,
    tema: "População rural por região (%)",
    imgControle: "assets/experimento/11.png",
    imgExperimental: "assets/experimento/12.png",
    compreensao: {
      pergunta: "Qual a diferença aproximada entre a região com maior população rural e a de menor população rural?",
      opcoes: [
        { valor: "a", texto: "aprox. 4%" },
        { valor: "b", texto: "aprox. 20%" },
        { valor: "c", texto: "aprox. 2%" }
      ],
      correta: "a"
    },
    memoria: {
      pergunta: "Qual o percentual aproximado de população rural da região com mais população rural?",
      opcoes: [
        { valor: "a", texto: "24%" },
        { valor: "b", texto: "20%" },
        { valor: "c", texto: "18%" }
      ],
      correta: "b"
    }
  },
  {
    id: 7,
    tema: "População urbana por região (%)",
    imgControle: "assets/experimento/13.png",
    imgExperimental: "assets/experimento/14.png",
    compreensao: {
      pergunta: "Quais regiões tem população urbana maior que 80%?",
      opcoes: [
        { valor: "a", texto: "Sudeste" },
        { valor: "b", texto: "Centro-Oeste e Sudeste" },
        { valor: "c", texto: "Sul e Centro-oeste" }
      ],
      correta: "a"
    },
    memoria: {
      pergunta: "Qual o percentual aproximado da população urbana das regiões de menor população urbana?",
      opcoes: [
        { valor: "a", texto: "90%" },
        { valor: "b", texto: "60%" },
        { valor: "c", texto: "70%" }
      ],
      correta: "c"
    }
  },
  {
    id: 8,
    tema: "População de 70 anos ou mais (%)",
    imgControle: "assets/experimento/15.png",
    imgExperimental: "assets/experimento/16.png",
    compreensao: {
      pergunta: "Que regiões tem população de 70 anos ou mais menor que 6%?",
      opcoes: [
        { valor: "a", texto: "Norte" },
        { valor: "b", texto: "Norte e Centro-oeste" },
        { valor: "c", texto: "Sul e Sudeste" }
      ],
      correta: "b"
    },
    memoria: {
      pergunta: "Que regiões apresentavam a maior população de 70 anos ou mais?",
      opcoes: [
        { valor: "a", texto: "Norte e Sudeste" },
        { valor: "b", texto: "Nordeste e Centro-Oeste" },
        { valor: "c", texto: "Sul e Sudeste" }
      ],
      correta: "c"
    }
  }
];

// ================================
// ESTADO GLOBAL DO EXPERIMENTO
// ================================
let participanteId = "";
let instituicao = "ESDI";
let alocacaoGraficos = []; // [{ id, tema, condicao, imgSrc, dado }]
let respostas = {
  id_participante: "",
  instituicao: "",
  numeracia: {},
  vlat: {},
  graficos: {},
  emailFinal: ""
};
let tempoInicio = Date.now();

// ================================
// FUNÇÃO DE ALOCAÇÃO ALEATÓRIA INTRA-SUJEITO
// (Exatamente 4 com ícones e 4 sem ícones)
// ================================
function sortearAlocacaoIntraSujeito() {
  // Sorteia 4 índices para serem experimentais (com ícones)
  const indices = [0, 1, 2, 3, 4, 5, 6, 7];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const experimentaisSet = new Set(indices.slice(0, 4));

  return DADOS_GRAFICOS.map((dado, idx) => {
    const isExperimental = experimentaisSet.has(idx);
    const condicao = isExperimental ? "com_icones" : "sem_icones";
    const imgSrc = isExperimental ? dado.imgExperimental : dado.imgControle;

    return {
      index: idx + 1,
      id: dado.id,
      tema: dado.tema,
      condicao: condicao,
      imgSrc: imgSrc,
      dado: dado
    };
  });
}

// ================================
// GERAÇÃO DINÂMICA DAS TELAS DE GRÁFICOS
// (Tela de Compreensão com imagem + Tela de Memória e Engajamento sem imagem)
// ================================
function gerarTelasGraficos() {
  const container = document.getElementById('graficos-container');
  if (!container) return;

  if (alocacaoGraficos.length === 0) {
    alocacaoGraficos = sortearAlocacaoIntraSujeito();
  }

  let html = "";

  alocacaoGraficos.forEach((item, idx) => {
    const num = idx + 1;
    const dado = item.dado;

    // 1. TELA DE COMPREENSÃO (COM O GRÁFICO VISÍVEL)
    let opcoesCompHtml = "";
    dado.compreensao.opcoes.forEach(op => {
      opcoesCompHtml += `
        <label class="radio-label">
          <input type="radio" name="g${num}_comp" value="${op.valor}" required />
          <strong>${op.valor})</strong> ${op.texto}
        </label>
      `;
    });

    html += `
    <!-- GRÁFICO ${num}: ETAPA DE COMPREENSÃO -->
    <section id="tela-grafico${num}" class="tela" aria-label="Gráfico ${num} - Compreensão">
      <div class="conteudo">
        <div class="grafico-header">
          <h2>
            <span>Gráfico ${num} de ${NUM_GRAFICOS}: ${dado.tema}</span>
            <span class="badge-fase">Compreensão</span>
          </h2>
          <p class="instrucoes" style="margin-bottom: 10px;">Observe atentamente a visualização abaixo e responda à pergunta de compreensão:</p>
        </div>

        <div class="grafico-experimento-container">
          <img src="${item.imgSrc}" alt="${dado.tema}" class="grafico-experimento" />
        </div>

        <div class="pergunta-card">
          <p><strong>Compreensão:</strong> ${dado.compreensao.pergunta}</p>
          ${opcoesCompHtml}
        </div>

        <button type="button" id="btn-g${num}-comp-avancar" class="btn-primary btn-avancar-comp" data-id="${num}">
          Confirmar e Avançar para Recordação
        </button>
      </div>
    </section>
    `;

    // 2. TELA DE RECORDAÇÃO E ENGAJAMENTO (SEM O GRÁFICO VISÍVEL)
    let opcoesMemHtml = "";
    dado.memoria.opcoes.forEach(op => {
      opcoesMemHtml += `
        <label class="radio-label">
          <input type="radio" name="g${num}_mem" value="${op.valor}" required />
          <strong>${op.valor})</strong> ${op.texto}
        </label>
      `;
    });

    html += `
    <!-- GRÁFICO ${num}: ETAPA DE RECORDAÇÃO E ENGAJAMENTO -->
    <section id="tela-memoria${num}" class="tela" aria-label="Gráfico ${num} - Recordação e Avaliação">
      <div class="conteudo">
        <div class="grafico-header">
          <h2>
            <span>Gráfico ${num} de ${NUM_GRAFICOS}: ${dado.tema}</span>
            <span class="badge-fase badge-memoria">Recordação & Avaliação</span>
          </h2>
          <div class="instrucoes-memoria">
            <strong>Atenção:</strong> Responda às questões abaixo de memória, com base no gráfico que você acabou de visualizar na tela anterior.
          </div>
        </div>

        <div class="pergunta-card">
          <p><strong>Recordação (Memória):</strong> ${dado.memoria.pergunta}</p>
          ${opcoesMemHtml}
        </div>

        <hr style="margin: 30px 0;">
        <h3 style="margin-bottom: 5px;">Avaliação da Visualização</h3>
        <p style="color:#475569; margin-bottom: 20px;">Indique seu nível de concordância de 1 (Discordo totalmente) a 5 (Concordo totalmente):</p>

        <div class="pergunta-card">
          <p>1) O gráfico me deixou curioso(a) para saber mais sobre o tema.</p>
          <div class="likert-container">
            <span class="likert-extremo">Discordo</span>
            <label class="radio-label"><input type="radio" name="g${num}_e1" value="1" required /> 1</label>
            <label class="radio-label"><input type="radio" name="g${num}_e1" value="2" /> 2</label>
            <label class="radio-label"><input type="radio" name="g${num}_e1" value="3" /> 3</label>
            <label class="radio-label"><input type="radio" name="g${num}_e1" value="4" /> 4</label>
            <label class="radio-label"><input type="radio" name="g${num}_e1" value="5" /> 5</label>
            <span class="likert-extremo">Concordo</span>
          </div>
        </div>

        <div class="pergunta-card">
          <p>2) O gráfico despertou meu interesse pelo assunto apresentado.</p>
          <div class="likert-container">
            <span class="likert-extremo">Discordo</span>
            <label class="radio-label"><input type="radio" name="g${num}_e2" value="1" required /> 1</label>
            <label class="radio-label"><input type="radio" name="g${num}_e2" value="2" /> 2</label>
            <label class="radio-label"><input type="radio" name="g${num}_e2" value="3" /> 3</label>
            <label class="radio-label"><input type="radio" name="g${num}_e2" value="4" /> 4</label>
            <label class="radio-label"><input type="radio" name="g${num}_e2" value="5" /> 5</label>
            <span class="likert-extremo">Concordo</span>
          </div>
        </div>

        <div class="pergunta-card">
          <p>3) Gostaria de ver mais visualizações como essa em outras situações.</p>
          <div class="likert-container">
            <span class="likert-extremo">Discordo</span>
            <label class="radio-label"><input type="radio" name="g${num}_e3" value="1" required /> 1</label>
            <label class="radio-label"><input type="radio" name="g${num}_e3" value="2" /> 2</label>
            <label class="radio-label"><input type="radio" name="g${num}_e3" value="3" /> 3</label>
            <label class="radio-label"><input type="radio" name="g${num}_e3" value="4" /> 4</label>
            <label class="radio-label"><input type="radio" name="g${num}_e3" value="5" /> 5</label>
            <span class="likert-extremo">Concordo</span>
          </div>
        </div>

        <button type="button" id="btn-g${num}-mem-avancar" class="btn-primary btn-avancar-mem" data-id="${num}">
          ${num < NUM_GRAFICOS ? `Confirmar e Ir para o Gráfico ${num + 1} de ${NUM_GRAFICOS}` : 'Concluir Avaliação dos Gráficos'}
        </button>
      </div>
    </section>
    `;
  });

  container.innerHTML = html;
  conectarBotoesGraficos();
  atualizarMenuDebug();
}

// ================================
// CONTROLE DE NAVEGAÇÃO E PROGRESSO
// ================================
const ORDEM_TELAS = [
  "tela-inicial",
  "tela-numeracia",
  "tela-minivlat-1",
  "tela-minivlat-2",
  "tela-minivlat-3",
  "tela-minivlat-4",
  "tela-transicao",
  "tela-grafico1",
  "tela-memoria1",
  "tela-grafico2",
  "tela-memoria2",
  "tela-grafico3",
  "tela-memoria3",
  "tela-grafico4",
  "tela-memoria4",
  "tela-grafico5",
  "tela-memoria5",
  "tela-grafico6",
  "tela-memoria6",
  "tela-grafico7",
  "tela-memoria7",
  "tela-grafico8",
  "tela-memoria8",
  "tela-final"
];

function mostrarTela(idTela) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativo'));
  const tela = document.getElementById(idTela);
  if (tela) {
    tela.classList.add('ativo');
  }
  window.scrollTo(0, 0);

  // Atualizar barra de progresso
  const idx = ORDEM_TELAS.indexOf(idTela);
  const barra = document.getElementById('barra-progresso');
  if (barra && idx >= 0) {
    const percent = Math.round((idx / (ORDEM_TELAS.length - 1)) * 100);
    barra.style.width = percent + "%";
  }
}

function salvarLocalStorage() {
  localStorage.setItem("respostas_experimento", JSON.stringify(respostas));
}

function obterTempoTotal() {
  return Math.round((Date.now() - tempoInicio) / 1000);
}

function getRadioValue(name) {
  const radios = document.getElementsByName(name);
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) return radios[i].value;
  }
  return null;
}

// ================================
// CÁLCULO DE RESULTADOS E EXPORTAÇÃO
// ================================
function calcularEstatisticas() {
  // 1. Numeracia (0 a 4)
  let acertosNumeracia = 0;
  if (parseInt(respostas.numeracia.num1) === GABARITO_NUMERACIA.num1) acertosNumeracia++;
  if (parseFloat(respostas.numeracia.num2) === GABARITO_NUMERACIA.num2) acertosNumeracia++;
  if (parseInt(respostas.numeracia.num3) === GABARITO_NUMERACIA.num3) acertosNumeracia++;
  if (parseFloat(respostas.numeracia.num4) === GABARITO_NUMERACIA.num4) acertosNumeracia++;

  // 2. Mini-VLAT (0 a 12)
  let acertosVlat = 0;
  for (let i = 1; i <= 12; i++) {
    const resp = respostas.vlat['vlat' + i];
    if (resp && resp.toString().trim() === GABARITO_VLAT['vlat' + i]) {
      acertosVlat++;
    }
  }

  // 3. Gráficos do Experimento
  let compIconesAcertos = 0;
  let compSemIconesAcertos = 0;
  let memIconesAcertos = 0;
  let memSemIconesAcertos = 0;
  let likertIcones = [];
  let likertSemIcones = [];

  alocacaoGraficos.forEach((item, idx) => {
    const num = idx + 1;
    const respGrafico = respostas.graficos['g' + num] || {};
    const dado = item.dado;

    const compCorreta = respGrafico.compreensao === dado.compreensao.correta;
    const memCorreta = respGrafico.memoria === dado.memoria.correta;

    const mediaLikert = (
      (parseInt(respGrafico.e1) || 0) +
      (parseInt(respGrafico.e2) || 0) +
      (parseInt(respGrafico.e3) || 0)
    ) / 3;

    if (item.condicao === "com_icones") {
      if (compCorreta) compIconesAcertos++;
      if (memCorreta) memIconesAcertos++;
      likertIcones.push(mediaLikert);
    } else {
      if (compCorreta) compSemIconesAcertos++;
      if (memCorreta) memSemIconesAcertos++;
      likertSemIcones.push(mediaLikert);
    }
  });

  const mediaLikertIcones = likertIcones.length ? (likertIcones.reduce((a, b) => a + b, 0) / likertIcones.length) : 0;
  const mediaLikertSemIcones = likertSemIcones.length ? (likertSemIcones.reduce((a, b) => a + b, 0) / likertSemIcones.length) : 0;

  return {
    acertos_numeracia: acertosNumeracia,
    acertos_vlat: acertosVlat,
    comp_com_icones_acertos: compIconesAcertos, // de 4
    comp_sem_icones_acertos: compSemIconesAcertos, // de 4
    mem_com_icones_acertos: memIconesAcertos, // de 4
    mem_sem_icones_acertos: memSemIconesAcertos, // de 4
    engajamento_medio_com_icones: Number(mediaLikertIcones.toFixed(2)),
    engajamento_medio_sem_icones: Number(mediaLikertSemIcones.toFixed(2))
  };
}

function finalizarExperimento() {
  const estatisticas = calcularEstatisticas();

  const dataExport = {
    id_participante: participanteId,
    instituicao: instituicao,
    timestamp: new Date().toISOString(),
    tempo_total_segundos: obterTempoTotal(),
    alocacao_graficos: alocacaoGraficos.map(a => ({
      ordem: a.index,
      tema: a.tema,
      condicao: a.condicao,
      imagem: a.imgSrc
    })),
    resumo_desempenho: estatisticas,
    respostas: respostas
  };

  // Exportar arquivo JSON local como backup
  const blob = new Blob([JSON.stringify(dataExport, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `experimento_${participanteId}.json`;
  a.click();
  URL.revokeObjectURL(url);

  // Enviar dados consolidados para o SheetDB
  const dadosPlanilha = {
    id_participante: participanteId,
    instituicao: instituicao,
    data_hora: dataExport.timestamp,
    tempo_segundos: dataExport.tempo_total_segundos,
    acertos_numeracia: estatisticas.acertos_numeracia,
    acertos_vlat: estatisticas.acertos_vlat,
    comp_icones: estatisticas.comp_com_icones_acertos,
    comp_sem_icones: estatisticas.comp_sem_icones_acertos,
    mem_icones: estatisticas.mem_com_icones_acertos,
    mem_sem_icones: estatisticas.mem_sem_icones_acertos,
    engajamento_icones: estatisticas.engajamento_medio_com_icones,
    engajamento_sem_icones: estatisticas.engajamento_medio_sem_icones,
    email: respostas.emailFinal || "",
    json_completo: JSON.stringify(dataExport)
  };

  fetch(SHEETDB_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [ dadosPlanilha ] })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Dados salvos no SheetDB com sucesso:', data);
  })
  .catch(err => {
    console.error('Erro ao salvar no SheetDB:', err);
  });
}

// ================================
// EVENT LISTENERS DOS BOTÕES DE GRÁFICOS
// ================================
function conectarBotoesGraficos() {
  // Botões de avanço da Compreensão (Tela A -> Tela B)
  document.querySelectorAll('.btn-avancar-comp').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      const comp = getRadioValue(`g${id}_comp`);

      if (!comp) {
        alert("Por favor, selecione uma alternativa para a pergunta de compreensão antes de avançar.");
        return;
      }

      if (!respostas.graficos[`g${id}`]) {
        respostas.graficos[`g${id}`] = {};
      }
      respostas.graficos[`g${id}`].compreensao = comp;
      respostas.graficos[`g${id}`].condicao = alocacaoGraficos[id - 1].condicao;
      respostas.graficos[`g${id}`].tema = alocacaoGraficos[id - 1].tema;
      salvarLocalStorage();

      mostrarTela(`tela-memoria${id}`);
    });
  });

  // Botões de avanço da Recordação e Avaliação (Tela B -> Gráfico seguinte ou Tela Final)
  document.querySelectorAll('.btn-avancar-mem').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      const mem = getRadioValue(`g${id}_mem`);
      const e1 = getRadioValue(`g${id}_e1`);
      const e2 = getRadioValue(`g${id}_e2`);
      const e3 = getRadioValue(`g${id}_e3`);

      if (!mem) {
        alert("Por favor, responda à pergunta de recordação (memória) antes de prosseguir.");
        return;
      }
      if (!e1 || !e2 || !e3) {
        alert("Por favor, responda a todas as 3 perguntas de avaliação da visualização.");
        return;
      }

      respostas.graficos[`g${id}`].memoria = mem;
      respostas.graficos[`g${id}`].e1 = e1;
      respostas.graficos[`g${id}`].e2 = e2;
      respostas.graficos[`g${id}`].e3 = e3;
      salvarLocalStorage();

      if (id < NUM_GRAFICOS) {
        mostrarTela(`tela-grafico${id + 1}`);
      } else {
        // Exibir ID do participante na tela final
        const badgeElem = document.getElementById('id-participante-display');
        if (badgeElem) {
          badgeElem.textContent = participanteId;
        }
        mostrarTela('tela-final');
      }
    });
  });
}

// ================================
// ATUALIZAÇÃO DO MENU DE DEBUG
// ================================
function atualizarMenuDebug() {
  const debugDropdown = document.getElementById('debug-dropdown');
  if (!debugDropdown) return;

  debugDropdown.innerHTML = '<option value="">Selecione...</option>';
  const telas = document.querySelectorAll('.tela');
  telas.forEach(tela => {
    const option = document.createElement('option');
    option.value = tela.id;
    option.textContent = tela.getAttribute('aria-label') || tela.id;
    debugDropdown.appendChild(option);
  });
}

// ================================
// INICIALIZAÇÃO E EVENTOS GERAIS
// ================================
window.addEventListener('DOMContentLoaded', () => {
  // Gerar telas dos gráficos
  gerarTelasGraficos();

  // Iniciar na primeira tela
  mostrarTela('tela-inicial');

  // BOTÃO INICIAR EXPERIMENTO
  document.getElementById('btn-iniciar').addEventListener('click', () => {
    const instSelect = document.getElementById('instituicao-select');
    instituicao = instSelect ? instSelect.value : "ESDI";

    // Gera ID anônimo no formato ENCE001 ou ESDI001 com numeração aleatória
    const numAleatorio = Math.floor(100 + Math.random() * 900);
    participanteId = `${instituicao}${numAleatorio}`;

    respostas.id_participante = participanteId;
    respostas.instituicao = instituicao;
    salvarLocalStorage();

    mostrarTela('tela-numeracia');
  });

  // PARTE 1: NUMERACIA
  document.getElementById('form-numeracia').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);

    respostas.numeracia = {
      num1: fd.get('num1'),
      num2: fd.get('num2'),
      num3: fd.get('num3'),
      num4: fd.get('num4')
    };

    salvarLocalStorage();
    mostrarTela('tela-minivlat-1');
  });

  // PARTE 2: MINI-VLAT PÁGINA 1 (Q1 a Q3)
  document.getElementById('form-minivlat-1').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    for (let i = 1; i <= 3; i++) {
      respostas.vlat['vlat' + i] = fd.get('vlat' + i) || '';
    }
    salvarLocalStorage();
    mostrarTela('tela-minivlat-2');
  });

  // PARTE 2: MINI-VLAT PÁGINA 2 (Q4 a Q6)
  document.getElementById('form-minivlat-2').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    for (let i = 4; i <= 6; i++) {
      respostas.vlat['vlat' + i] = fd.get('vlat' + i) || '';
    }
    salvarLocalStorage();
    mostrarTela('tela-minivlat-3');
  });

  // PARTE 2: MINI-VLAT PÁGINA 3 (Q7 a Q9)
  document.getElementById('form-minivlat-3').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    for (let i = 7; i <= 9; i++) {
      respostas.vlat['vlat' + i] = fd.get('vlat' + i) || '';
    }
    salvarLocalStorage();
    mostrarTela('tela-minivlat-4');
  });

  // PARTE 2: MINI-VLAT PÁGINA 4 (Q10 a Q12)
  document.getElementById('form-minivlat-4').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    for (let i = 10; i <= 12; i++) {
      respostas.vlat['vlat' + i] = fd.get('vlat' + i) || '';
    }
    salvarLocalStorage();
    mostrarTela('tela-transicao');
  });

  // TELA DE TRANSIÇÃO -> GRÁFICO 1
  document.getElementById('btn-avancar-transicao').addEventListener('click', () => {
    mostrarTela('tela-grafico1');
  });

  // FINALIZAR EXPERIMENTO
  document.getElementById('btn-final-ok').addEventListener('click', () => {
    const emailElem = document.getElementById('email-input');
    respostas.emailFinal = emailElem ? emailElem.value.trim() : "";
    salvarLocalStorage();
    finalizarExperimento();
    alert("Experimento concluído e dados salvos com sucesso! Muito obrigado pela sua contribuição.");
  });

  // DEBUG DROPDOWN
  const debugDropdown = document.getElementById('debug-dropdown');
  if (debugDropdown) {
    debugDropdown.addEventListener('change', (e) => {
      if (e.target.value) {
        mostrarTela(e.target.value);
      }
    });
  }
});

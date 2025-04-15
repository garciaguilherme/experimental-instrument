// ================================
// VARIÁVEIS GLOBAIS
// ================================
let nivelLetramento = null;    // "baixo", "médio" ou "alto"
let grupoVisual = null;        // "controle" ou "experimental"
let respostas = {
  letramento: {},
  grafico1: {},
  grafico2: {},
  grafico3: {},
  finalEngajamento: {}       // Armazenará as respostas Likert da tela final
};
let tempoInicio = Date.now();

// URL do SheetDB (substitua pelo seu ID real)
const SHEETDB_URL = 'https://sheetdb.io/api/v1/0hz7t51f4ukq9';

// ================================
// FUNÇÕES ÚTEIS
// ================================
function mostrarTela(idTela) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativo'));
  document.getElementById(idTela).classList.add('ativo');
}

function calcularNivelLetramento() {
  let pontos = 0;
  if (respostas.letramento.q1 === "d") pontos++;
  if (respostas.letramento.q2 === "d") pontos++;
  if (respostas.letramento.q3 === "d") pontos++;
  if (respostas.letramento.q4 === "a") pontos++;
  if (pontos <= 2) return "baixo";
  if (pontos === 3) return "médio";
  return "alto";
}

function sortearGrupoVisual() {
  return Math.random() < 0.5 ? "controle" : "experimental";
}

function salvarLocalStorage() {
  localStorage.setItem("respostas_experimento", JSON.stringify(respostas));
}

function obterTempoTotal() {
  let agora = Date.now();
  return Math.round((agora - tempoInicio) / 1000);
}

function exportarLocalmente(dataExport) {
  const blob = new Blob([JSON.stringify(dataExport, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "respostas_experimento.json";
  a.click();
  URL.revokeObjectURL(url);
}

function enviarDadosAoSheetDB(dataExport) {
  const dadosSheetDB = {
    data: [{
      timestamp: new Date().toISOString(),
      letramento_nivel: dataExport.respostas.q1, // ou dataExport.letramento_nivel se preferir
      grupo_visual: dataExport.grupo_visual,
      tempo_total_segundos: dataExport.tempo_total_segundos,
      q1: dataExport.respostas.q1,
      q2: dataExport.respostas.q2,
      q3: dataExport.respostas.q3,
      q4: dataExport.respostas.q4,
      q5: (dataExport.respostas.q5 || []).join('; '),
      g1_compreensao: dataExport.respostas.grafico1.compreensao || '',
      g1_distracao: dataExport.respostas.grafico1.distracao || '',
      g1_memoria: dataExport.respostas.grafico1.memoria || '',
      g1_engajamento: (dataExport.respostas.grafico1.engajamento || []).join(', '),
      g2_compreensao: dataExport.respostas.grafico2.compreensao || '',
      g2_distracao: dataExport.respostas.grafico2.distracao || '',
      g2_memoria: dataExport.respostas.grafico2.memoria || '',
      g2_engajamento: (dataExport.respostas.grafico2.engajamento || []).join(', '),
      g3_compreensao: dataExport.respostas.grafico3.compreensao || '',
      g3_distracao: dataExport.respostas.grafico3.distracao || '',
      g3_memoria: dataExport.respostas.grafico3.memoria || '',
      g3_engajamento: (dataExport.respostas.grafico3.engajamento || []).join(', '),
      final_e1: dataExport.respostas.finalEngajamento.final_e1 || '',
      final_e2: dataExport.respostas.finalEngajamento.final_e2 || '',
      final_e3: dataExport.respostas.finalEngajamento.final_e3 || ''
    }]
  };

  fetch(SHEETDB_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosSheetDB)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Dados enviados para SheetDB com sucesso:', data);
    alert("Dados enviados com sucesso para SheetDB.");
  })
  .catch(error => {
    console.error('Erro ao enviar para SheetDB:', error);
    alert("Erro ao enviar dados para SheetDB. Verifique a conexão ou URL.");
  });
}

function finalizarExperimento() {
  const dataExport = {
    timestamp: new Date().toISOString(),
    letramento_nivel: nivelLetramento,
    grupo_visual: grupoVisual,
    respostas: {
      q1: respostas.letramento.q1,
      q2: respostas.letramento.q2,
      q3: respostas.letramento.q3,
      q4: respostas.letramento.q4,
      q5: respostas.letramento.q5 || [],
      grafico1: respostas.grafico1,
      grafico2: respostas.grafico2,
      grafico3: respostas.grafico3,
      finalEngajamento: respostas.finalEngajamento || {}
    },
    tempo_total_segundos: obterTempoTotal()
  };

  exportarLocalmente(dataExport);
  enviarDadosAoSheetDB(dataExport);
}

// ================================
// FUNÇÕES PARA SLIDERS (1-5, sem valor inicial)
// ================================
// Se os sliders forem usados em outras telas, a função atualizarValorSlider permanece.
// Para a tela final, estamos usando radio buttons, portanto essa função não será chamada para eles.
function atualizarValorSlider(sliderId, labelId) {
  const slider = document.getElementById(sliderId);
  const label = document.getElementById(labelId);
  if (!slider || !label) return;

  slider.addEventListener('input', () => {
    slider.classList.remove('untouched');
    let valor = parseInt(slider.value);
    if (valor === 0) {
      label.textContent = "(não selecionado)";
    } else {
      label.textContent = valor.toString();
    }
    slider.setAttribute("aria-valuenow", valor);
  });

  label.textContent = "(não selecionado)";
  slider.setAttribute("aria-valuenow", slider.value);
}

// Se necessário, inicialize algum slider usando atualizarValorSlider (não para a tela final Likert)
// atualizarValorSlider("final_e1", "final_e1_value");

function validarSliders(sliderIds, erroId) {
  let valido = true;
  sliderIds.forEach(id => {
    const val = parseInt(document.getElementById(id).value);
    if (val < 1 || val > 5) {
      valido = false;
    }
  });
  document.getElementById(erroId).style.display = valido ? "none" : "block";
  return valido;
}

// Função para obter resposta Likert (para radio buttons)
function getLikertResponse(name) {
  const radios = document.getElementsByName(name);
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
  return null;
}

// ================================
// EVENTOS AO CARREGAR A PÁGINA
// ================================
window.addEventListener('DOMContentLoaded', () => {
  console.log("DOM totalmente carregado");
  console.log("btn-iniciar:", document.getElementById('btn-iniciar'));

  // TELA INICIAL
  document.getElementById('btn-iniciar').addEventListener('click', () => {
    console.log("Botão Iniciar clicado!");
    mostrarTela('tela-letramento');
  });

  // TESTE DE LETRAMENTO
  document.getElementById('form-letramento').addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    respostas.letramento.q1 = formData.get('q1');
    respostas.letramento.q2 = formData.get('q2');
    respostas.letramento.q3 = formData.get('q3');
    respostas.letramento.q4 = formData.get('q4');
    respostas.letramento.q5 = formData.getAll('q5');

    nivelLetramento = calcularNivelLetramento();
    grupoVisual = sortearGrupoVisual();
    salvarLocalStorage();

    mostrarTela('tela-transicao');
  });

  // TELA TRANSIÇÃO
  document.getElementById('btn-avancar-transicao').addEventListener('click', () => {
    mostrarTela('tela-grafico1');
    const g1Img = document.getElementById('grafico1-img');
    if (grupoVisual === "controle") {
      g1Img.src = "assets/graficos/grafico1_barras_controle.svg"; 
    } else {
      g1Img.src = "assets/graficos/grafico1_barras_experimental.svg";
    }
  });

  // GRÁFICO 1
  document.getElementById('btn-g1-compreensao-ok').addEventListener('click', () => {
    const sel = document.querySelector('input[name="g1_compreensao"]:checked');
    if (!sel) {
      alert("Selecione uma resposta de compreensão.");
      return;
    }
    respostas.grafico1.compreensao = sel.value;
    salvarLocalStorage();
    mostrarTela('tela-grafico1-distracao');
    document.getElementById('g1-distracao-input').focus();
  });

  document.getElementById('btn-g1-distracao-fim').addEventListener('click', () => {
    const distraInput = document.getElementById('g1-distracao-input');
    const erro = document.getElementById('g1-distracao-erro');
    if (!distraInput.value || distraInput.value.trim().length < 3) {
      erro.style.display = "block";
      return;
    }
    erro.style.display = "none";

    respostas.grafico1.distracao = distraInput.value.trim();
    salvarLocalStorage();
    mostrarTela('tela-grafico1-memoria');
  });

  document.getElementById('btn-g1-memoria-ok').addEventListener('click', () => {
    const sel = document.querySelector('input[name="g1_memoria"]:checked');
    if (!sel) {
      alert("Selecione uma resposta de memória.");
      return;
    }
    respostas.grafico1.memoria = sel.value;
    salvarLocalStorage();
    mostrarTela('tela-grafico2');
    const g2Img = document.getElementById('grafico2-img');
    g2Img.src = grupoVisual === "controle"
      ? "assets/graficos/grafico2_linha_controle.svg"
      : "assets/graficos/grafico2_linha_experimental.svg";
  });

  // GRÁFICO 2
  document.getElementById('btn-g2-compreensao-ok').addEventListener('click', () => {
    const sel = document.querySelector('input[name="g2_compreensao"]:checked');
    if (!sel) {
      alert("Selecione uma resposta de compreensão.");
      return;
    }
    respostas.grafico2.compreensao = sel.value;
    salvarLocalStorage();
    mostrarTela('tela-grafico2-distracao');
    document.getElementById('g2-distracao-input').focus();
  });

  document.getElementById('btn-g2-distracao-fim').addEventListener('click', () => {
    const inputVal = document.getElementById('g2-distracao-input').value.trim();
    const erroElem = document.getElementById('g2-distracao-erro');
    if (!inputVal) {
      erroElem.style.display = "block";
      return;
    }
    let palavras = inputVal.split(/\s+/).filter(Boolean);
    if (palavras.length < 3) {
      erroElem.style.display = "block";
      return;
    }
    erroElem.style.display = "none";

    respostas.grafico2.distracao = inputVal;
    salvarLocalStorage();
    mostrarTela('tela-grafico2-memoria');
  });

  document.getElementById('btn-g2-memoria-ok').addEventListener('click', () => {
    const sel = document.querySelector('input[name="g2_memoria"]:checked');
    if (!sel) {
      alert("Selecione uma resposta de memória.");
      return;
    }
    respostas.grafico2.memoria = sel.value;
    salvarLocalStorage();
    mostrarTela('tela-grafico3');
    const g3Img = document.getElementById('grafico3-img');
    g3Img.src = grupoVisual === "controle"
      ? "assets/graficos/grafico3_waffle_controle.png"
      : "assets/graficos/grafico3_waffle_experimental.png";
  });

  // GRÁFICO 3
  document.getElementById('btn-g3-compreensao-ok').addEventListener('click', () => {
    const sel = document.querySelector('input[name="g3_compreensao"]:checked');
    if (!sel) {
      alert("Selecione uma resposta de compreensão.");
      return;
    }
    respostas.grafico3.compreensao = sel.value;
    salvarLocalStorage();
    mostrarTela('tela-grafico3-distracao');
    document.getElementById('g3-distracao-input').focus();
  });

  document.getElementById('btn-g3-distracao-fim').addEventListener('click', () => {
    const inputVal = document.getElementById('g3-distracao-input').value.trim();
    const erroElem = document.getElementById('g3-distracao-erro');
    if (!inputVal) {
      erroElem.style.display = "block";
      return;
    }
    let palavras = inputVal.split(/\s+/).filter(Boolean);
    if (palavras.length < 2) {
      erroElem.style.display = "block";
      return;
    }
    erroElem.style.display = "none";

    respostas.grafico3.distracao = inputVal;
    salvarLocalStorage();
    mostrarTela('tela-grafico3-memoria');
  });

  document.getElementById('btn-g3-memoria-ok').addEventListener('click', () => {
    const sel = document.querySelector('input[name="g3_memoria"]:checked');
    if (!sel) {
      alert("Selecione uma resposta de memória.");
      return;
    }
    respostas.grafico3.memoria = sel.value;
    salvarLocalStorage();
    mostrarTela('tela-engajamento-final');
  });

  // FINAL ENGAGEMENT (Likert radio buttons)
  document.getElementById('btn-final-engajamento-ok').addEventListener('click', () => {
    const r1 = getLikertResponse("final_e1");
    const r2 = getLikertResponse("final_e2");
    const r3 = getLikertResponse("final_e3");
    if (r1 === null || r2 === null || r3 === null) {
      alert("Por favor, selecione uma resposta para cada pergunta.");
      return;
    }
    // Aqui usamos a propriedade com o nome corrigido: finalEngajamento
    respostas.finalEngajamento = { final_e1: r1, final_e2: r2, final_e3: r3 };
    alert("Obrigado por participar!");
    salvarLocalStorage();
    finalizarExperimento();
    mostrarTela('tela-inicial'); // Ou redirecionamento/finalização real
    localStorage.clear();
  });
});

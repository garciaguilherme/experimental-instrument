// ================================
// VARIÁVEIS GLOBAIS
// ================================
let nivelLetramento = null;    // "baixo", "médio" ou "alto"
let grupoVisual = null;        // "controle" ou "experimental"
let respostas = {
  numeracia: {},
  vlat: {},
  graficos: {},
  emailFinal: ""
};
let tempoInicio = Date.now();
const NUM_GRAFICOS = 8;
const SHEETDB_URL = 'https://sheetdb.io/api/v1/0hz7t51f4ukq9';

// ================================
// GERAÇÃO DINÂMICA DOS GRÁFICOS
// ================================
function gerarTelasGraficos() {
  const container = document.getElementById('graficos-container');
  let html = "";
  
  for (let i = 1; i <= NUM_GRAFICOS; i++) {
    html += `
    <section id="tela-grafico${i}" class="tela" aria-label="Gráfico ${i}">
      <div class="conteudo">
        <h2 style="margin-bottom: 0; text-align: center;"><span class="contador-discreto" style="margin-left: 0; font-size: 1rem;">${i}/${NUM_GRAFICOS}</span></h2>
        <div style="width:100%; height:300px; background-color:#e0e0e0; display:flex; align-items:center; justify-content:center; margin-bottom:20px; margin-top: 15px;">
          <span style="color:#666;">[Placeholder Imagem Gráfico ${i}]</span>
        </div>
        
        <div class="pergunta-card">
          <p><strong>[Placeholder] Pergunta de compreensão para o Gráfico ${i}:</strong></p>
          <label class="radio-label"><input type="radio" name="g${i}_comp" value="a" required /> Alternativa A</label>
          <label class="radio-label"><input type="radio" name="g${i}_comp" value="b" /> Alternativa B</label>
          <label class="radio-label"><input type="radio" name="g${i}_comp" value="c" /> Alternativa C</label>
          <label class="radio-label"><input type="radio" name="g${i}_comp" value="d" /> Alternativa D</label>
        </div>

        <hr style="margin: 30px 0;">
        <h3 style="margin-bottom: 5px;">Avaliação de Engajamento</h3>
        <p style="color:#475569; margin-bottom: 20px;">Selecione de 1 (discordo totalmente) a 5 (concordo totalmente):</p>
        
        <div class="pergunta-card">
          <p>1) O gráfico me deixou curioso(a) para saber mais sobre o tema.</p>
          <div class="likert-container">
            <span class="likert-extremo">Discordo</span>
            <label class="radio-label"><input type="radio" name="g${i}_e1" value="1" required /> 1</label>
            <label class="radio-label"><input type="radio" name="g${i}_e1" value="2" /> 2</label>
            <label class="radio-label"><input type="radio" name="g${i}_e1" value="3" /> 3</label>
            <label class="radio-label"><input type="radio" name="g${i}_e1" value="4" /> 4</label>
            <label class="radio-label"><input type="radio" name="g${i}_e1" value="5" /> 5</label>
            <span class="likert-extremo">Concordo</span>
          </div>
        </div>
        <div class="pergunta-card">
          <p>2) O gráfico despertou meu interesse pelo assunto apresentado.</p>
          <div class="likert-container">
            <span class="likert-extremo">Discordo</span>
            <label class="radio-label"><input type="radio" name="g${i}_e2" value="1" required /> 1</label>
            <label class="radio-label"><input type="radio" name="g${i}_e2" value="2" /> 2</label>
            <label class="radio-label"><input type="radio" name="g${i}_e2" value="3" /> 3</label>
            <label class="radio-label"><input type="radio" name="g${i}_e2" value="4" /> 4</label>
            <label class="radio-label"><input type="radio" name="g${i}_e2" value="5" /> 5</label>
            <span class="likert-extremo">Concordo</span>
          </div>
        </div>
        <div class="pergunta-card">
          <p>3) Gostaria de ver mais visualizações como essa em outras situações.</p>
          <div class="likert-container">
            <span class="likert-extremo">Discordo</span>
            <label class="radio-label"><input type="radio" name="g${i}_e3" value="1" required /> 1</label>
            <label class="radio-label"><input type="radio" name="g${i}_e3" value="2" /> 2</label>
            <label class="radio-label"><input type="radio" name="g${i}_e3" value="3" /> 3</label>
            <label class="radio-label"><input type="radio" name="g${i}_e3" value="4" /> 4</label>
            <label class="radio-label"><input type="radio" name="g${i}_e3" value="5" /> 5</label>
            <span class="likert-extremo">Concordo</span>
          </div>
        </div>

        <button type="button" id="btn-g${i}-avancar" class="btn-avancar-grafico btn-primary" data-id="${i}">Confirmar e Avançar</button>
      </div>
    </section>
    `;
  }
  container.innerHTML = html;
}

// ================================
// FUNÇÕES ÚTEIS
// ================================
function mostrarTela(idTela) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativo'));
  const tela = document.getElementById(idTela);
  if(tela) tela.classList.add('ativo');
  window.scrollTo(0,0);
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

function getLikertResponse(name) {
  const radios = document.getElementsByName(name);
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) return radios[i].value;
  }
  return null;
}

function finalizarExperimento() {
  const dataExport = {
    timestamp: new Date().toISOString(),
    grupo_visual: grupoVisual,
    tempo_total_segundos: obterTempoTotal(),
    respostas: respostas
  };

  // Exportar local
  const blob = new Blob([JSON.stringify(dataExport, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "respostas_experimento.json";
  a.click();
  URL.revokeObjectURL(url);

  // Payload genérico para o SheetDB
  const dadosSheetDB = { data: [ dataExport ] };

  fetch(SHEETDB_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosSheetDB)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Dados enviados para SheetDB com sucesso:', data);
  })
  .catch(error => {
    console.error('Erro ao enviar para SheetDB:', error);
  });
}

// ================================
// EVENTOS
// ================================
window.addEventListener('DOMContentLoaded', () => {
  gerarTelasGraficos();

  // INICIAR
  document.getElementById('btn-iniciar').addEventListener('click', () => {
    mostrarTela('tela-numeracia');
  });

  // NUMERACIA
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

  // MINIVLAT 1
  document.getElementById('form-minivlat-1').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    for(let i=1; i<=3; i++) respostas.vlat['vlat'+i] = fd.get('vlat'+i) || '';
    salvarLocalStorage();
    mostrarTela('tela-minivlat-2');
  });

  // MINIVLAT 2
  document.getElementById('form-minivlat-2').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    for(let i=4; i<=6; i++) respostas.vlat['vlat'+i] = fd.get('vlat'+i) || '';
    salvarLocalStorage();
    mostrarTela('tela-minivlat-3');
  });

  // MINIVLAT 3
  document.getElementById('form-minivlat-3').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    for(let i=7; i<=9; i++) respostas.vlat['vlat'+i] = fd.get('vlat'+i) || '';
    salvarLocalStorage();
    mostrarTela('tela-minivlat-4');
  });

  // MINIVLAT 4
  document.getElementById('form-minivlat-4').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    for(let i=10; i<=12; i++) respostas.vlat['vlat'+i] = fd.get('vlat'+i) || '';
    
    grupoVisual = sortearGrupoVisual();
    salvarLocalStorage();
    mostrarTela('tela-transicao');
  });

  // TRANSIÇÃO
  document.getElementById('btn-avancar-transicao').addEventListener('click', () => {
    mostrarTela('tela-grafico1');
  });

  // Iniciar na primeira tela
  mostrarTela('tela-inicial');
  
  // ==========================================
  // LÓGICA DO MENU DE DEBUG
  // ==========================================
  const debugDropdown = document.getElementById('debug-dropdown');
  const telas = document.querySelectorAll('.tela');
  
  if (debugDropdown) {
    telas.forEach(tela => {
      const option = document.createElement('option');
      option.value = tela.id;
      option.textContent = tela.id;
      debugDropdown.appendChild(option);
    });

    debugDropdown.addEventListener('change', (e) => {
      if (e.target.value) {
        mostrarTela(e.target.value);
        // Opcional: Voltar o select para default após pular
        // e.target.value = '';
      }
    });
  }

  // EVENTOS PARA OS BOTÕES DOS 8 GRÁFICOS
  document.querySelectorAll('.btn-avancar-grafico').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      
      const comp = getLikertResponse(`g${id}_comp`);
      const e1 = getLikertResponse(`g${id}_e1`);
      const e2 = getLikertResponse(`g${id}_e2`);
      const e3 = getLikertResponse(`g${id}_e3`);

      if (!comp) { alert("Selecione a resposta de compreensão."); return; }
      if (!e1 || !e2 || !e3) { alert("Responda todas as perguntas de engajamento."); return; }

      respostas.graficos[`g${id}`] = { compreensao: comp, e1, e2, e3 };
      salvarLocalStorage();

      if (id < NUM_GRAFICOS) {
        mostrarTela(`tela-grafico${id + 1}`);
      } else {
        mostrarTela('tela-final');
      }
    });
  });

  // FINALIZAR
  document.getElementById('btn-final-ok').addEventListener('click', () => {
    respostas.emailFinal = document.getElementById('email-input').value;
    salvarLocalStorage();
    finalizarExperimento();
    alert("Experimento concluído e dados salvos! Obrigado.");
    localStorage.clear();
  });
});

const alunosTeorico = [];
const alunosPratico = [];
const grupos = {};

function fetchData() {
  fetch('https://sheets.googleapis.com/v4/spreadsheets/1wjSp9kOEwOn4hPg0Px1psUjfC2-yg38OuQXrXRvNrIo/values/grupos!A1:Z200?majorDimension=ROWS&key=AIzaSyAVbkJxfxctVsI0DxtReILS3MYZaTxWoUw')
    .then(response => response.json())
    .then(data => {  processarAlunos(data.values, 1, alunosTeorico); processarAlunos(data.values, 2, alunosPratico); processarGrupos(data.values)})
    .catch(error => console.error('Erro ao recuperar os dados:', error));
}

function processarAlunos(data, tipo, alunos) {
  const nomeIndex = 0;
  const pontuacaoIndex = tipo === 1 ? 1 : 2; // 1 para Teórico, 2 para Prático
  const grupoIndex = 4;

  for (let i = 1; i < data.length; i++) {
    const aluno = {
      nome: data[i][nomeIndex],
      pontuacao: parseInt(data[i][pontuacaoIndex]),
      grupo: data[i][grupoIndex]
    };
    alunos.push(aluno);
  }

  alunos.sort((a, b) => b.pontuacao - a.pontuacao);

  if (tipo === 1) {
    //console.log('Alunos (Teórico):', alunosTeorico);
    preencherTabela(alunosTeorico, 'teorico');
  } else {
    //console.log('Alunos (Prático):', alunosPratico);
    preencherTabela(alunosPratico, 'pratico');
  }
}

function preencherTabela(alunos, tabelaId) {
  const tbody = document.getElementById(tabelaId);
  const limit = 3;
  tbody.innerHTML = '';

  for (let i = 0; i < alunos.length && i < limit; i++) {
    const aluno = alunos[i];
    const row = document.createElement('tr');

    const nomeCell = document.createElement('td');
    nomeCell.textContent = aluno.nome;
    row.appendChild(nomeCell);

    const pontuacaoCell = document.createElement('td');
    pontuacaoCell.textContent = aluno.pontuacao;
    row.appendChild(pontuacaoCell);

    const grupoCell = document.createElement('td');
    grupoCell.textContent = aluno.grupo;
    row.appendChild(grupoCell);

    tbody.appendChild(row);
  }
}


function processarGrupos(data) {
  const grupoIndex = 4;
  const nomeIndex = 0;
  const pontuacaoIndex = 3;

  

  for (let i = 1; i < data.length; i++) {
    const nomeGrupo = data[i][grupoIndex];
    const nomeAluno = data[i][nomeIndex];
    const pontuacao = parseInt(data[i][pontuacaoIndex]);

    // Verifica se o grupo já existe no objeto grupos
    if (!(nomeGrupo in grupos)) {
      grupos[nomeGrupo] = {
        quantidadePessoas: 0,
        notas: [],
        media: 0
      };
    }

    // Adiciona a pontuação do aluno ao array de notas do grupo
    grupos[nomeGrupo].notas.push(pontuacao);
    // Incrementa a quantidade de pessoas do grupo
    grupos[nomeGrupo].quantidadePessoas++;
  }

  // Calcula a média de cada grupo
  for (const grupo in grupos) {
    const notas = grupos[grupo].notas;
    const somaNotas = notas.reduce((total, nota) => total + nota, 0);
    grupos[grupo].media = somaNotas / notas.length;
  }

  preencherTabelaGrupos();
}

function preencherTabelaGrupos() {
  const tbody = document.getElementById('rankingDeGrupos');
  tbody.innerHTML = '';
  console.log(grupos)

  for (const grupo in grupos) {
    const row = document.createElement('tr');

    const nomeCell = document.createElement('td');
    nomeCell.textContent = grupo;
    row.appendChild(nomeCell);

    const quantidadeCell = document.createElement('td');
    quantidadeCell.textContent = grupos[grupo].quantidadePessoas;
    row.appendChild(quantidadeCell);



    const mediaCell = document.createElement('td');
    mediaCell.textContent = grupos[grupo].media.toFixed(2);
    row.appendChild(mediaCell);

    tbody.appendChild(row);
  }
}



window.onload = fetchData;

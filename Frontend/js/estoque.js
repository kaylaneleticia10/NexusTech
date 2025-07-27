const URL_API = 'http://localhost:3000';
let idEditando = null;

// Função para formatar datas para o padrão YYYY-MM-DD (input date)
function formatarDataParaInput(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// Carregar produtos no select
async function carregarProdutos() {
  const res = await fetch(`${URL_API}/produtos`);
  const produtos = await res.json();
  const select = document.getElementById('select-produto');
  select.innerHTML = '<option value="" disabled selected>Selecione o produto</option>';

  produtos.forEach(prod => {
    const option = document.createElement('option');
    option.value = prod.id;
    option.textContent = prod.nome;
    select.appendChild(option);
  });
}

// Enviar entrada de estoque
async function enviarEntradaEstoque(e) {
  e.preventDefault();

  const idProduto = document.getElementById('select-produto').value;
  const qtdNova = parseInt(document.getElementById('input-qtd').value);
  const dataEntrada = document.getElementById('input-data-entrada').value;
  const dataValidade = document.getElementById('input-data-vencimento').value;
  const custo = parseFloat(document.getElementById('input-custo').value);
  const lote = document.getElementById('input-lote').value;
  const obs = document.getElementById('textarea-obs').value;

  if (!idProduto || !qtdNova || !dataEntrada || !dataValidade || isNaN(custo)) {
    alert('Por favor, preencha todos os campos obrigatórios corretamente!');
    return;
  }

  // Buscar o estoque atual para esse produto
  const resEstoque = await fetch(`${URL_API}/estoque`);
  const estoque = await resEstoque.json();

  // Filtra as entradas do produto selecionado
  const entradasProduto = estoque.filter(item => item.id_produto == idProduto);

  // Pega a última quantidade cadastrada (pela maior id)
  const ultimaEntrada = entradasProduto.length > 0
    ? entradasProduto.reduce((max, item) => (item.id > max.id ? item : max))
    : null;

  // Se tiver entrada, soma; senão, só a qtd nova
  const novaQtdTotal = ultimaEntrada ? (ultimaEntrada.quantidade + qtdNova) : qtdNova;

  const dados = {
    id_produto: idProduto,
    quantidade: novaQtdTotal,
    data_entrada: dataEntrada,
    data_validade: dataValidade,
    custo: custo,
    lote: lote,
    obs: obs
  };

  if (idEditando) {
    const res = await fetch(`${URL_API}/estoque/${idEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!res.ok) {
      alert('Erro ao atualizar o estoque!');
      return;
    }
    idEditando = null;
  } else {
    const res = await fetch(`${URL_API}/estoque`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!res.ok) {
      alert('Erro ao adicionar o estoque!');
      return;
    }
  }

  document.getElementById('form-entrada-estoque').reset();
  carregarEstoque();
}

// Carregar estoque
async function carregarEstoque() {
  const res = await fetch(`${URL_API}/estoque`);
  const estoque = await res.json();
  const lista = document.getElementById('lista-estoque');
  lista.innerHTML = '';

  estoque.forEach(item => {
    const custoFormatado = item.custo !== null && item.custo !== undefined
      ? `R$ ${parseFloat(item.custo).toFixed(2)}`
      : '---';

    const li = document.createElement('li');
    li.innerHTML = `
      <span class="label">Produto:</span><span class="value">${item.nome_produto}</span><br>
      <span class="label">Quantidade:</span><span class="value">${item.quantidade}</span><br>
      <span class="label">Custo:</span><span class="value">${custoFormatado}</span><br>
      <span class="label">Lote:</span><span class="value">${item.lote}</span><br>
      <span class="label">Entrada:</span><span class="value">${formatarDataParaInput(item.data_entrada)}</span><br>
      <span class="label">Validade:</span><span class="value">${formatarDataParaInput(item.data_validade)}</span><br>
      <span class="label">Observações:</span><span class="value">${item.obs || '---'}</span><br>
    `;

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.className = 'btn-editar';
    btnEditar.addEventListener('click', () => editarEntrada(item));

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.className = 'btn-excluir';
    btnExcluir.addEventListener('click', () => deletarEntrada(item.id));

    li.appendChild(btnEditar);
    li.appendChild(btnExcluir);

    lista.appendChild(li);
  });
}

function editarEntrada(item) {
  document.getElementById('select-produto').value = item.id_produto;
  document.getElementById('input-qtd').value = item.quantidade;
  document.getElementById('input-data-entrada').value = formatarDataParaInput(item.data_entrada);
  document.getElementById('input-custo').value = item.custo;
  document.getElementById('input-lote').value = item.lote;
  document.getElementById('input-data-vencimento').value = formatarDataParaInput(item.data_validade);
  document.getElementById('textarea-obs').value = item.obs || '';
  idEditando = item.id;
}

async function deletarEntrada(id) {
  const res = await fetch(`${URL_API}/estoque/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    alert('Erro ao deletar a entrada!');
    return;
  }
  carregarEstoque();
}

document.getElementById('form-entrada-estoque').addEventListener('submit', enviarEntradaEstoque);

carregarProdutos();
carregarEstoque();

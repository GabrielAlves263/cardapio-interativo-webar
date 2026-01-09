// Lista de pratos do cardápio
const cardapio = [
  {
    id: "hamburguer",
    nome: "Hambúrguer Artesanal",
    desc: "Pão brioche, 180g de carne, cheddar e bacon.",
    preco: "R$ 35,00",
    modeloId: "#asset-hamburguer",
    escala: "0.6 0.6 0.6",
  },
  {
    id: "pizza",
    nome: "Pizza Calabresa",
    desc: "Massa fina, molho de tomate e calabresa.",
    preco: "R$ 49,99",
    modeloId: "#asset-pizza",
    escala: "0.2 0.2 0.2",
  },
  {
    id: "sushi",
    nome: "Combo Sushi",
    desc: "12 peças variadas de salmão fresco.",
    preco: "R$ 65,00",
    modeloId: "#asset-sushi",
    escala: "0.2 0.2 0.2",
  },
];

// Índice do prato selecionado
let indiceAtual = 0;

// Atualiza a interface com base no prato selecionado
function atualizarVisualizacao() {
  const prato = cardapio[indiceAtual];
  const marcador = document.querySelector("#marcador");

  // Atualiza o título do HUD
  document.getElementById("hud-titulo").innerText = prato.nome;

  // Atualiza as informações do painel
  document.getElementById("prato-nome").innerText = prato.nome;
  document.getElementById("prato-desc").innerText = prato.desc;
  document.getElementById("prato-preco").innerText = prato.preco;

  // Limpa os modelos anteriores
  marcador.innerHTML = "";

  // Cria uma nova entidade 3D para o prato atual
  const novaEntidade = document.createElement("a-entity");

  novaEntidade.setAttribute("id", "modelo-prato");
  novaEntidade.setAttribute("class", "clicavel");
  novaEntidade.setAttribute("position", "0 1 0");
  novaEntidade.setAttribute("scale", prato.escala);
  novaEntidade.setAttribute("gltf-model", prato.modeloId);

  // Animação de rotação
  novaEntidade.setAttribute(
    "animation",
    "property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear"
  );

  // Configuração extra de animação
  novaEntidade.addEventListener("model-loaded", () => {
    novaEntidade.setAttribute(
      "animation-mixer",
      "loop: once; clampWhenFinished: true"
    );
  });

  // Clique no modelo abre o painel de informações
  novaEntidade.addEventListener("click", abrirInfo);

  // Adiciona o modelo ao marcador
  marcador.appendChild(novaEntidade);
}

// Exibe o painel de informações do prato
function abrirInfo() {
  document.getElementById("info-panel").style.display = "block";
}

// Fecha o painel de informações
function fecharInfo() {
  document.getElementById("info-panel").style.display = "none";
}

// Aguarda o carregamento completo da página
document.addEventListener("DOMContentLoaded", () => {
  const marker = document.querySelector("#marcador");
  const hudContainer = document.querySelector("#hud-container");
  const msgScan = document.querySelector("#mensagem-scan");

  // Quando o marcador é detectado pela câmera
  marker.addEventListener("markerFound", () => {
    hudContainer.style.display = "block";
    msgScan.style.display = "none";
  });

  // Quando o marcador sai da câmera
  marker.addEventListener("markerLost", () => {
    hudContainer.style.display = "none";
    msgScan.style.display = "flex";
    fecharInfo();
  });

  // Adiciona eventos de clique
  const adicionarEventoToque = (id, funcao) => {
    const el = document.querySelector(id);
    if (el) {
      el.addEventListener("click", funcao);
      el.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          funcao();
        },
        { passive: false }
      );
    }
  };

  // Botão de avançar
  adicionarEventoToque("#btn-proximo", () => {
    indiceAtual = (indiceAtual + 1) % cardapio.length;
    atualizarVisualizacao();
  });

  // Botão de voltar
  adicionarEventoToque("#btn-anterior", () => {
    indiceAtual = (indiceAtual - 1 + cardapio.length) % cardapio.length;
    atualizarVisualizacao();
  });

  // Botão para fechar o painel de informações
  adicionarEventoToque("#btn-fechar", fecharInfo);

  // Inicializa a visualização com o primeiro prato
  atualizarVisualizacao();
});

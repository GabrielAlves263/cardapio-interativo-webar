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

let indiceAtual = 0;

function atualizarVisualizacao() {
  const prato = cardapio[indiceAtual];
  const marcador = document.querySelector("#marcador");

  document.getElementById("hud-titulo").innerText = prato.nome;

  document.getElementById("prato-nome").innerText = prato.nome;
  document.getElementById("prato-desc").innerText = prato.desc;
  document.getElementById("prato-preco").innerText = prato.preco;

  marcador.innerHTML = "";

  const novaEntidade = document.createElement("a-entity");

  novaEntidade.setAttribute("id", "modelo-prato");
  novaEntidade.setAttribute("class", "clicavel");
  novaEntidade.setAttribute("position", "0 1 0");
  novaEntidade.setAttribute("scale", prato.escala);
  novaEntidade.setAttribute("gltf-model", prato.modeloId);
  novaEntidade.setAttribute(
    "animation",
    "property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear"
  );

  novaEntidade.addEventListener("model-loaded", () => {
    novaEntidade.setAttribute(
      "animation-mixer",
      "loop: once; clampWhenFinished: true"
    );
  });

  novaEntidade.addEventListener("click", abrirInfo);

  marcador.appendChild(novaEntidade);
}

function abrirInfo() {
  document.getElementById("info-panel").style.display = "block";
}

function fecharInfo() {
  document.getElementById("info-panel").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const marker = document.querySelector("#marcador");
  const hudContainer = document.querySelector("#hud-container");
  const msgScan = document.querySelector("#mensagem-scan");

  marker.addEventListener("markerFound", () => {
    hudContainer.style.display = "block";
    msgScan.style.display = "none";
  });

  marker.addEventListener("markerLost", () => {
    hudContainer.style.display = "none";
    msgScan.style.display = "flex";
    fecharInfo();
  });

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

  adicionarEventoToque("#btn-proximo", () => {
    indiceAtual = (indiceAtual + 1) % cardapio.length;
    atualizarVisualizacao();
  });

  adicionarEventoToque("#btn-anterior", () => {
    indiceAtual = (indiceAtual - 1 + cardapio.length) % cardapio.length;
    atualizarVisualizacao();
  });

  adicionarEventoToque("#btn-fechar", fecharInfo);

  atualizarVisualizacao();
});


const carrinho = {};

const produtos = document.querySelectorAll(".produto");
const listaCarrinho = document.getElementById("itens-carrinho");
const botaoFinalizar = document.getElementById("finalizar-pedido");

// Adiciona um botão a cada produto da vitrine
produtos.forEach((produto) => {
    const nome = produto.querySelector("h3").textContent.trim();

    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = "Adicionar ao pedido";
    botao.className = "botao-adicionar";

    botao.addEventListener("click", () => {
        carrinho[nome] = (carrinho[nome] || 0) + 1;
        atualizarCarrinho();
    });

    produto.appendChild(botao);
});

function atualizarCarrinho() {
    listaCarrinho.innerHTML = "";

    const nomes = Object.keys(carrinho);
    const quantidadeTotal = nomes.reduce(
        (soma, nome) => soma + carrinho[nome],
        0
    );

    if (nomes.length === 0) {
        const vazio = document.createElement("p");
        vazio.className = "carrinho-vazio";
        vazio.textContent = "Seu carrinho está vazio. Escolha seus doces favoritos!";
        listaCarrinho.appendChild(vazio);
        atualizarContador(0);
        return;
    }

    nomes.forEach((nome) => {
        const item = document.createElement("div");
        item.className = "item-carrinho";

        const informacoes = document.createElement("div");
        informacoes.className = "informacoes-item";

        const titulo = document.createElement("strong");
        titulo.textContent = nome;

        const quantidade = document.createElement("span");
        quantidade.textContent = `${carrinho[nome]} unidade(s)`;

        informacoes.append(titulo, quantidade);

        const controles = document.createElement("div");
        controles.className = "controles-quantidade";

        const diminuir = document.createElement("button");
        diminuir.type = "button";
        diminuir.textContent = "−";
        diminuir.className = "botao-quantidade";
        diminuir.setAttribute("aria-label", `Diminuir ${nome}`);

        diminuir.addEventListener("click", () => {
            carrinho[nome]--;

            if (carrinho[nome] <= 0) {
                delete carrinho[nome];
            }

            atualizarCarrinho();
        });

        const numero = document.createElement("span");
        numero.textContent = carrinho[nome];

        const aumentar = document.createElement("button");
        aumentar.type = "button";
        aumentar.textContent = "+";
        aumentar.className = "botao-quantidade";
        aumentar.setAttribute("aria-label", `Aumentar ${nome}`);

        aumentar.addEventListener("click", () => {
            carrinho[nome]++;
            atualizarCarrinho();
        });

        const remover = document.createElement("button");
        remover.type = "button";
        remover.textContent = "Remover";
        remover.className = "botao-remover";

        remover.addEventListener("click", () => {
            delete carrinho[nome];
            atualizarCarrinho();
        });

        controles.append(diminuir, numero, aumentar, remover);
        item.append(informacoes, controles);
        listaCarrinho.appendChild(item);
    });

    atualizarContador(quantidadeTotal);
}

function atualizarContador(quantidade) {
    const contador = document.getElementById("contador-carrinho");

    if (contador) {
        contador.textContent = quantidade;
    }
}

// Esvazia todo o carrinho
const botaoLimpar = document.getElementById("limpar-carrinho");

if (botaoLimpar) {
    botaoLimpar.addEventListener("click", () => {
        Object.keys(carrinho).forEach((nome) => delete carrinho[nome]);
        atualizarCarrinho();
    });
}

// Envia o pedido para o WhatsApp
botaoFinalizar.addEventListener("click", () => {
    const nomes = Object.keys(carrinho);

    if (nomes.length === 0) {
        alert("Seu carrinho está vazio! Adicione um doce primeiro.");
        return;
    }

    let mensagem = "Olá, Samperio! 🍫 Gostaria de fazer este pedido:\n\n";

    nomes.forEach((nome) => {
        mensagem += `• ${nome}: ${carrinho[nome]} unidade(s)\n`;
    });

    mensagem += "\nPoderiam confirmar os preços e a disponibilidade, por favor?";

    const telefone = "5585982134603";
    const link = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(link, "_blank");
});

atualizarCarrinho();


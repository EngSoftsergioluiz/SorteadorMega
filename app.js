// Função de verificação da quantidade de jogos
function verificaMinMax(quantidade) {
    if (quantidade < 1 || quantidade > 15) {
        mostrarModal("A quantidade deve ser no mínimo 1 e no máximo 15.");
        return false; // Impede o sorteio se a quantidade for inválida
    }
    return true;
}

// Função de exibição da modal
function mostrarModal(mensagem) {
    const modal = document.getElementById("modal");
    const modalText = document.getElementById("modal-text");
    modalText.innerText = mensagem;
    modal.classList.add("active");
}

// Função para fechar a modal
function fecharModal() {
    const modal = document.getElementById("modal");
    modal.classList.remove("active");
}

// Função de reinício
function reiniciar() {
    document.getElementById('quantidade').value = ''; // Limpa o campo de quantidade
    document.getElementById('resultado').innerHTML = 'Números sorteados: nenhum até agora'; // Limpa os resultados exibidos
    document.getElementById("btn-sortear").disabled = false; // Habilita novamente o botão de sortear
    document.getElementById("btn-reiniciar").disabled = true; // Desabilita o botão de reiniciar
    document.getElementById("btn-reiniciar").disabled = false; 
    // Habilita o botão de reiniciar após o sorteio
    document.getElementById("btn-reiniciar").classList.add("reiniciar");
    document.getElementById("btn-sortear").classList.remove("remove");
}

// Função de sorteio
function sortear() {
    let quantidade = parseInt(document.getElementById("quantidade").value);
    if (!verificaMinMax(quantidade)) return; // Se a quantidade for inválida, não faz o sorteio

    let de = 1;
    let ate = 60;
    let sorteados = [];
    let numero;
    let resultado = document.getElementById('resultado');
    let resultadoFake = [];
    resultado.innerHTML = ''; // Limpa o campo de resultados antes de gerar novos números

    for (let i = 0; i < quantidade; i++) {
        sorteados = [];
        for (let j = 0; j < 6; j++) {
            numero = Math.floor(Math.random() * (ate - de + 1)) + de;
            while (sorteados.includes(numero)) {
                numero = Math.floor(Math.random() * (ate - de + 1)) + de;
            }
            sorteados.push(numero);
        }
        resultadoFake.push(`Jogo ${i + 1}: ${sorteados.sort((a, b) => a - b).join(", ")}`);
    }
    
    resultado.innerHTML = resultadoFake.join("<br>");
    document.getElementById("btn-reiniciar").disabled = false; 
    // Habilita o botão de reiniciar após o sorteio
    document.getElementById("btn-reiniciar").classList.remove("reiniciar");
    document.getElementById("btn-sortear").disabled = true; // Desabilita o botão de sortear após o sorteio
    document.getElementById("btn-sortear").classList.add("remove");

}

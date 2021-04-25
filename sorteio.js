const tbClubes = document.querySelector(".table");
var hjogos = document.getElementById("times");


const url = "http://localhost:3000/clubes/";

const inserirLinha = (...campos) => {
    const linha = tbClubes.insertRow(-1);

    const estilos = ["text-center", "", "", "text-right", "text-center", "text-center"];

    campos.forEach((campo, i) => {
        const coluna = linha.insertCell(-1);
        coluna.innerHTML = campo;
        coluna.className = estilos[i];
    });
};




window.addEventListener("load", async() => {
    const response = await fetch(url, {
        method: "GET",
    });

    const clubes = await response.json();

    if (response.status == 200) {
        const acoes =
            '<i class="fas fa-edit mr-2" title="Alterar"></i> <i class="fas fa-trash-alt" title="Excluir"></i>';

        for (const clube of clubes) {
            const foto = `<img src="${clube.foto}" alt="Escudo do clune ${clube.nome}" class="imgClube" style="max-width:150px; max-height:100px; width: auto; height: auto;">`;
            inserirLinha(
                clube.id,
                clube.nome,
                clube.cidade,
                clube.treinador,
                Number(clube.pote),
                foto,
                acoes
            );
        }
    } else {
        alert(`Erro: ${clubes.msg}`);
    }
});

buttonTableSorteio.addEventListener("click", async(e) => {
    const response = await fetch(url, {
        method: "GET",
    });
    let jogos = "";
    const clubes = await response.json();
    if (clubes.length % 2 === 0) { //testa se o número de clubes é par
        let clubes1 = [];
        let clubes2 = [];
        let jaSorteados1 = [];
        let jaSorteados2 = [];
        for (let i = 0; i < clubes.length; i++) {
            if (clubes[i].pote === "1") {
                clubes1.push(clubes[i]);
            } else {
                if (clubes[i].pote === "2") {
                    clubes2.push(clubes[i]);
                }
            }
        }

        while (jaSorteados1.length < 4) {
            let indice1 = getRandomIntInclusive(0, clubes1.length - 1);
            let indice2 = getRandomIntInclusive(0, clubes2.length - 1);
            let existe = false;
            for (let i = 0; i < clubes1.length; i++) {
                if (jaSorteados1[i] == clubes1[indice1]) {
                    existe = true;
                    break;
                }
                if (jaSorteados2[i] == clubes2[indice2]) {
                    existe = true;
                    break;
                }
            }
            console.log(jaSorteados1)
            console.log(jaSorteados2)

            if (!existe) {
                const foto1 = `<img src="${clubes1[indice1].foto}" alt="Escudo do clune ${clubes1[indice1].nome}" class="imgClube" style="width:100px; height:100px;">`;
                const foto2 = `<img src="${clubes2[indice2].foto}" alt="Escudo do clune ${clubes2[indice2].nome}" class="imgClube" style="width:100px; height:100px;">`;
                jogos += foto1 + ' x ' + foto2 + '<br>';
                jaSorteados1.push(indice1);
                jaSorteados2.push(indice2);
            }



        }

        hjogos.innerHTML = jogos;


    } else {
        alert("O número de clubes deve ser par!")
    }



});

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// adiciona um "ouvinte" de evento para o click na tabela
tbClubes.addEventListener("click", async(e) => {
    if (e.target.classList.contains("fa-trash-alt")) {
        const nome = e.target.parentElement.parentElement.children[1].innerText;
        if (confirm(`Confirma exclusão do clube "${nome}"?`)) {
            const id = e.target.parentElement.parentElement.children[0].innerText;

            const response = await fetch(url + id, {
                method: "delete",
            });

            if (response.status == 200) {
                e.target.parentElement.parentElement.remove(); // remove a linha do ícone clicado
            } else {
                const erro = await response.json();
                alert(`Erro: ${erro.msg}`);
            }
        }
    } else if (e.target.classList.contains("fa-edit")) {
        const nome = e.target.parentElement.parentElement.children[1].innerText;
        const novoTecnico = prompt(`Qual é o novo treinador do "${nome}"?`);
        alert(novoTecnico)
        if (novoTecnico == "") {
            alert("Nome Inválido.");
            return;
        }

        const id = e.target.parentElement.parentElement.children[0].innerText;

        const response = await fetch(url + id, {
            method: "put",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ treinador: novoTecnico }),
        });

        if (response.status == 200) {
            e.target.parentElement.parentElement.children[3].innerText = novoTecnico.toLocaleString(
                "pt-br", { minimumFractionDigits: 2 }
            );
        } else {
            const erro = await response.json();
            alert(`Erro: ${erro.msg}`);
        }
    }
});
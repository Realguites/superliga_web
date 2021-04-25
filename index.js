const frm = document.querySelector("form");
const divAlert = document.querySelector(".alert");

frm.addEventListener("submit", async(e) => {
    e.preventDefault(); // evita que o form seja enviado automaticamente

    const url = "http://localhost:3000/clubes";

    const formData = new FormData();

    formData.append("nome", frm.nome.value);
    formData.append("treinador", frm.treinador.value);
    formData.append("pote", frm.pote.value);
    formData.append("cidade", frm.cidade.value);
    formData.append("foto", frm.foto.files[0]);

    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });
    const dados = await response.json();

    if (response.status == 201) {
        divAlert.className = "alert alert-success mt-3";
        divAlert.innerText = `Ok! clube ${frm.nome.value} cadastrado com sucesso. Código: ${dados.id}`;
    } else {
        divAlert.className = "alert alert-danger mt-3";
        divAlert.innerText = `Erro: ${dados.msg}`;
    }
    frm.reset();
    frm.nome.focus();
});

// blur: ocorre quando o campo perde o foco
frm.nome.addEventListener("blur", () => {
    divAlert.className = "alert";
    divAlert.innerText = "";
});
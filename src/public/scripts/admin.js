import { goTo } from "./app.js";

export function renderAdmin() {
    const root = document.getElementById("root");
    
    root.innerHTML = `
        <h2>Área Administrativa</h2>
        <button id="voltar-btn">Voltar</button>
        <form id="nova-atividade">
            <input type="text" id="nome" placeholder="Nome da Atividade" required>
            <input type="text" id="descricao" placeholder="Descrição" required>
            <input type="date" id="data" required>
            <input type="text" id="local" placeholder="Local" required>
            <input type="number" id="vagas" placeholder="Número de vagas" required>
            <button type="submit">Criar Atividade</button>
        </form>
    `;

    document.getElementById("voltar-btn").addEventListener("click", () => goTo("atividades"));

    document.getElementById("nova-atividade").addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = document.getElementById("nome").value;
        const descricao = document.getElementById("descricao").value;
        const data = document.getElementById("data").value;
        const local = document.getElementById("local").value;
        const vagas = document.getElementById("vagas").value;

        fetch("http://localhost:3000/atividades", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ nome, descricao, data, local, vagas })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(JSON.stringify(err)); });
            }
            return response.json();
        })
        .then(data => {
            console.log("Resposta do servidor:", data);
            goTo("atividades");
        })
        .catch(error => console.error("Erro na requisição:", error));
    });
}
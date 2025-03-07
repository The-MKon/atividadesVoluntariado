import { goTo } from "./app.js";

export function renderAtividades() {
    const root = document.getElementById("root");
    root.innerHTML = "<h2>Carregando atividades...</h2>";

    // Buscar todas as atividades
    fetch("http://localhost:3000/atividades", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => res.json())
    .then(atividades => {
        // Verificar se é um usuário admin ou comum
        if (localStorage.getItem("userType") === "admin") {
            // Administradores podem ver as inscrições também
            fetch("http://localhost:3000/atividades/inscritas", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then(res => {
                if (!res.ok) {
                    console.error("Erro ao buscar inscrições", res);
                    return res.json();
                }
                return res.json();
            })
            .then(inscricoes => renderAtividadesComInscricoes(atividades, inscricoes, true))
            .catch(error => console.error("Erro ao buscar inscrições:", error));
        } else {
            // Para usuários comuns, apenas as atividades sem as inscrições
            renderAtividadesComInscricoes(atividades, [], false);
        }
    })
    .catch(error => console.error("Erro ao buscar atividades:", error));
}

// Função para renderizar as atividades e verificar as inscrições
function renderAtividadesComInscricoes(atividades, inscricoes, isAdmin) {
    const root = document.getElementById("root");

    // Garantir que inscricoes seja um array
    inscricoes = Array.isArray(inscricoes) ? inscricoes : [];

    let ativ = `
        <h2>Atividades</h2>
        <button id="logout-btn">Sair</button>
    `;

    // Para cada atividade, verificar se o usuário está inscrito
    atividades.forEach(atividade => {
        const jaInscrito = inscricoes.some(inscricao => inscricao.id === atividade.id);

        ativ += `
            <div>
                <h3>${atividade.nome}</h3>
                <p>${atividade.descricao}</p>
                <p>Data: ${atividade.data}</p>
                <p>Local: ${atividade.local}</p>
                <p>Vagas: ${atividade.vagas}</p>
                <button class="inscricao-btn" data-id="${atividade.id}" data-inscrito="${jaInscrito}">
                    ${jaInscrito ? "Cancelar inscrição" : "Inscrever-se"}
                </button>
        `;

        // Se for admin, mostrar botão para editar ou excluir a atividade
        if (isAdmin) {
            ativ += `
                <button class="edit-btn" data-id="${atividade.id}">Editar</button>
                <button class="delete-btn" data-id="${atividade.id}">Excluir</button>
            `;
        }

        ativ += `</div>`;
    });

    root.innerHTML = ativ;

    // Mostrar botão de admin se for um admin
    if (localStorage.getItem("userType") === "admin") {
        const adminBtn = document.createElement("button");
        adminBtn.textContent = "Área Admin";
        adminBtn.addEventListener("click", () => goTo("admin"));
        root.appendChild(adminBtn);
    }

    // Logout
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        goTo("login");
    });

    // Adicionar eventos para inscrição ou cancelamento
    document.querySelectorAll(".inscricao-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const atividadeId = btn.getAttribute("data-id");
            const jaInscrito = btn.getAttribute("data-inscrito") === "true";
            const metodo = jaInscrito ? "cancelar" : "inscrever"; // Alternar entre inscrever e cancelar

            fetch(`http://localhost:3000/atividades/${atividadeId}/${metodo}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}` 
                }
            })
            .then(() => goTo("atividades")) // Recarregar a página
            .catch(error => console.error("Erro na inscrição:", error));
        });
    });

    // Administrador pode editar ou excluir a atividade
    if (isAdmin) {
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const atividadeId = btn.getAttribute("data-id");
                // Redireciona para a página de edição
                goTo(`editar-atividade/${atividadeId}`);
            });
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const atividadeId = btn.getAttribute("data-id");
                if (confirm("Tem certeza que deseja excluir esta atividade?")) {
                    fetch(`http://localhost:3000/atividades/${atividadeId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                    .then(() => goTo("atividades")) // Redireciona após excluir
                    .catch(error => console.error("Erro ao excluir atividade:", error));
                }
            });
        });
    }
}
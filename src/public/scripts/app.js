import { renderAtividades } from "./atividades.js";
import { renderAdmin } from "./admin.js";

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("token")) {
        goTo("atividades");
    } else {
        renderLogin();
    }
});

export function goTo(page) {
    const root = document.getElementById("root");
    root.innerHTML = "";

    switch(page) {
        case "atividades":
            fetch("http://localhost:3000/atividades", { 
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } 
            })
            .then(res => res.json())
            .then(atividades => renderAtividades(atividades))
            .catch(error => console.error("Erro ao buscar atividades:", error));
            break;
        case "admin":
            renderAdmin();
            break;
        default:
            renderLogin();
    }
}

function renderLogin() {
    const root = document.getElementById("root");
    root.innerHTML = `
        <h2>Login</h2>
        <form id="login-form">
            <label for="email">E-mail:</label>
            <input type="email" id="email" required>
            
            <label for="password">Senha:</label>
            <input type="password" id="password" required>
            
            <button type="submit">Entrar</button>
        </form>

        <p>Não tem uma conta? <a href="#" id="show-register">Cadastre-se</a></p>
    `;

    document.getElementById("login-form").addEventListener("submit", handleLogin);
    document.getElementById("show-register").addEventListener("click", renderRegister);
}

function renderRegister() {
    const root = document.getElementById("root");
    root.innerHTML = `
        <h2>Cadastro</h2>
        <form id="register-form">
            <label for="email">E-mail:</label>
            <input type="email" id="email" required>

            <label for="password">Senha:</label>
            <input type="password" id="password" required>
            
            <button type="submit">Cadastrar</button>
        </form>

        <p>Já tem uma conta? <a href="#" id="show-login">Faça login</a></p>
    `;

    document.getElementById("register-form").addEventListener("submit", handleRegister);
    document.getElementById("show-login").addEventListener("click", renderLogin);
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
            localStorage.setItem("userType", decodedToken.tipo);

            if (data.tipo === "admin") {
                goTo("admin");
            } else {
                goTo("atividades");
            }
        } else {
            alert(data.message || "Erro ao fazer login");
        }
    })
    .catch(() => alert("Erro ao conectar com o servidor"));
}

function handleRegister(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Usuário registrado com sucesso") {
            alert("Cadastro realizado! Faça login.");
            renderLogin();
        } else {
            alert(data.message || "Erro ao cadastrar");
        }
    })
    .catch(() => alert("Erro ao conectar com o servidor"));
}
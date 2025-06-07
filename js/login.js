function login() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    if (usuario === "admin" && senha === "admin123") {
        window.location.href = "dashboard.html";
    } else if (usuario === "vendedor" && senha === "vend123") {
        window.location.href = "dashboard.html";
    } else {
        mostrarModal();
    }

    return false; // impede envio do formulário
}

function mostrarModal() {
    document.getElementById("modalErro").style.display = "block";
}

function fecharModal() {
    document.getElementById("modalErro").style.display = "none";
}

// Fecha o modal se clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById("modalErro");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

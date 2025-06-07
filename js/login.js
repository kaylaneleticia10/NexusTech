document.addEventListener('DOMContentLoaded', function() {
const form = document.getElementById('loginForm');
const modal = document.getElementById('modalErro');
const closeBtn = document.querySelector('.close');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();

    const usuarios = {
        admin: 'admin123',
        vendedor: 'vend123'
    };

    if (usuarios[usuario] && usuarios[usuario] === senha) {
        window.location.href = 'dashboard.html';
    } else {
        // Mostra o modal
        modal.style.display = 'block';
        // Limpa a senha
        document.getElementById('senha').value = '';

        // Fecha automaticamente após 3 segundos
        setTimeout(() => {
            modal.style.display = 'none';
        }, 3000);
    }
});

    // Fechar modal ao clicar no X
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Opcional: fecha ao clicar fora do modal
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});
const registerModal = document.getElementById("registerModal");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const registerLink = document.getElementById("registerLink");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const closeButtons = document.getElementsByClassName("close");
const passwordInput = document.getElementById("newPassword");
const passwordStrength = document.getElementById("passwordStrength");
const confirmPasswordInput = document.getElementById("confirmPassword");

// Exibir modal de registro
registerLink.onclick = function() {
    registerModal.style.display = "block";
}

// Exibir modal de recuperação de senha
forgotPasswordLink.onclick = function() {
    forgotPasswordModal.style.display = "block";
}

// Fechar modais
Array.from(closeButtons).forEach(function(closeButton) {
    closeButton.onclick = function() {
        registerModal.style.display = "none";
        forgotPasswordModal.style.display = "none";
    }
});

// Fechar modais ao clicar fora
window.onclick = function(event) {
    if (event.target == registerModal) {
        registerModal.style.display = "none";
    }
    if (event.target == forgotPasswordModal) {
        forgotPasswordModal.style.display = "none";
    }
}

// Verificação da força da senha
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[\W]+/)) strength++; // Verifica caracteres especiais

    if (strength < 2) {
        passwordStrength.textContent = 'Fraca';
        passwordStrength.className = 'weak';
    } else if (strength == 2) {
        passwordStrength.textContent = 'Média';
        passwordStrength.className = 'medium';
    } else {
        passwordStrength.textContent = 'Forte';
        passwordStrength.className = 'strong';
    }
}

// Atualizar a força da senha enquanto o usuário digita
passwordInput.addEventListener('input', function() {
    checkPasswordStrength(passwordInput.value);
});

// Verificar correspondência de senhas
confirmPasswordInput.addEventListener('input', function() {
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity("Senhas não correspondem");
    } else {
        confirmPasswordInput.setCustomValidity("");
    }
});

// Função para enviar o email usando o SendGrid
async function sendEmail(toEmail, subject, body) {
    const response = await fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            to: toEmail,
            subject: subject,
            text: body
        })
    });

    if (!response.ok) {
        console.error('Erro ao enviar email:', response.statusText);
    }
}

// Envio do formulário de recuperação de senha
document.getElementById("forgotPasswordForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const recoveryEmail = document.getElementById("recoveryEmail").value;
    sendEmail(recoveryEmail, "Recuperação de senha", "Aqui está o link para redefinir sua senha.");
    alert("Link de recuperação enviado para o email informado.");
    forgotPasswordModal.style.display = "none";
});

// Envio do formulário de registro
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();
    if (passwordInput.value === confirmPasswordInput.value) {
        const email = document.getElementById("email").value;
        sendEmail(email, "Confirmação de Registro", "Seu registro foi concluído com sucesso.");
        alert("Registro realizado com sucesso!");
        registerModal.style.display = "none";
    } else {
        alert("As senhas não correspondem!");
    }
});

// Ações para abrir os modais
const registerModal = document.getElementById("registerModal");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const registerLink = document.getElementById("registerLink");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const closeButtons = document.getElementsByClassName("close");

registerLink.onclick = function() {
    registerModal.style.display = "block";
}

forgotPasswordLink.onclick = function() {
    forgotPasswordModal.style.display = "block";
}

Array.from(closeButtons).forEach(function(closeButton) {
    closeButton.onclick = function() {
        registerModal.style.display = "none";
        forgotPasswordModal.style.display = "none";
    }
});

window.onclick = function(event) {
    if (event.target == registerModal) {
        registerModal.style.display = "none";
    }
    if (event.target == forgotPasswordModal) {
        forgotPasswordModal.style.display = "none";
    }
}

// Validação de força da senha
const passwordInput = document.getElementById("newPassword");
const passwordStrength = document.getElementById("passwordStrength");

passwordInput.onkeyup = function() {
    const password = passwordInput.value;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) {
        passwordStrength.textContent = "Fraca";
        passwordStrength.className = "weak";
    } else if (strength === 2 || strength === 3) {
        passwordStrength.textContent = "Média";
        passwordStrength.className = "medium";
    } else {
        passwordStrength.textContent = "Forte";
        passwordStrength.className = "strong";
    }
}

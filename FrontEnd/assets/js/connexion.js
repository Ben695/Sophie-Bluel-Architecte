export const connexion = () =>{
    
    // Vérifiez si l'utilisateur est connecté
    const authToken = localStorage.getItem('authToken');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    const logoutButton = document.getElementById('logout-menu');
    const loginButton = document.getElementById('login-menu');

    // Fonction pour afficher le bouton "Login" et masquer le bouton "Logout"
    function showLoginButton() {
        if (loginButton) {
            loginButton.style.display = 'block';
        }
        if (logoutButton) {
            logoutButton.style.display = 'none';
        }
    }

    // Fonction pour afficher le bouton "Logout" et masquer le bouton "Login"
    function showLogoutButton() {
        if (loginButton) {
            loginButton.style.display = 'none';
        }
        if (logoutButton) {
            logoutButton.style.display = 'block';
        }
    }

    // Si l'utilisateur est connecté, affichez le bouton "Logout" et la section "edit"
    if (authToken && isLoggedIn === 'true') {
        showLogoutButton();
        const editSection = document.getElementById('edit-mode');
        const editProjects = document.getElementById('edit');
        if (editSection) {
            editSection.style.display = 'flex';
        }
        if (editProjects) {
            editProjects.style.display = 'flex';
        }
    } else {
        // Sinon, affichez le bouton "Login" et masquez la section "edit"
        showLoginButton();
        const editSection = document.getElementById('edit-mode');
        const editProjects = document.getElementById('edit');
        if (editSection) {
            editSection.style.display = 'none';
        }
        if (editProjects) {
            editProjects.style.display = 'none';
        }
    }

    // Gérez la déconnexion de l'utilisateur lorsque le bouton "Logout" est cliqué
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Supprimez les informations d'authentification
            localStorage.removeItem('authToken');
            localStorage.removeItem('isLoggedIn');

            // Redirigez l'utilisateur vers la page de connexion
            window.location.href = 'login.html';
        });
    }

    // Vérifiez si nous sommes sur la page "login.html" et ajoutez des gestionnaires spécifiques si nécessaire
    if (window.location.pathname.endsWith('login.html')) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.querySelector('.error-message');
        const authUrl = 'http://localhost:5678/api/users/login';
        const closeButton = document.querySelector('.modal-close');
        const modalConnexion = document.getElementById('modal-connexion');

        // Fonction pour afficher la modal d'erreur
        function showErrorModal(message) {
            errorMessage.textContent = message;
            if (modalConnexion) {
                modalConnexion.style.display = 'block';
            }
        }

        // Fonction pour masquer la modal d'erreur
        function hideErrorModal() {
            if (modalConnexion) {
                modalConnexion.style.display = 'none';
            }
        }

        // Fonction pour effacer le champ de mot de passe
        function clearPasswordInput() {
            if (passwordInput) {
                passwordInput.value = '';
            }
        }

        // Ajoutez un écouteur d'événements sur le champ de l'e-mail pour vérifier le format lorsque l'utilisateur quitte le champ
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                const email = emailInput.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;

                if (!emailRegex.test(email)) {
                    showErrorModal('Adresse e-mail invalide. Veuillez saisir une adresse e-mail valide.');
                } else {
                    hideErrorModal();
                }
            });
        }

        const connexionButton = document.getElementById('connexion');
        if (connexionButton) {
            connexionButton.addEventListener('click', async () => {
                const email = emailInput.value;
                const password = passwordInput.value;

                try {
                    const response = await fetch(authUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('authToken', data.token);
                        localStorage.setItem('isLoggedIn', 'true');
                        window.location.href = 'index.html';
                    } else {
                        showErrorModal('Identifiants incorrects');
                        clearPasswordInput(); 
                    }
                } catch (error) {
                    console.error('Une erreur s\'est produite :', error);
                    showErrorModal('Une erreur s\'est produite. Veuillez réessayer.');
                    clearPasswordInput(); 
                }
            });
        }

        // Ajouter un écouteur d'événements pour fermer la modal d'erreur lorsque le bouton de fermeture est cliqué
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                hideErrorModal();
            });
        }

        // Ajouter un écouteur d'événements pour fermer la modal d'erreur lorsque l'utilisateur clique en dehors de la modal
        window.addEventListener('click', (event) => {
            if (modalConnexion && event.target === modalConnexion) {
                hideErrorModal();
            }
        });
    }
};
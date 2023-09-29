// Déclaration d'une fonction nommée "connexion"
export const connexion = () => {
    
    // Récupération du token d'authentification et du statut de connexion depuis le localStorage
    const authToken = localStorage.getItem('authToken');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    // Récupération des éléments boutons "Logout" et "Login" depuis le DOM
    const logoutButton = document.getElementById('logout-menu');
    const loginButton = document.getElementById('login-menu');

    // Déclaration d'une fonction pour afficher le bouton "Login" et masquer le bouton "Logout"
    function showLoginButton() {
        if (loginButton) {
            loginButton.style.display = 'block';
        }
        if (logoutButton) {
            logoutButton.style.display = 'none';
        }
    }

    // Déclaration d'une fonction pour afficher le bouton "Logout" et masquer le bouton "Login"
    function showLogoutButton() {
        if (loginButton) {
            loginButton.style.display = 'none';
        }
        if (logoutButton) {
            logoutButton.style.display = 'block';
        }
    }

    // Si l'utilisateur est connecté, affiche le bouton "Logout" et la section "edit"
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
        // Si l'utilisateur n'est pas connecté, affiche le bouton "Login" et masque la section "edit"
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

    // Ajout d'un écouteur d'événements pour gérer la déconnexion de l'utilisateur
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Suppression des informations d'authentification du localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('isLoggedIn');

            // Redirection de l'utilisateur vers la page de connexion
            window.location.href = 'login.html';
        });
    }

    // Vérification si nous sommes sur la page "login.html" pour ajouter des gestionnaires spécifiques
    if (window.location.pathname.endsWith('login.html')) {
        // Récupération des éléments du formulaire de connexion et de la modal d'erreur
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.querySelector('.error-message');
        const authUrl = 'http://localhost:5678/api/users/login';
        const closeButton = document.querySelector('.modal-close');
        const modalConnexion = document.getElementById('modal-connexion');

        // Déclaration d'une fonction pour afficher la modal d'erreur
        function showErrorModal(message) {
            errorMessage.textContent = message;
            if (modalConnexion) {
                modalConnexion.style.display = 'block';
            }
        }

        // Déclaration d'une fonction pour masquer la modal d'erreur
        function hideErrorModal() {
            if (modalConnexion) {
                modalConnexion.style.display = 'none';
            }
        }

        // Déclaration d'une fonction pour effacer le champ de mot de passe
        function clearPasswordInput() {
            if (passwordInput) {
                passwordInput.value = '';
            }
        }

        // Ajout d'un écouteur d'événements pour vérifier le format de l'email
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                const email = emailInput.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;

                // Si l'email est invalide, affiche la modal d'erreur
                if (!emailRegex.test(email)) {
                    showErrorModal('Adresse e-mail invalide. Veuillez saisir une adresse e-mail valide.');
                } else {
                    // Sinon, masque la modal d'erreur
                    hideErrorModal();
                }
            });
        }

        // Récupération du bouton de connexion et ajout d'un écouteur d'événements
        const connexionButton = document.getElementById('connexion');
        if (connexionButton) {
            connexionButton.addEventListener('click', async () => {
                const email = emailInput.value;
                const password = passwordInput.value;

                try {
                    // Tentative de connexion en envoyant une requête POST au serveur
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

                    // Si la connexion est réussie, stocke le token et redirige l'utilisateur
                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('authToken', data.token);
                        localStorage.setItem('isLoggedIn', 'true');
                        window.location.href = 'index.html';
                    } else {
                        // Si les identifiants sont incorrects, affiche une erreur et efface le mot de passe
                        showErrorModal('Identifiants incorrects');
                        clearPasswordInput(); 
                    }
                } catch (error) {
                    // En cas d'erreur réseau ou de serveur, affiche une erreur
                    console.error('Une erreur s\'est produite :', error);
                    showErrorModal('Une erreur s\'est produite. Veuillez réessayer.');
                    clearPasswordInput(); 
                }
            });
        }

        // Ajout d'écouteurs d'événements pour fermer la modal d'erreur
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                hideErrorModal();
            });
        }

        window.addEventListener('click', (event) => {
            if (modalConnexion && event.target === modalConnexion) {
                hideErrorModal();
            }
        });
    }
};

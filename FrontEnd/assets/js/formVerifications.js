export const formVerification = () => {
    
    // Fonction pour afficher la modale avec un message d'erreur
    function showModal(message) {
        var modal = document.getElementById('modal-form');
        var errorMessageElement = modal.querySelector('.error-form');
        
        errorMessageElement.textContent = message;
        modal.style.display = 'block';
    }
    
    // Fonction pour réinitialiser les champs du formulaire
    function clearForm() {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
    }
    
    // Fermeture de la modale
    document.querySelector('.modal-close').addEventListener('click', function() {
        document.getElementById('modal-form').style.display = 'none';
    });
    
    // Fermer la modale lors d'un clic à l'extérieur de .modal-content
    document.getElementById('modal-form').addEventListener('click', function(e) {
        if (e.target === e.currentTarget) {
            document.getElementById('modal-form').style.display = 'none';
        }
    });

    // Vérification de la soumission du formulaire
    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault(); // empêche la soumission par défaut du formulaire

        var name = document.getElementById('name').value.trim();
        var email = document.getElementById('email').value.trim();
        var message = document.getElementById('message').value.trim();

        if (!name) {
            showModal('Veuillez entrer votre nom.');
            return;
        }

        if (!email) {
            showModal('Veuillez entrer votre adresse email.');
            return;
        }

        if (!message) {
            showModal('Veuillez entrer votre message.');
            return;
        }

        // Si tout est bien rempli
        showModal('Merci! Votre formulaire a été soumis avec succès.'); 
        clearForm();
    });
}

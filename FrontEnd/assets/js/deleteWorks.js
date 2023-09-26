import { works } from "./loadWorks.js";

export const deleteWorks = async() =>{
    try{
        const galleryDiv = document.getElementById("gallery-remove");
        
        works.forEach(imageData => {
            const figure = document.createElement("figure");
            figure.setAttribute("data-id", imageData.id);
            console.log("ID du projet:", imageData.id);
            
            const img = document.createElement("img");
            img.src = imageData.imageUrl;
            img.alt = imageData.title;
            figure.appendChild(img);
            
            const deleteButton = document.createElement("button");
            deleteButton.className = "btn-delete";
            deleteButton.type = "submit";
            
            const trashIcon = document.createElement("i");
            trashIcon.className = "fa-solid fa-trash";
            trashIcon.style.color = "#ffffff";
            
            deleteButton.appendChild(trashIcon);
            figure.appendChild(deleteButton);
            galleryDiv.appendChild(figure);
            console.log('Bouton de suppression généré pour une image.');
        });
    }catch(error) {
        console.error("Erreur lors de la récupération des images de projets dans la modale de suppression:", error);
    };
    
    // Fonction pour supprimer un projet.
    function deleteProject(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const figureElement = event.target.closest('figure');
        const projectId = figureElement.getAttribute('data-id');
        const authToken = localStorage.getItem('authToken');
        console.log("Bouton de suppression cliqué");
        
        fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (response.ok) {
            figureElement.remove();
            console.log(`Projet ID ${projectId} supprimé avec succès.`);
        } else {
            throw new Error(`Erreur lors de la suppression du projet ID ${projectId}`);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la suppression du projet:", error);
    });
}

// Écouteur d'événements pour la suppression d'un projet.
document.getElementById('gallery-remove').addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-delete') || event.target.parentNode.classList.contains('btn-delete')) {
        deleteProject(event);
    }
});

};

// Modal d'édition ci-dessous
document.addEventListener('DOMContentLoaded', () => {
    // Sélectionnez l'élément avec l'id "edit"
    const editButton = document.getElementById('edit');
    
    // Sélectionnez la modal
    const modalEdit = document.getElementById('modal-edit');
    
    // Fonction pour afficher la modal
    function showModalEdit() {
        modalEdit.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Empêche le défilement de la page sous la modal
    }
    
    // Fonction pour masquer la modal
    function hideModalEdit() {
        modalEdit.style.display = 'none';
        document.body.style.overflow = 'auto'; // Réactive le défilement de la page
    }
    
    // Gérez l'ouverture de la modal lors du clic sur le bouton "Edit"
    if (editButton && modalEdit) {
        editButton.addEventListener('click', () => {
            showModalEdit();
        });
    }
    
    // Gérez la fermeture de la modal lorsque la croix est cliquée
    const closeButtonEdit = document.getElementById('modal-close-edit');
    if (closeButtonEdit) {
        closeButtonEdit.addEventListener('click', () => {
            hideModalEdit();
        });
    }
    
    // Gérez la fermeture de la modal lorsque l'utilisateur clique en dehors de la modal
    window.addEventListener('click', (event) => {
        if (modalEdit && event.target === modalEdit) {
            hideModalEdit();
        }
    });
    // Fonction pour afficher la modale d'ajout de photo
    function showModalAddPhoto() {
        hideModalEdit(); // masquez la modale d'édition pour éviter la superposition
        document.getElementById('modal-add-photo').style.display = 'block';
        document.body.style.overflow = 'hidden'; // Empêche le défilement de la page sous la modal
    }
    
    // Fonction pour masquer la modale d'ajout de photo
    function hideModalAddPhoto() {
        document.getElementById('modal-add-photo').style.display = 'none';
        document.body.style.overflow = 'auto'; // Réactive le défilement de la page
    }
    document.getElementById('btn-addProjects').addEventListener('click', function() {
        showModalAddPhoto();
    });    
    document.getElementById('modal-close-add-photo').addEventListener('click', function() {
        hideModalAddPhoto();
    });
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('modal-add-photo')) {
            hideModalAddPhoto();
        }
    });
    
});
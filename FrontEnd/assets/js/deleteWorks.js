import { works } from "./loadWorks.js";

const API_URL = import.meta.env.VITE_APP_BACK_URL+"/works/";

// Fonction pour afficher une modale
const showModal = (modalId) => {
    // Récupération de l'élément modal par son ID et modification de son style pour l'afficher
    document.getElementById(modalId).style.display = 'block';
    // Modification du style du body pour empêcher le défilement pendant que la modale est ouverte
    document.body.style.overflow = 'hidden';
};

// Fonction pour cacher une modale
const hideModal = (modalId) => {
    // Récupération de l'élément modal par son ID et modification de son style pour le cacher
    document.getElementById(modalId).style.display = 'none';
    // Rétablissement du style du body pour permettre le défilement
    document.body.style.overflow = 'auto';
};

async function deleteProject(event) {
    // Prévention du comportement par défaut du clic
    event.preventDefault();
    // Arrêt de la propagation de l'événement
    event.stopPropagation();
    
    // Récupération de l'élément figure le plus proche de l'élément cliqué
    const figureElement = event.target.closest('figure');
    if (!figureElement) {
        // Si l'élément figure n'est pas trouvé, log une erreur et sort de la fonction
        console.error("Élément figure non trouvé");
        return;
    }
    
    // Récupération de l'id du projet à partir de l'attribut 'data-id' de l'élément figure
    const projectId = figureElement.getAttribute('data-id');
    if (!projectId) {
        // Si l'id du projet n'est pas trouvé, log une erreur et sort de la fonction
        console.error("ID du projet non trouvé");
        return;
    }
    
    // Récupération du token d'authentification depuis le localStorage
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        // Si le token d'authentification n'est pas trouvé, log une erreur et sort de la fonction
        console.error("Token d'authentification non trouvé");
        return;
    }
    
    // Tentative de suppression du projet via l'API
    try {
        // Envoi d'une requête DELETE à l'API pour supprimer le projet
        const response = await fetch(`${API_URL}${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        // Si la réponse n'est pas OK, lance une erreur
        if (!response.ok) {
            throw new Error(`Erreur lors de la suppression du projet ID ${projectId}`);
        }
        
        // Log la réussite de la suppression
        console.log(`Projet ID ${projectId} supprimé avec succès de l'API.`);
        
    } catch (error) {
        // Log l'erreur si la suppression via l'API échoue
        console.error("Erreur lors de la suppression du projet via l'API:", error);
        return;
    }
    
    // Suppression de l'élément figure de la modale de suppression
    figureElement.remove();
    console.log(`Projet ID ${projectId} supprimé de la modale de suppression`);
    
    // Récupération de l'élément principal de la galerie
    const mainGallery = document.getElementById('gallery');
    if (!mainGallery) {
        // Si l'élément #gallery n'est pas trouvé, log une erreur et sort de la fonction
        console.error("Élément #gallery non trouvé");
        return;
    }
    
    // Recherche et suppression du projet dans la galerie principale
    const projectInGallery = mainGallery.querySelector(`figure[data-id='${projectId}']`);
    if (!projectInGallery) {
        // Si le projet n'est pas trouvé dans #gallery, log une erreur et sort de la fonction
        console.error(`Projet ID ${projectId} non trouvé dans #gallery`);
        return;
    }
    
    // Suppression du projet de la galerie principale
    projectInGallery.remove();
    console.log(`Projet ID ${projectId} supprimé de #gallery`);
}

// Fonction asynchrone pour supprimer plusieurs projets
export const deleteWorks = async () => {
    try {
        // Récupération de l'élément contenant la galerie de suppression
        const galleryDiv = document.getElementById("gallery-remove");
        
        // Pour chaque objet dans "works", création d'un élément figure avec une image et un bouton de suppression
        works.forEach(imageData => {
            const figure = document.createElement("figure");
            figure.setAttribute("data-id", imageData.id);
            
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
        });

        // Ajout d'un écouteur d'événements pour détecter les clics sur les boutons de suppression
        galleryDiv.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-delete') || event.target.parentNode.classList.contains('btn-delete')) {
                deleteProject(event);
            }
        });
    } catch (error) {
        // Log l'erreur si la récupération des images de projets dans la modale de suppression échoue
        console.error("Erreur lors de la récupération des images de projets dans la modale de suppression:", error);
        // Vous pouvez afficher un message d'erreur à l'utilisateur ici, si nécessaire
    }
};

// Ajout d'écouteurs d'événements pour gérer l'affichage et la fermeture des modales une fois que le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit');
    const modalEdit = document.getElementById('modal-edit');
    
    // Si les éléments editButton et modalEdit existent, ajout d'écouteurs d'événements pour gérer l'affichage et la fermeture de la modale d'édition
    if (editButton && modalEdit) {
        editButton.addEventListener('click', () => {
            showModal('modal-edit');
        });

        document.getElementById('modal-close-edit').addEventListener('click', () => {
            hideModal('modal-edit');
        });

        window.addEventListener('click', (event) => {
            if (event.target === modalEdit) {
                hideModal('modal-edit');
            }
        });
    }

    // Gestion de l'affichage des modales pour ajouter des projets
    const btnAddProjects = document.getElementById('btn-addProjects');
    if (btnAddProjects) {
        btnAddProjects.addEventListener('click', () => {
            hideModal('modal-edit');
            showModal('modal-add-photo');
        });
    }

    // Ajout d'écouteurs d'événements pour fermer la modale d'ajout de photo
    document.getElementById('modal-close-add-photo').addEventListener('click', () => {
        hideModal('modal-add-photo');
    });

    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('modal-add-photo')) {
            hideModal('modal-add-photo');
        }
    });
});

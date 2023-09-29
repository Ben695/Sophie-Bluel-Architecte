import { works } from "./loadWorks.js";

const API_URL = "http://localhost:5678/api/works/";

const showModal = (modalId) => {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
};

const hideModal = (modalId) => {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
};

async function deleteProject(event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Récupérer l'élément figure de l'élément cliqué
    const figureElement = event.target.closest('figure');
    if (!figureElement) {
        console.error("Élément figure non trouvé");
        return;
    }
    
    // Récupérer l'id du projet à partir de l'élément figure
    const projectId = figureElement.getAttribute('data-id');
    if (!projectId) {
        console.error("ID du projet non trouvé");
        return;
    }
    
    // Récupérer le token d'authentification
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        console.error("Token d'authentification non trouvé");
        return;
    }
    
    // Essayer de supprimer le projet via l'API
    try {
        const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erreur lors de la suppression du projet ID ${projectId}`);
        }
        
        console.log(`Projet ID ${projectId} supprimé avec succès de l'API.`);
        
    } catch (error) {
        console.error("Erreur lors de la suppression du projet via l'API:", error);
        return;
    }
    
    // Supprimer le projet de la modale de suppression
    figureElement.remove();
    console.log(`Projet ID ${projectId} supprimé de la modale de suppression`);
    
    // Supprimer également le projet de la galerie principale sur index.html
    const mainGallery = document.getElementById('gallery');
    if (!mainGallery) {
        console.error("Élément #gallery non trouvé");
        return;
    }
    
    const projectInGallery = mainGallery.querySelector(`figure[data-id='${projectId}']`);
    if (!projectInGallery) {
        console.error(`Projet ID ${projectId} non trouvé dans #gallery`);
        return;
    }
    
    projectInGallery.remove();
    console.log(`Projet ID ${projectId} supprimé de #gallery`);
}



export const deleteWorks = async () => {
    try {
        const galleryDiv = document.getElementById("gallery-remove");
        
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

        galleryDiv.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-delete') || event.target.parentNode.classList.contains('btn-delete')) {
                deleteProject(event);
            }
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des images de projets dans la modale de suppression:", error);
        // Affichez un message d'erreur à l'utilisateur ici, si nécessaire
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit');
    const modalEdit = document.getElementById('modal-edit');
    
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

    const btnAddProjects = document.getElementById('btn-addProjects');
    if (btnAddProjects) {
        btnAddProjects.addEventListener('click', () => {
            hideModal('modal-edit');
            showModal('modal-add-photo');
        });
    }

    document.getElementById('modal-close-add-photo').addEventListener('click', () => {
        hideModal('modal-add-photo');
    });

    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('modal-add-photo')) {
            hideModal('modal-add-photo');
        }
    });
});

import { works } from "./loadWorks.js";

export const displayWorks = () =>{
    
    const galleryDiv = document.getElementById("gallery");
    const filterDiv = document.querySelector(".filter");
    
    // Création d'un ensemble de catégories uniques à partir des données
    const categories = new Set(works.map(item => item.category.name));
    categories.add("Tous"); // Ajout de la catégorie "Tous" pour afficher toutes les œuvres
    
    // Inversion des catégories pour afficher dans le bon sens
    const reversedCategories = [...categories].reverse();
    
    // Génération des boutons de filtre en fonction des catégories
    reversedCategories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category;
        button.className = "btn-filter";
        filterDiv.appendChild(button);
    });
    
    // Sélection de tous les boutons de filtre
    const filterButtons = document.querySelectorAll(".btn-filter");
    
    // Gestionnaire pour le clic sur les boutons de filtre
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filterCategory = button.textContent; // Catégorie du bouton cliqué
            galleryDiv.innerHTML = ""; // Effacement du contenu actuel de la galerie
            
            // Parcours des données pour afficher les œuvres en fonction de la catégorie sélectionnée
            // Parcours des données pour afficher les œuvres en fonction de la catégorie sélectionnée
            works.forEach(item => {
                if (filterCategory === "Tous" || item.category.name === filterCategory) {
                    // Création des éléments HTML pour chaque œuvre
                    const figure = document.createElement("figure");
                    const img = document.createElement("img");
                    const figcaption = document.createElement("figcaption");
                    
                    // Attribution des attributs et du contenu aux éléments
                    img.src = item.imageUrl;
                    img.alt = item.title;
                    figcaption.textContent = item.title;
                    
                    // Ajout de l'attribut data-id à l'élément figure
                    figure.setAttribute("data-id", item.id);
                    
                    // Ajout des éléments à la structure HTML
                    figure.appendChild(img);
                    figure.appendChild(figcaption);
                    galleryDiv.appendChild(figure);
                }
            });
            
            
            // Gestion de la classe "active" pour les boutons de filtre
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });
    
    // Affichage de tous les éléments au chargement initial en simulant le clic sur le bouton "Tous"
    filterButtons[0].click();
}
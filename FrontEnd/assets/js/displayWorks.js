// Importation du tableau "works" depuis le fichier "loadWorks.js"
import { works } from "./loadWorks.js";

export const displayWorks = () => {
    const galleryDiv = document.getElementById("gallery");
    const filterDiv = document.querySelector(".filter");
    
    // Création d'un Set pour obtenir un ensemble de catégories uniques à partir des données dans "works"
    const categories = new Set(works.map(item => item.category.name));
    // Ajout de la catégorie "Tous" pour afficher toutes les œuvres
    categories.add("Tous");
    
    // Inversion de l'ordre des catégories pour les afficher dans le bon sens
    const reversedCategories = [...categories].reverse();
    
    // Génération des boutons de filtre pour chaque catégorie
    reversedCategories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category;
        button.className = "btn-filter";
        filterDiv.appendChild(button);
    });
    
    // Sélection de tous les boutons de filtre générés
    const filterButtons = document.querySelectorAll(".btn-filter");
    
    // Ajout d'un gestionnaire d'événements pour chaque bouton de filtre
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Récupération de la catégorie du bouton cliqué
            const filterCategory = button.textContent;
            // Effacement du contenu actuel de la galerie
            galleryDiv.innerHTML = "";
            
            // Parcours des données "works" pour afficher les œuvres correspondant à la catégorie sélectionnée
            works.forEach(item => {
                if (filterCategory === "Tous" || item.category.name === filterCategory) {
                    // Création des éléments HTML pour chaque œuvre
                    const figure = document.createElement("figure");
                    const img = document.createElement("img");
                    const figcaption = document.createElement("figcaption");
                    
                    // Attribution des attributs et du contenu aux éléments créés
                    img.src = item.imageUrl;
                    img.alt = item.title;
                    figcaption.textContent = item.title;
                    
                    // Ajout de l'attribut data-id à l'élément figure
                    figure.setAttribute("data-id", item.id);
                    
                    // Ajout des éléments créés à la structure HTML
                    figure.appendChild(img);
                    figure.appendChild(figcaption);
                    galleryDiv.appendChild(figure);
                }
            });
            
            // Gestion de la classe "active" pour les boutons de filtre
            // Retrait de la classe "active" de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove("active"));
            // Ajout de la classe "active" au bouton cliqué
            button.classList.add("active");
        });
    });
    
    // Simulation du clic sur le bouton "Tous" pour afficher tous les éléments au chargement initial
    filterButtons[0].click();
}

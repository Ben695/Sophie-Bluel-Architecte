import { works } from "./loadWorks.js";
import { initialAnimation, galleryImageAnimations } from "./AnimationGsap.js";

export const displayWorks = () => {
    const galleryDiv = document.getElementById("gallery");
    const filterDiv = document.querySelector(".filter");

    const categories = new Set(works.map(item => item.category.name));

    // Ajoute la catégorie "Tous" à l'ensemble de catégories
    categories.add("Tous");

    // Inverse l'ordre des catégories et stocke le résultat dans reversedCategories
    const reversedCategories = [...categories].reverse();

    // Pour chaque catégorie inversée, crée un bouton et l'ajoute à filterDiv
    reversedCategories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category;
        button.className = "btn-filter";
        filterDiv.appendChild(button);
    });

    // Sélectionne tous les boutons avec la classe "btn-filter" et les stocke dans filterButtons
    const filterButtons = document.querySelectorAll(".btn-filter");

    // Pour chaque bouton, ajoute un écouteur d'événements au clic
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Récupère la catégorie associée au bouton cliqué
            const filterCategory = button.textContent;

            // Vide la galerie (galleryDiv)
            galleryDiv.innerHTML = "";

            // Parcourt toutes les œuvres
            works.forEach(item => {
                // Si la catégorie de l'œuvre correspond à la catégorie sélectionnée ou si "Tous" est sélectionné,
                // crée un élément HTML pour afficher l'œuvre dans la galerie
                if (filterCategory === "Tous" || item.category.name === filterCategory) {
                    const figure = document.createElement("figure");
                    const img = document.createElement("img");
                    const figcaption = document.createElement("figcaption");

                    // Configure l'image et le texte
                    img.src = item.imageUrl;
                    img.alt = item.title;
                    figcaption.textContent = item.title;

                    // Attribue un attribut "data-id" à la figure pour identifier l'œuvre
                    figure.setAttribute("data-id", item.id);

                    // Ajoute l'image et le texte à la figure, puis ajoute la figure à la galerie
                    figure.appendChild(img);
                    figure.appendChild(figcaption);
                    galleryDiv.appendChild(figure);
                }
            });
            galleryImageAnimations();

            // Retire la classe "active" de tous les boutons de filtre
            filterButtons.forEach(btn => btn.classList.remove("active"));

            // Ajoute la classe "active" au bouton actuellement cliqué
            button.classList.add("active");
        });
    });

    // Clique sur le premier bouton de filtre pour afficher les œuvres au chargement de la page
    filterButtons[0].click();
}

// Appelle la fonction initialAnimation depuis le fichier AnimationGsap.js
initialAnimation();

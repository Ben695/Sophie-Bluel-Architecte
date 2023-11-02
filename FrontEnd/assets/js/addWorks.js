export const addWorks = async () => {
    let titrePhotos = document.getElementById("titrePhotos"); 
    let optionsList = document.getElementById("optionsList"); 
    let validAddPhotos = document.getElementById("valid-addPhotos");
    let addPhotosElement = document.getElementById("addPhotos");
    let addPhotosButton = addPhotosElement.querySelector(".btn-addPhotos");
    let txtAddPhotos = addPhotosElement.querySelector(".txt-addPhotos");
    
    function checkFormCompletion() {
        console.log("Vérification de la complétion du formulaire...");
        console.log("Valeur du titre:", titrePhotos.value.trim());
        console.log("Option sélectionnée:", getSelectedOption());
        
        // Sélection et log de l'input d'image
        const imageInput = document.getElementById('imageInput');
        console.log("Image input ----------", imageInput);
        if (!imageInput) {
            console.error("Element #imageInput not found");
            return; // Sortir de la fonction si imageInput n'est pas trouvé
        }
        
        // Vérification de la complétion du formulaire et activation/désactivation du bouton en conséquence
        const imageFile = imageInput.files[0];
        if (titrePhotos.value.trim() !== "" && getSelectedOption() !== null && imageFile) {
            validAddPhotos.removeAttribute("disabled");
            console.log("Le formulaire est complet, activation du bouton.");
        } else {
            validAddPhotos.setAttribute("disabled", true);
            console.log("Le formulaire n'est pas encore complet...");
        }
    }
    
    // Fonction pour afficher/masquer la liste d'options
    function toggleOptions() {
        console.log("Toggling optionsList display...");
        if (optionsList.style.display === "none" || optionsList.style.display === "") {
            optionsList.style.display = "block";
            console.log("Displaying optionsList");
        } else {
            optionsList.style.display = "none";
            console.log("Hiding optionsList");
        }
    }
    
    // Variable pour stocker l'option sélectionnée
    let selectedOption = null;
    
    // Fonction pour choisir une option et mettre à jour l'UI en conséquence
    function chooseOption(element) {
        var selector = document.querySelector(".selector");
        selector.textContent = element.textContent; // Mettez à jour le texte du sélecteur
        
        // Mise à jour de l'option sélectionnée et mise à jour de l'UI
        selectedOption = element;
        document.querySelectorAll(".option").forEach(option => {
            option.classList.remove("selected");
        });
        element.classList.add("selected");
        console.log("Option choisie:", element.textContent);
        
        // Masquer la liste d'options et ajouter une icône au sélecteur
        optionsList.style.display = "none";
        var icon = document.createElement("i");
        icon.className = "fa-solid fa-chevron-up";
        icon.style.color = "#6c6c6c";
        selector.appendChild(icon); // Ajoutez l'icône au sélecteur
    }
    
    // Fonction pour obtenir l'option actuellement sélectionnée
    function getSelectedOption() {
        return selectedOption;
    }
    
    // Fonction asynchrone pour charger les catégories depuis l'API et les ajouter à la liste d'options
    async function loadCategoriesFromAPI() {
        console.log("Loading categories from API...");
        const url = import.meta.env.VITE_APP_BACK_URL+"/categories";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error("Failed to fetch categories:", response.statusText);
                return;
            }
            const works = await response.json();
            console.log("Categories loaded:", works);
            
            // Suppression des options existantes et ajout des nouvelles
            while (optionsList.firstChild) {
                optionsList.removeChild(optionsList.firstChild);
            }
            works.forEach(category => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                optionDiv.textContent = category.name;
                optionDiv.dataset.id = category.id;
                
                // Ajoutez un écouteur d'événements à chaque option
                optionDiv.addEventListener('click', function() {
                    chooseOption(optionDiv);
                    checkFormCompletion(); // Vérifiez la complétion du formulaire après avoir choisi une option
                });
                
                optionsList.appendChild(optionDiv);
                console.log("Option added:", category.name);
            });
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    }

    let validWorkElement = document.querySelector(".valid-work");
    let errorWorkElement = document.querySelector(".error-work");

    // Fonctions pour afficher les messages de succès et d'erreur
    function showSuccessMessage(message) {
        validWorkElement.textContent = message;
        errorWorkElement.textContent = ''; // Effacer le message d'erreur précédent si existant
    }
    function showErrorMessage(message) {
        errorWorkElement.textContent = message;
        validWorkElement.textContent = ''; // Effacer le message de succès précédent si existant
    }

    // Écouteur d'événements pour fermer la modale
    document.querySelector(".modal-close").addEventListener("click", function() {
        document.getElementById("modal-form").style.display = "none";
    });

    // Fonction asynchrone pour ajouter une œuvre à l'API
    async function addWorkToAPI(title, imageFile, categoryId) {
        console.log("Début de la fonction addWorkToAPI");
        const url = import.meta.env.VITE_APP_BACK_URL+"/works";
        const authToken = localStorage.getItem('authToken');

        // Création du FormData avec les informations de l'œuvre
        let formData = new FormData();
        formData.append("image", imageFile);
        formData.append("title", title);
        formData.append("category", categoryId);

        // Tentative d'ajout de l'œuvre à l'API et gestion des réponses/erreurs
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });

            switch(response.status) {
                case 201:
                    console.log("Work ajouté avec succès");
                    showSuccessMessage("Work ajouté avec succès");
                    return await response.json();
                case 400:
                    const errorMsg = await response.text();
                    showErrorMessage("Erreur 400: " + errorMsg);
                    throw new Error("Erreur 400: " + errorMsg);
                case 401:
                    window.location.href = "login.html";
                    break;
                case 500:
                    showErrorMessage("Erreur 500: Le serveur est cassé");
                    throw new Error("Erreur 500: Le serveur est cassé");
                default:
                    const errorText = await response.text();
                    showErrorMessage("Erreur " + response.status + ": " + errorText);
                    throw new Error("Réponse non réussie de l'API, statut: " + response.status);
            }
        } catch (error) {
            console.error("Erreur lors de l'appel de l'API", error);
            showErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
            throw error;
        }
    }
    
    // Ajout d'écouteurs d'événements pour vérifier la complétion du formulaire
    titrePhotos.addEventListener("input", checkFormCompletion);
    optionsList.addEventListener("click", checkFormCompletion);
    
    // Écouteur d'événements pour ouvrir le sélecteur de fichiers
    document.getElementById('addPhotos').addEventListener('click', function () {
        document.getElementById('imageInput').click();
    });
    
    // Écouteur d'événements pour afficher/masquer la liste d'options
    document.getElementById('toggleOptionsElement').addEventListener('click', toggleOptions);
    
    // Initialisation de la liste d'options et chargement des catégories depuis l'API
    optionsList.style.display = "none";
    await loadCategoriesFromAPI();
    
    // Écouteur d'événements pour la prévisualisation de l'image sélectionnée
document.getElementById('btn-addProjects').addEventListener('click', function() {
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function (e) {
                    // Masquer le bouton et le texte d'ajout de photos
                    addPhotosButton.style.zIndex = "-1";
                    txtAddPhotos.style.zIndex = "-1";
                    
                    // Afficher l'image sélectionnée
                    const img = new Image();
                    img.src = e.target.result;
                    img.style.zIndex = "1";
                    addPhotosElement.appendChild(img);
                    
                    // Désactiver l'input pour empêcher l'ajout d'une autre image
                    imageInput.setAttribute("disabled", true);
                }
                
                // Lecture de l'image sélectionnée en tant que DataURL
                reader.readAsDataURL(file);
            }
        });
    } else {
        console.error("Element #imageInput not found");
    }
});

    
    // Écouteur d'événements pour le bouton de validation d'ajout de photos
    validAddPhotos.addEventListener("click", async () => {
        // Récupérer les valeurs du formulaire
        const title = titrePhotos.value.trim();
        const categoryId = getSelectedOption().dataset.id;
        const imageFile = document.getElementById('imageInput').files[0];
        
        // Appeler la fonction pour ajouter l'œuvre à l'API
        try {
            const result = await addWorkToAPI(title, imageFile, categoryId);
            console.log("Œuvre ajoutée avec succès:", result);
            AddImageModal(result);
            AddProjectToGallery(result);
            
            // Réinitialiser le formulaire
            titrePhotos.value = '';
            document.querySelectorAll(".option").forEach(option => {
                option.classList.remove("selected");
            });
            document.querySelector(".selector").textContent = '';
            if (addPhotosElement.querySelector('img')) {
                addPhotosElement.removeChild(addPhotosElement.querySelector('img'));
            }
            addPhotosButton.style.zIndex = "1";
            txtAddPhotos.style.zIndex = "1";
            validAddPhotos.setAttribute("disabled", true);
            
            // Supprimer le message de succès après 3 secondes
            setTimeout(() => {
                showSuccessMessage('');
            }, 4000);
            
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'œuvre:", error);
        }
    });
    
    
    // Fonction pour ajouter l'image à la modale d'ajout
    const AddImageModal = (imageData) => {
        try {
            const galleryDiv = document.getElementById("gallery-remove"); // Assurez-vous d'utiliser l'ID correct de la modale d'ajout
            
            // Création des éléments pour afficher l'image dans la modale
            const figure = document.createElement("figure");
            figure.setAttribute("data-id", imageData.id);
            
            const img = document.createElement("img");
            img.src = imageData.imageUrl;
            img.alt = imageData.title;
            figure.appendChild(img);
            
            // Ajout d'un bouton de suppression à l'image
            const deleteButton = document.createElement("button");
            deleteButton.className = "btn-delete";
            deleteButton.type = "submit";
            
            const trashIcon = document.createElement("i");
            trashIcon.className = "fa-solid fa-trash";
            trashIcon.style.color = "#ffffff";
            
            deleteButton.appendChild(trashIcon);
            figure.appendChild(deleteButton);
            
            // Ajout de l'image à la modale
            galleryDiv.appendChild(figure);
            console.log('Image ajoutée à la modale d’ajout.');
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'image à la modale:", error);
        }
    };
    
    // Fonction pour ajouter le projet à la galerie
    const AddProjectToGallery = (projectData) => {
        try {
            const galleryDiv = document.getElementById("gallery"); 
            // Création des éléments pour afficher le projet dans la galerie
            const figure = document.createElement("figure");
            figure.setAttribute("data-id", projectData.id);
            const img = document.createElement("img");
            img.src = projectData.imageUrl;
            img.alt = projectData.title;
            figure.appendChild(img);
            
            const figcaption = document.createElement("figcaption");
            figcaption.textContent = projectData.title;
            figure.appendChild(figcaption);
            
            // Ajout du projet à la galerie
            galleryDiv.appendChild(figure);
            console.log('Projet ajouté à la galerie.');
        } catch (error) {
            console.error("Erreur lors de l'ajout du projet à la galerie:", error);
        }
    };
    
    // Sélection de l'icône pour fermer la modale et des modales
    const closeModalIcon = document.querySelector('.close-modal-addProjects');
    const modalAddPhoto = document.getElementById('modal-add-photo');
    const modalEdit = document.getElementById('modal-edit');
    
    // Vérification que les éléments ont bien été sélectionnés
    if (closeModalIcon && modalAddPhoto && modalEdit) {
        // Ajout d'un écouteur d'événements à l'icône pour fermer la modale actuelle et ouvrir la précédente
        closeModalIcon.addEventListener('click', () => {
            modalAddPhoto.style.display = 'none';
            modalEdit.style.display = 'block';
        });
    } else {
        console.error('Un ou plusieurs éléments n\'ont pas été trouvés');
    }
}

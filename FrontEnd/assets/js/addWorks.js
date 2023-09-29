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
        
        const imageInput = document.getElementById('imageInput');
        console.log("Image input ----------", imageInput);
        if (!imageInput) {
            console.error("Element #imageInput not found");
            return; // Sortir de la fonction si imageInput n'est pas trouvé
        }
        
        const imageFile = imageInput.files[0];
        if (titrePhotos.value.trim() !== "" && getSelectedOption() !== null && imageFile) {
            validAddPhotos.removeAttribute("disabled");
            console.log("Le formulaire est complet, activation du bouton.");
        } else {
            validAddPhotos.setAttribute("disabled", true);
            console.log("Le formulaire n'est pas encore complet...");
        }
    }
    
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
    
    let selectedOption = null;
    
    function chooseOption(element) {
        var selector = document.querySelector(".selector");
        selector.textContent = element.textContent; // Mettez à jour le texte du sélecteur
        
        selectedOption = element;
        
        document.querySelectorAll(".option").forEach(option => {
            option.classList.remove("selected");
        });
        
        element.classList.add("selected");
        console.log("Option choisie:", element.textContent);
        
        optionsList.style.display = "none";
        
        var icon = document.createElement("i");
        icon.className = "fa-solid fa-chevron-up";
        icon.style.color = "#6c6c6c";
        selector.appendChild(icon); // Ajoutez l'icône au sélecteur
    }
    
    
    function getSelectedOption() {
        return selectedOption;
    }
    
    async function loadCategoriesFromAPI() {
        console.log("Loading categories from API...");
        const url = "http://localhost:5678/api/categories";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error("Failed to fetch categories:", response.statusText);
                return;
            }
            const works = await response.json();
            console.log("Categories loaded:", works);
            
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

    function showSuccessMessage(message) {
        validWorkElement.textContent = message;
        errorWorkElement.textContent = ''; // Effacer le message d'erreur précédent si existant
    }

    function showErrorMessage(message) {
        errorWorkElement.textContent = message;
        validWorkElement.textContent = ''; // Effacer le message de succès précédent si existant
    }

    document.querySelector(".modal-close").addEventListener("click", function() {
        document.getElementById("modal-form").style.display = "none";
    });

    async function addWorkToAPI(title, imageFile, categoryId) {
        console.log("Début de la fonction addWorkToAPI");
        const url = "http://localhost:5678/api/works";
        const authToken = localStorage.getItem('authToken');

        let formData = new FormData();
        formData.append("image", imageFile);
        formData.append("title", title);
        formData.append("category", categoryId);

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
    
    titrePhotos.addEventListener("input", checkFormCompletion);
    optionsList.addEventListener("click", checkFormCompletion);
    
    document.getElementById('addPhotos').addEventListener('click', function () {
        document.getElementById('imageInput').click();
    });
    
    document.getElementById('toggleOptionsElement').addEventListener('click', toggleOptions);
    
    optionsList.style.display = "none";
    await loadCategoriesFromAPI();
    
    document.getElementById('btn-addProjects').addEventListener('click', function() {
        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
            imageInput.addEventListener('change', function (event) {
                const file = event.target.files[0];
                
                if (file) {
                    const reader = new FileReader();
                    
                    reader.onload = function (e) {
                        addPhotosButton.style.zIndex = "-1";
                        txtAddPhotos.style.zIndex = "-1";
                        
                        const img = new Image();
                        img.src = e.target.result;
                        img.style.zIndex = "1";
                        addPhotosElement.appendChild(img);
                    }
                    
                    reader.readAsDataURL(file);
                }
            });
        } else {
            console.error("Element #imageInput not found");
        }
    });
    
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
            // Ici, vous pouvez ajouter du code pour réinitialiser le formulaire ou rediriger l'utilisateur
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'œuvre:", error);
        }
    });
    
    const AddImageModal = (imageData) => {
        try {
            const galleryDiv = document.getElementById("gallery-remove"); // Assurez-vous d'utiliser l'ID correct de la modale d'ajout
            
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
            console.log('Image ajoutée à la modale d’ajout.');
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'image à la modale:", error);
        }
    };
    
    const AddProjectToGallery = (projectData) => {
        try {
            const galleryDiv = document.getElementById("gallery"); 
            const figure = document.createElement("figure");
            figure.setAttribute("data-id", projectData.id);
            const img = document.createElement("img");
            img.src = projectData.imageUrl;
            img.alt = projectData.title;
            figure.appendChild(img);
            
            const figcaption = document.createElement("figcaption");
            figcaption.textContent = projectData.title;
            figure.appendChild(figcaption);
            
            galleryDiv.appendChild(figure);
            console.log('Projet ajouté à la galerie.');
        } catch (error) {
            console.error("Erreur lors de l'ajout du projet à la galerie:", error);
        }
    };
    
    // Sélectionnez l'icône en utilisant sa classe
    const closeModalIcon = document.querySelector('.close-modal-addProjects');
    
    // Sélectionnez les deux modales en utilisant leurs ID
    const modalAddPhoto = document.getElementById('modal-add-photo');
    const modalEdit = document.getElementById('modal-edit');
    
    // Vérifiez que les éléments ont bien été sélectionnés
    if (closeModalIcon && modalAddPhoto && modalEdit) {
        // Ajoutez un écouteur d'événements à l'icône
        closeModalIcon.addEventListener('click', () => {
            // Fermez la modale actuelle
            modalAddPhoto.style.display = 'none';
            
            // Ouvrez la modale précédente
            modalEdit.style.display = 'block';
        });
    } else {
        console.error('Un ou plusieurs éléments n\'ont pas été trouvés');
    }
    
    
    
    
    
}

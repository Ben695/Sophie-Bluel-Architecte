export const addWorks = async () => {
    let titrePhotos = document.getElementById("titrePhotos");
    let optionsList = document.getElementById("optionsList");
    let validAddPhotos = document.getElementById("valid-addPhotos");
    
    function checkFormCompletion() {
        console.log("Vérification de la complétion du formulaire...");
        console.log("Valeur du titre:", titrePhotos.value.trim());
        console.log("Option sélectionnée:", getSelectedOption());
        
        const imageInput = document.getElementById('imageInput');
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
    
    
    async function addWorkToAPI(title, imageFile, categoryId) {
        console.log("Début de la fonction addWorkToAPI");
        const url = "http://localhost:5678/api/works";
        
        let formData = new FormData();
        formData.append("image", imageFile);
        formData.append("title", title);
        formData.append("category", categoryId);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                console.log("Réponse OK de l'API");
                return await response.json();
            } else {
                console.error("Réponse non réussie de l'API", await response.text());
                throw new Error("Réponse non réussie de l'API");
            }
        } catch (error) {
            console.error("Erreur lors de l'appel de l'API", error);
            throw error;
        }
    }
    
    titrePhotos.addEventListener("input", checkFormCompletion);
    optionsList.addEventListener("click", checkFormCompletion);
    
    document.getElementById('addPhotos').addEventListener('click', function () {
        document.getElementById('imageInput').click();
    });
    
    document.getElementById('toggleOptionsElement').addEventListener('click', toggleOptions);
    
    validAddPhotos.addEventListener("click", async () => {
        console.log("Cliquez sur validAddPhotos");
        const title = titrePhotos.value.trim();
        const imageFile = document.getElementById('imageInput').files[0];
        const categoryId = getSelectedOption().dataset.id;
        
        console.log("Title:", title);
        console.log("Image File:", imageFile);
        console.log("Category ID:", categoryId);
        
        try {
            await addWorkToAPI(title, imageFile, categoryId);
            alert("Le travail a été ajouté avec succès!");
        } catch (error) {
            alert("Erreur lors de l'ajout du travail: " + error.message);
        }
    });
    
    // Ensure optionsList is initially hidden
    optionsList.style.display = "none";
    
    // Load categories
    await loadCategoriesFromAPI();
    
    document.getElementById('btn-addProjects').addEventListener('click', function() {
        // La modale est maintenant visible, nous pouvons ajouter des écouteurs d'événements à imageInput
        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
            // Ajoutez ici les écouteurs d'événements à imageInput
            imageInput.addEventListener('change', function (event) {
                const file = event.target.files[0];
                
                if (file) {
                    const reader = new FileReader();
                    
                    reader.onload = function (e) {
                        while (document.getElementById('addPhotos').firstChild) {
                            document.getElementById('addPhotos').removeChild(document.getElementById('addPhotos').firstChild);
                        }
                        
                        const img = new Image();
                        img.src = e.target.result;
                        document.getElementById('addPhotos').appendChild(img);
                    }
                    
                    reader.readAsDataURL(file);
                }
            });
        } else {
            console.error("Element #imageInput not found");
        }
    });
    
    // Le reste de votre code JavaScript ici...
    
}

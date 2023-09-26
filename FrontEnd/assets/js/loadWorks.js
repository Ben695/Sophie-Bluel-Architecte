export let works = [];

export const loadWorkandFilter = async() =>{
    const url = "http://localhost:5678/api/works";
    try{
        const response = await fetch(url);
        works = await response.json();
    }catch(error) {
        // Gestion des erreurs et affichage dans la console
        console.error("Une erreur s'est produite lors de la génération des projets:", error);
    }
}
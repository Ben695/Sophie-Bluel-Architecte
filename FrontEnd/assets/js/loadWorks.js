// On déclare et exporte un tableau vide nommé "works". 
// Ce tableau est destiné à stocker des données par la suite.
export let works = [];

export const loadWorkandFilter = async() =>{
    const url = import.meta.env.VITE_APP_BACK_URL+"/works";
    
    try{
        // On utilise la fonction fetch pour envoyer une requête HTTP GET à l'URL spécifiée.
        // Comme fetch retourne une promesse, on utilise await pour attendre que la requête soit terminée.
        const response = await fetch(url);
        
        // Une fois la réponse reçue, on la convertit en JSON, ce qui nous donne les données sous forme d'objet JavaScript.
        // On utilise à nouveau await car la conversion en JSON est aussi une opération asynchrone.
        works = await response.json();
    }catch(error) {
        // Si une erreur se produit lors de la requête ou de la conversion en JSON, on la capture ici.
        // On affiche un message d'erreur dans la console pour informer le développeur de ce qui s'est passé.
        console.error("Une erreur s'est produite lors de la génération des projets:", error);
    }
}

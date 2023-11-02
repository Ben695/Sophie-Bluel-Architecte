import { displayWorks } from "./js/displayWorks.js";
import { loadWorkandFilter } from "./js/loadWorks.js";
import { connexion } from "./js/connexion.js";
import { deleteWorks } from "./js/deleteWorks.js"
import { formVerification } from "./js/formVerifications.js";
import { addWorks } from "./js/addWorks.js";
import { initialAnimation } from "./js/AnimationGsap.js";


document.addEventListener("DOMContentLoaded", async function() {
    connexion();
    
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        initialAnimation();
        await loadWorkandFilter();
        displayWorks();
        await deleteWorks();
        formVerification();
        await addWorks();
    }
});

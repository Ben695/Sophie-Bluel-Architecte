import { displayWorks } from "./js/displayWorks.js";
import { loadWorkandFilter } from "./js/loadWorks.js";
import { connexion } from "./js/connexion.js";
import { deleteWorks } from "./js/deleteWorks.js"
import { formVerification } from "./js/formVerifications.js";
import { addWorks } from "./js/addWorks.js";

document.addEventListener("DOMContentLoaded", async function() {
    connexion();
    await loadWorkandFilter();
    displayWorks();
    await deleteWorks();
    formVerification();
    await addWorks(); 
});

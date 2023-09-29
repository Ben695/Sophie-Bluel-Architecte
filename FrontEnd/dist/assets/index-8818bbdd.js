(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function t(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function a(n){if(n.ep)return;n.ep=!0;const l=t(n);fetch(n.href,l)}})();let C=[];const A=async()=>{const r="http://localhost:5678/api/works";try{C=await(await fetch(r)).json()}catch(e){console.error("Une erreur s'est produite lors de la génération des projets:",e)}},T=()=>{const r=document.getElementById("gallery"),e=document.querySelector(".filter"),t=new Set(C.map(l=>l.category.name));t.add("Tous"),[...t].reverse().forEach(l=>{const i=document.createElement("button");i.textContent=l,i.className="btn-filter",e.appendChild(i)});const n=document.querySelectorAll(".btn-filter");n.forEach(l=>{l.addEventListener("click",()=>{const i=l.textContent;r.innerHTML="",C.forEach(f=>{if(i==="Tous"||f.category.name===i){const y=document.createElement("figure"),m=document.createElement("img"),g=document.createElement("figcaption");m.src=f.imageUrl,m.alt=f.title,g.textContent=f.title,y.setAttribute("data-id",f.id),y.appendChild(m),y.appendChild(g),r.appendChild(y)}}),n.forEach(f=>f.classList.remove("active")),l.classList.add("active")})}),n[0].click()},O=()=>{const r=localStorage.getItem("authToken"),e=localStorage.getItem("isLoggedIn"),t=document.getElementById("logout-menu"),a=document.getElementById("login-menu");function n(){a&&(a.style.display="block"),t&&(t.style.display="none")}function l(){a&&(a.style.display="none"),t&&(t.style.display="block")}if(r&&e==="true"){l();const m=document.getElementById("edit-mode"),g=document.getElementById("edit");m&&(m.style.display="flex"),g&&(g.style.display="flex")}else{n();const m=document.getElementById("edit-mode"),g=document.getElementById("edit");m&&(m.style.display="none"),g&&(g.style.display="none")}if(t&&t.addEventListener("click",()=>{localStorage.removeItem("authToken"),localStorage.removeItem("isLoggedIn"),window.location.href="login.html"}),window.location.pathname.endsWith("login.html")){let w=function(o){P.textContent=o,E&&(E.style.display="block")},I=function(){E&&(E.style.display="none")},B=function(){g&&(g.value="")};var i=w,f=I,y=B;const m=document.getElementById("email"),g=document.getElementById("password"),P=document.querySelector(".error-message"),v="http://localhost:5678/api/users/login",b=document.querySelector(".modal-close"),E=document.getElementById("modal-connexion");m&&m.addEventListener("blur",()=>{const o=m.value;/^[^\s@]+@[^\s@]+\.[^\s@]+/.test(o)?I():w("Adresse e-mail invalide. Veuillez saisir une adresse e-mail valide.")});const L=document.getElementById("connexion");L&&L.addEventListener("click",async()=>{const o=m.value,s=g.value;try{const d=await fetch(v,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,password:s})});if(d.ok){const c=await d.json();localStorage.setItem("authToken",c.token),localStorage.setItem("isLoggedIn","true"),window.location.href="index.html"}else w("Identifiants incorrects"),B()}catch(d){console.error("Une erreur s'est produite :",d),w("Une erreur s'est produite. Veuillez réessayer."),B()}}),b&&b.addEventListener("click",()=>{I()}),window.addEventListener("click",o=>{E&&o.target===E&&I()})}},x=r=>{document.getElementById(r).style.display="block",document.body.style.overflow="hidden"},k=r=>{document.getElementById(r).style.display="none",document.body.style.overflow="auto"};async function M(r){r.preventDefault(),r.stopPropagation();const e=r.target.closest("figure");if(!e){console.error("Élément figure non trouvé");return}const t=e.getAttribute("data-id");if(!t){console.error("ID du projet non trouvé");return}const a=localStorage.getItem("authToken");if(!a){console.error("Token d'authentification non trouvé");return}try{if(!(await fetch(`http://localhost:5678/api/works/${t}`,{method:"DELETE",headers:{Authorization:`Bearer ${a}`}})).ok)throw new Error(`Erreur lors de la suppression du projet ID ${t}`);console.log(`Projet ID ${t} supprimé avec succès de l'API.`)}catch(i){console.error("Erreur lors de la suppression du projet via l'API:",i);return}e.remove(),console.log(`Projet ID ${t} supprimé de la modale de suppression`);const n=document.getElementById("gallery");if(!n){console.error("Élément #gallery non trouvé");return}const l=n.querySelector(`figure[data-id='${t}']`);if(!l){console.error(`Projet ID ${t} non trouvé dans #gallery`);return}l.remove(),console.log(`Projet ID ${t} supprimé de #gallery`)}const q=async()=>{try{const r=document.getElementById("gallery-remove");C.forEach(e=>{const t=document.createElement("figure");t.setAttribute("data-id",e.id);const a=document.createElement("img");a.src=e.imageUrl,a.alt=e.title,t.appendChild(a);const n=document.createElement("button");n.className="btn-delete",n.type="submit";const l=document.createElement("i");l.className="fa-solid fa-trash",l.style.color="#ffffff",n.appendChild(l),t.appendChild(n),r.appendChild(t)}),r.addEventListener("click",e=>{(e.target.classList.contains("btn-delete")||e.target.parentNode.classList.contains("btn-delete"))&&M(e)})}catch(r){console.error("Erreur lors de la récupération des images de projets dans la modale de suppression:",r)}};document.addEventListener("DOMContentLoaded",()=>{const r=document.getElementById("edit"),e=document.getElementById("modal-edit");r&&e&&(r.addEventListener("click",()=>{x("modal-edit")}),document.getElementById("modal-close-edit").addEventListener("click",()=>{k("modal-edit")}),window.addEventListener("click",a=>{a.target===e&&k("modal-edit")}));const t=document.getElementById("btn-addProjects");t&&t.addEventListener("click",()=>{k("modal-edit"),x("modal-add-photo")}),document.getElementById("modal-close-add-photo").addEventListener("click",()=>{k("modal-add-photo")}),window.addEventListener("click",a=>{a.target===document.getElementById("modal-add-photo")&&k("modal-add-photo")})});const D=()=>{function r(t){var a=document.getElementById("modal-form"),n=a.querySelector(".error-form");n.textContent=t,a.style.display="block"}function e(){document.getElementById("name").value="",document.getElementById("email").value="",document.getElementById("message").value=""}document.querySelector(".modal-close").addEventListener("click",function(){document.getElementById("modal-form").style.display="none"}),document.getElementById("modal-form").addEventListener("click",function(t){t.target===t.currentTarget&&(document.getElementById("modal-form").style.display="none")}),document.getElementById("contactForm").addEventListener("submit",function(t){t.preventDefault();var a=document.getElementById("name").value.trim(),n=document.getElementById("email").value.trim(),l=document.getElementById("message").value.trim();if(!a){r("Veuillez entrer votre nom.");return}if(!n){r("Veuillez entrer votre adresse email.");return}if(!l){r("Veuillez entrer votre message.");return}r("Merci! Votre formulaire a été soumis avec succès."),e()})},N=async()=>{let r=document.getElementById("titrePhotos"),e=document.getElementById("optionsList"),t=document.getElementById("valid-addPhotos"),a=document.getElementById("addPhotos"),n=a.querySelector(".btn-addPhotos"),l=a.querySelector(".txt-addPhotos");function i(){console.log("Vérification de la complétion du formulaire..."),console.log("Valeur du titre:",r.value.trim()),console.log("Option sélectionnée:",g());const o=document.getElementById("imageInput");if(console.log("Image input ----------",o),!o){console.error("Element #imageInput not found");return}const s=o.files[0];r.value.trim()!==""&&g()!==null&&s?(t.removeAttribute("disabled"),console.log("Le formulaire est complet, activation du bouton.")):(t.setAttribute("disabled",!0),console.log("Le formulaire n'est pas encore complet..."))}function f(){console.log("Toggling optionsList display..."),e.style.display==="none"||e.style.display===""?(e.style.display="block",console.log("Displaying optionsList")):(e.style.display="none",console.log("Hiding optionsList"))}let y=null;function m(o){var s=document.querySelector(".selector");s.textContent=o.textContent,y=o,document.querySelectorAll(".option").forEach(c=>{c.classList.remove("selected")}),o.classList.add("selected"),console.log("Option choisie:",o.textContent),e.style.display="none";var d=document.createElement("i");d.className="fa-solid fa-chevron-up",d.style.color="#6c6c6c",s.appendChild(d)}function g(){return y}async function P(){console.log("Loading categories from API...");const o="http://localhost:5678/api/categories";try{const s=await fetch(o);if(!s.ok){console.error("Failed to fetch categories:",s.statusText);return}const d=await s.json();for(console.log("Categories loaded:",d);e.firstChild;)e.removeChild(e.firstChild);d.forEach(c=>{const u=document.createElement("div");u.className="option",u.textContent=c.name,u.dataset.id=c.id,u.addEventListener("click",function(){m(u),i()}),e.appendChild(u),console.log("Option added:",c.name)})}catch(s){console.error("Error loading categories:",s)}}function v(o){console.log("showErrorModal déclenché",o);const s=document.getElementById("modal-form"),d=s.querySelector(".error-form");d.textContent=o,s.style.display="block"}document.querySelector(".modal-close").addEventListener("click",function(){document.getElementById("modal-form").style.display="none"});async function b(o,s,d){console.log("Début de la fonction addWorkToAPI");const c="http://localhost:5678/api/works",u=localStorage.getItem("authToken");let p=new FormData;p.append("image",s),p.append("title",o),p.append("category",d);try{const h=await fetch(c,{method:"POST",headers:{Authorization:`Bearer ${u}`},body:p});switch(h.status){case 201:return console.log("Work ajouté avec succès"),await h.json();case 400:const j=await h.text();throw v("Erreur 400: "+j),new Error("Erreur 400: "+j);case 401:window.location.href="login.html";break;case 500:throw v("Erreur 500: Le serveur est cassé"),new Error("Erreur 500: Le serveur est cassé");default:const S=await h.text();throw v("Erreur "+h.status+": "+S),new Error("Réponse non réussie de l'API, statut: "+h.status)}}catch(h){console.error("Erreur lors de l'appel de l'API",h),v("Une erreur inattendue s'est produite.")}}r.addEventListener("input",i),e.addEventListener("click",i),document.getElementById("addPhotos").addEventListener("click",function(){document.getElementById("imageInput").click()}),document.getElementById("toggleOptionsElement").addEventListener("click",f),e.style.display="none",await P(),document.getElementById("btn-addProjects").addEventListener("click",function(){const o=document.getElementById("imageInput");o?o.addEventListener("change",function(s){const d=s.target.files[0];if(d){const c=new FileReader;c.onload=function(u){n.style.zIndex="-1",l.style.zIndex="-1";const p=new Image;p.src=u.target.result,p.style.zIndex="1",a.appendChild(p)},c.readAsDataURL(d)}}):console.error("Element #imageInput not found")}),t.addEventListener("click",async()=>{const o=r.value.trim(),s=g().dataset.id,d=document.getElementById("imageInput").files[0];try{const c=await b(o,d,s);console.log("Œuvre ajoutée avec succès:",c),E(c),w(c)}catch(c){console.error("Erreur lors de l'ajout de l'œuvre:",c)}});const E=o=>{try{const s=document.getElementById("gallery-remove"),d=document.createElement("figure");d.setAttribute("data-id",o.id);const c=document.createElement("img");c.src=o.imageUrl,c.alt=o.title,d.appendChild(c);const u=document.createElement("button");u.className="btn-delete",u.type="submit";const p=document.createElement("i");p.className="fa-solid fa-trash",p.style.color="#ffffff",u.appendChild(p),d.appendChild(u),s.appendChild(d),console.log("Image ajoutée à la modale d’ajout.")}catch(s){console.error("Erreur lors de l'ajout de l'image à la modale:",s)}},w=o=>{try{const s=document.getElementById("gallery"),d=document.createElement("figure");d.setAttribute("data-id",o.id);const c=document.createElement("img");c.src=o.imageUrl,c.alt=o.title,d.appendChild(c);const u=document.createElement("figcaption");u.textContent=o.title,d.appendChild(u),s.appendChild(d),console.log("Projet ajouté à la galerie.")}catch(s){console.error("Erreur lors de l'ajout du projet à la galerie:",s)}},I=document.querySelector(".close-modal-addProjects"),B=document.getElementById("modal-add-photo"),L=document.getElementById("modal-edit");I&&B&&L?I.addEventListener("click",()=>{B.style.display="none",L.style.display="block"}):console.error("Un ou plusieurs éléments n'ont pas été trouvés")};document.addEventListener("DOMContentLoaded",async function(){O(),await A(),T(),await q(),D(),await N()});

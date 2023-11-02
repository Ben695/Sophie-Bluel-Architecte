export const initialAnimation = () => {
    const authToken = localStorage.getItem('authToken');
    
    // On initialise une timeline avec GSAP.
    const tl = gsap.timeline();

    const header = document.querySelector('header');
    const introductionImage = document.querySelector('#introduction figure img');
    const introductionText = document.querySelector('#introduction article');
    const portfolio = document.querySelector('#portfolio');
    
    // Si l'utilisateur n'est pas authentifié (pas de token).
    if (!authToken) {
        // On initialise les éléments avec des valeurs spécifiques pour préparer l'animation.
        gsap.set(header, { y: '-100%', opacity: 0 });
        gsap.set(introductionImage, { y: '-100%', opacity: 0 });
        gsap.set(introductionText, { x: '-100%', opacity: 0 });
        gsap.set(portfolio, { opacity: 0, y: '500px' });
        
        // On définit les animations à effectuer sur les éléments.
        tl.to(header, { y: '0%', opacity: 1, duration: 1, ease: 'power2.out' })
          .to(introductionImage, { y: '0%', opacity: 1, duration: 1, ease: 'power2.out' }, "-=0.5")
          .to(introductionText, { x: '0%', opacity: 1, duration: 1, ease: 'power2.out' }, "-=0.5")
          .to(portfolio, { opacity: 1, y: '0%', duration: 1, ease: 'power2.out' });
    }
}

export const galleryImageAnimations = () => {
    document.querySelectorAll('#gallery figure img').forEach(img => {
        // On initialise chaque image avec des valeurs spécifiques.
        gsap.set(img, {
            x: 0,
            y: 0,
            transition: "none"
        });
        
        // On ajoute un événement pour animer l'image lors du mouvement de la souris.
        img.addEventListener('mousemove', function(e) {
            // On obtient les coordonnées de l'image.
            const rect = img.getBoundingClientRect();
            // On calcule les positions de la souris par rapport à l'image.
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            // On calcule les décalages en fonction de la position de la souris.
            const xOffset = ((mouseX / rect.width) - 0.5) * 20;
            const yOffset = ((mouseY / rect.height) - 0.5) * 20;
            // On anime l'image en fonction des décalages.
            gsap.to(img, {
                x: xOffset,
                y: yOffset,
                duration: 0.5,
                ease: "power2.out"
            });
        });
        
        // On ajoute un événement pour réinitialiser la position de l'image lorsque la souris sort.
        img.addEventListener('mouseout', function() {
            gsap.to(img, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });
}

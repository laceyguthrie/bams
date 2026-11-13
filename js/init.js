document.addEventListener('DOMContentLoaded', function() {
    console.log('ready');

    // Ticker - cycles through services list (respects reduced motion preference)
    const ticker = document.querySelector('.js-ticker');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (ticker && !prefersReducedMotion) {
        setInterval(function() {
            const firstItem = ticker.firstElementChild;
            if (firstItem) {
                ticker.appendChild(firstItem);
            }
        }, 600);
    }

    // Fleeing link - runs away from cursor (uses document listener since element has pointer-events: none)
    const fleeingLink = document.querySelector('.js-fleeing-link');
    if (fleeingLink) {
        let offsetX = 0;
        let offsetY = 0;
        const fleeDistance = 80;
        
        // Get the home position (original position without transform)
        const homeRect = fleeingLink.getBoundingClientRect();
        const homeX = homeRect.left + homeRect.width / 2;
        const homeY = homeRect.top + homeRect.height / 2;
        const fleeThreshold = Math.max(homeRect.width, homeRect.height) / 2 + 16;

        function returnHome() {
            offsetX = 0;
            offsetY = 0;
            fleeingLink.style.transform = 'translate(0, 0)';
        }

        // Return home when hovering over other nav links
        const otherLinks = document.querySelectorAll('.bams-header__link:not(.js-fleeing-link)');
        otherLinks.forEach(function(link) {
            link.addEventListener('mouseenter', returnHome);
        });

        document.addEventListener('mousemove', function(e) {
            // Check distance from HOME position, not current position
            const deltaX = e.clientX - (homeX + offsetX);
            const deltaY = e.clientY - (homeY + offsetY);
            const distanceFromCurrent = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Also check distance from home for return logic
            const homeDistX = e.clientX - homeX;
            const homeDistY = e.clientY - homeY;
            const distanceFromHome = Math.sqrt(homeDistX * homeDistX + homeDistY * homeDistY);
            
            if (distanceFromCurrent < fleeThreshold) {
                // Flee in the opposite direction, more aggressively when closer
                const angle = Math.atan2(deltaY, deltaX);
                const intensity = 1 - (distanceFromCurrent / fleeThreshold);
                const flee = fleeDistance * (0.5 + intensity);
                
                offsetX += -Math.cos(angle) * flee * 0.5;
                offsetY += -Math.sin(angle) * flee * 0.5;
                
                // Keep it bounded but with more room to run (never flee up)
                offsetX = Math.max(-150, Math.min(150, offsetX));
                offsetY = Math.max(0, Math.min(40, offsetY));
                
                fleeingLink.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            } else if (distanceFromHome > fleeThreshold * 2) {
                // Return home when cursor is away from the home area
                offsetX *= 0.9;
                offsetY *= 0.9;
                if (Math.abs(offsetX) < 1 && Math.abs(offsetY) < 1) {
                    offsetX = 0;
                    offsetY = 0;
                }
                fleeingLink.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            }
        });
    }
});

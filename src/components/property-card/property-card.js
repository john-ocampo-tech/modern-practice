// Vite scopes this CSS dynamically for us!
import './property-card.css';

export function renderProperties(propertiesToRender) {
    const container = document.getElementById('property-container');
    container.innerHTML = ''; 

    if (propertiesToRender.length === 0) {
        container.innerHTML = '<p class="no-properties">No properties match your search.</p>';
        return;
    }

    propertiesToRender.forEach((property, index) => {
        const card = document.createElement('div');
        card.className = 'property-card';
        // Staggers the load animations incrementally for an elegant UI waterfall effect
        card.style.animationDelay = `${index * 0.05}s`; 

        // Added the inline svg class to the location icon for perfect baseline alignment
        const pinIcon = `<svg class="location-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
        const lotIcon = `<svg class="spec-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`;
        const floorIcon = `<svg class="spec-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>`;

        const imageUrl = property.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

        card.innerHTML = `
            <div class="card-image">
                <img src="${imageUrl}" alt="${property.project}" loading="lazy">
                <div class="card-image-overlay"></div>
                <div class="card-badge"><span>${property.unit_type}</span></div>
                <button class="card-hover-btn">View Listing</button>
            </div>
            <div class="card-body">
                <h2 class="card-title">${property.project}</h2>
                <p class="card-location">${pinIcon} ${property.location}</p>
                <div class="card-specs">
                    <div class="spec-item">
                        ${lotIcon}
                        <div class="spec-details">
                            <span class="spec-label">Lot Area</span>
                            <span class="spec-value">${property.lot_area}</span>
                        </div>
                    </div>
                    <div class="spec-item">
                        ${floorIcon}
                        <div class="spec-details">
                            <span class="spec-label">Floor Area</span>
                            <span class="spec-value">${property.floor_area}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <p class="card-developer">Developed by ${property.developer}</p>
            </div>
        `;
        container.appendChild(card);
    });
}
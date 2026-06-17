// ==========================================
// 1. MODERN WAY: Import CSS directly into our JS! Vite handles it.
// ==========================================
import './style.css'

import { fetchProperties } from './data.js';
import { populateCustomDropdowns, renderProperties, applyFiltersUI } from './ui.js';

async function init() {
    const container = document.getElementById('property-container');
    
    try {
        const properties = await fetchProperties();

        if (properties.length === 0) {
            container.innerHTML = '<p>No properties listed yet.</p>';
            return;
        }

        populateCustomDropdowns(properties);
        renderProperties(properties);

        document.getElementById('search-input').addEventListener('input', applyFiltersUI);

    } catch (err) {
        container.innerHTML = '<p>Something went wrong.</p>';
    }
}

// ==========================================
// 7. RING THE STARTING BELL
// ==========================================
window.addEventListener('DOMContentLoaded', init);
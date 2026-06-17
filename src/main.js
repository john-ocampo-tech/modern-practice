import './global.css' // Global grid, body styles, variables
import { fetchProperties } from './services/supabase.js';
import { renderProperties } from './components/property-card/property-card.js';
import { populateCustomDropdowns, triggerFiltering } from './components/filter-dropdown/filter-dropdown.js';

async function init() {
    const container = document.getElementById('property-container');
    
    try {
        const properties = await fetchProperties();

        if (properties.length === 0) {
            container.innerHTML = '<p>No properties listed yet.</p>';
            return;
        }

        // Initialize features
        populateCustomDropdowns(properties);
        renderProperties(properties);

        // Bind global search bar listener
        document.getElementById('search-input').addEventListener('input', triggerFiltering);

    } catch (err) {
        container.innerHTML = '<p>Something went wrong loading application listings.</p>';
    }
}

window.addEventListener('DOMContentLoaded', init);
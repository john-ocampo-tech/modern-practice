// 1. MODERN WAY: Import CSS directly into our JS! Vite handles it.
import './style.css'

// 2. MODERN WAY: Import Supabase from our node_modules toolbox!
import { createClient } from '@supabase/supabase-js'

// 3. Your Credentials
const SUPABASE_URL = 'https://hbrebdkbjeqymrmttshh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicmViZGtiamVxeW1ybXR0c2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyODMyNTUsImV4cCI6MjA5Njg1OTI1NX0.Ghr68Yt_rV-JCm51n10QeS2jYjb9W4PrUbfTUFGqKYk';

// 4. Initialize Supabase (Notice we don't need window.supabase anymore!)
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let selectedLocation = "";
let selectedType = "";

// ==========================================
// 2. THE WORKER'S TASK
// ==========================================
async function fetchProperties() {
    const container = document.getElementById('property-container');

    try {
        const { data: properties, error } = await db.from('properties').select('*');

        if (error) {
            console.error('Error fetching properties:', error);
            container.innerHTML = '<p>Could not load properties.</p>';
            return;
        }

        if (properties.length === 0) {
            container.innerHTML = '<p>No properties listed yet.</p>';
            return;
        }

        window.allProperties = properties;
        populateCustomDropdowns(properties);
        renderProperties(properties);

    } catch (err) {
        console.error('Unexpected error:', err);
        container.innerHTML = '<p>Something went wrong.</p>';
    }
}

// ==========================================
// 3. HELPER: POPULATE CUSTOM DROPDOWNS
// ==========================================
function populateCustomDropdowns(properties) {
    const locationMenu = document.querySelector('#location-dropdown .dropdown-menu');
    const typeMenu = document.querySelector('#type-dropdown .dropdown-menu');

    const resetLocItem = document.createElement('div');
    resetLocItem.className = 'dropdown-item reset-item';
    resetLocItem.textContent = 'All Locations';
    resetLocItem.addEventListener('click', () => handleDropdownSelect('location', "", resetLocItem, 'All Locations'));
    locationMenu.appendChild(resetLocItem);

    const resetTypeItem = document.createElement('div');
    resetTypeItem.className = 'dropdown-item reset-item';
    resetTypeItem.textContent = 'All Unit Types';
    resetTypeItem.addEventListener('click', () => handleDropdownSelect('type', "", resetTypeItem, 'All Unit Types'));
    typeMenu.appendChild(resetTypeItem);

    const locations = [...new Set(properties.map(p => p.location).filter(Boolean))].sort();
    locations.forEach(loc => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = loc;
        item.addEventListener('click', () => handleDropdownSelect('location', loc, item));
        locationMenu.appendChild(item);
    });

    const types = [...new Set(properties.map(p => p.unit_type).filter(Boolean))].sort();
    types.forEach(type => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = type;
        item.addEventListener('click', () => handleDropdownSelect('type', type, item));
        typeMenu.appendChild(item);
    });

    setupDropdownToggles();
}

// ==========================================
// 4. HELPER: DROPDOWN INTERACTION LOGIC
// ==========================================
function setupDropdownToggles() {
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.contains('is-open');
            closeAllDropdowns();
            if (!isOpen) dropdown.classList.add('is-open');
        });
    });
    window.addEventListener('click', closeAllDropdowns);
}

function closeAllDropdowns() {
    document.querySelectorAll('.custom-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
}

function handleDropdownSelect(type, value, element, displayText = null) {
    const dropdownId = type === 'location' ? '#location-dropdown' : '#type-dropdown';
    const dropdown = document.querySelector(dropdownId);
    const triggerText = dropdown.querySelector('.dropdown-trigger span');

    dropdown.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('is-selected'));
    element.classList.add('is-selected');

    triggerText.textContent = displayText || value; 
    
    if (type === 'location') {
        selectedLocation = value;
    } else {
        selectedType = value;
    }

    closeAllDropdowns();
    applyFilters();
}

// ==========================================
// 5. HELPER: RENDER CARDS
// ==========================================
function renderProperties(propertiesToRender) {
    const container = document.getElementById('property-container');
    container.innerHTML = ''; 

    if (propertiesToRender.length === 0) {
        container.innerHTML = '<p>No properties match your search.</p>';
        return;
    }

    propertiesToRender.forEach((property, index) => {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.style.animationDelay = `${index * 0.07}s`;

        const pinIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
        const lotIcon = `<svg class="spec-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`;
        const floorIcon = `<svg class="spec-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>`;

        const imageUrl = property.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

        card.innerHTML = `
            <div class="card-image">
                <img src="${imageUrl}" alt="${property.project}">
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
                        <div class="spec-details"><span class="spec-label">Lot Area</span><span class="spec-value">${property.lot_area}</span></div>
                    </div>
                    <div class="spec-item">
                        ${floorIcon}
                        <div class="spec-details"><span class="spec-label">Floor Area</span><span class="spec-value">${property.floor_area}</span></div>
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

// ==========================================
// 6. HELPER: FILTER LOGIC
// ==========================================
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const allProps = window.allProperties;

    const filteredProps = allProps.filter(property => {
        const matchesSearch = property.project.toLowerCase().includes(searchTerm) || 
                              property.developer.toLowerCase().includes(searchTerm);
        const matchesLocation = selectedLocation === "" || property.location === selectedLocation;
        const matchesType = selectedType === "" || property.unit_type === selectedType;

        return matchesSearch && matchesLocation && matchesType;
    });

    renderProperties(filteredProps);
}

// ==========================================
// 7. RING THE STARTING BELL
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    fetchProperties();
    document.getElementById('search-input').addEventListener('input', applyFilters);
});
import './filter-dropdown.css';
import { getFilteredProperties } from '../../services/supabase.js';
import { renderProperties } from '../property-card/property-card.js';

let selectedLocation = "";
let selectedType = "";

export function populateCustomDropdowns(properties) {
    const locationMenu = document.querySelector('#location-dropdown .dropdown-menu');
    const typeMenu = document.querySelector('#type-dropdown .dropdown-menu');

    // Clean existing items to prevent duplication bugs
    locationMenu.innerHTML = '';
    typeMenu.innerHTML = '';

    // Create Location Reset Option
    const resetLocItem = document.createElement('div');
    resetLocItem.className = 'dropdown-item reset-item is-selected'; // Start selected by default
    resetLocItem.textContent = 'All Locations';
    resetLocItem.addEventListener('click', () => handleDropdownSelect('location', "", resetLocItem, 'All Locations'));
    locationMenu.appendChild(resetLocItem);

    // Create Unit Type Reset Option
    const resetTypeItem = document.createElement('div');
    resetTypeItem.className = 'dropdown-item reset-item is-selected'; // Start selected by default
    resetTypeItem.textContent = 'All Unit Types';
    resetTypeItem.addEventListener('click', () => handleDropdownSelect('type', "", resetTypeItem, 'All Unit Types'));
    typeMenu.appendChild(resetTypeItem);

    // Populate dynamic location values
    const locations = [...new Set(properties.map(p => p.location).filter(Boolean))].sort();
    locations.forEach(loc => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = loc;
        item.addEventListener('click', () => handleDropdownSelect('location', loc, item));
        locationMenu.appendChild(item);
    });

    // Populate dynamic type values
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

export function closeAllDropdowns() {
    document.querySelectorAll('.custom-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
}

function handleDropdownSelect(type, value, element, displayText = null) {
    const dropdownId = type === 'location' ? '#location-dropdown' : '#type-dropdown';
    const dropdown = document.querySelector(dropdownId);
    const triggerText = dropdown.querySelector('.dropdown-trigger span');

    // Wipe previous selections inside this active dropdown menu list loop
    dropdown.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('is-selected'));
    
    // Assign structural indicator tags
    element.classList.add('is-selected');

    triggerText.textContent = displayText || value; 
    
    if (type === 'location') {
        selectedLocation = value;
    } else {
        selectedType = value;
    }

    closeAllDropdowns();
    triggerFiltering();
}

export function triggerFiltering() {
    const searchTerm = document.getElementById('search-input').value;
    const filteredProps = getFilteredProperties(searchTerm, selectedLocation, selectedType);
    renderProperties(filteredProps);
}
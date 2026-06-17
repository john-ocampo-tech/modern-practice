import { db } from './config.js';

let allProperties = [];

// ==========================================
// 2. THE WORKER'S TASK
// ==========================================
export async function fetchProperties() {
    try {
        const { data: properties, error } = await db.from('properties').select('*');
        
        if (error) throw error;

        allProperties = properties;
        return properties;
    } catch (err) {
        console.error('Error fetching properties:', err);
        throw err;
    }
}

export function getAllProperties() {
    return allProperties;
}

// ==========================================
// 6. HELPER: FILTER LOGIC
// ==========================================
export function getFilteredProperties(searchTerm, selectedLocation, selectedType) {
    const cleanSearch = searchTerm.toLowerCase();

    return allProperties.filter(property => {
        const matchesSearch = property.project.toLowerCase().includes(cleanSearch) || 
                              property.developer.toLowerCase().includes(cleanSearch);
        const matchesLocation = selectedLocation === "" || property.location === selectedLocation;
        const matchesType = selectedType === "" || property.unit_type === selectedType;

        return matchesSearch && matchesLocation && matchesType;
    });
}
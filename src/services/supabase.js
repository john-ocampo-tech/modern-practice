import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hbrebdkbjeqymrmttshh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicmViZGtiamVxeW1ybXR0c2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyODMyNTUsImV4cCI6MjA5Njg1OTI1NX0.Ghr68Yt_rV-JCm51n10QeS2jYjb9W4PrUbfTUFGqKYk';

export const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let allProperties = [];

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
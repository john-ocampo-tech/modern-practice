import { createClient } from '@supabase/supabase-js'

// ==========================================
// 3. YOUR CREDENTIALS
// ==========================================
export const SUPABASE_URL = 'https://hbrebdkbjeqymrmttshh.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicmViZGtiamVxeW1ybXR0c2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyODMyNTUsImV4cCI6MjA5Njg1OTI1NX0.Ghr68Yt_rV-JCm51n10QeS2jYjb9W4PrUbfTUFGqKYk';

// ==========================================
// 4. INITIALIZE SUPABASE
// ==========================================
export const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
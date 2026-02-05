import { createClient } from '@supabase/supabase-client';

// Ces deux lignes vont chercher les clés que tu as enregistrées dans Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// On crée l'outil de connexion
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

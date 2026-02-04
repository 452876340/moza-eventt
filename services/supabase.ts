
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseKey && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY';

if (!isConfigured) {
  console.warn('Supabase URL or Key is missing or invalid! Check your .env.local file. App will run in Mock Data mode.');
}

// Ensure createClient receives a valid URL format to prevent initialization errors
// The actual data fetching logic in dataService.ts checks for configuration before using this client
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseKey) 
  : createClient('https://placeholder.supabase.co', 'placeholder');

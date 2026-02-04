import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://tjbhrkdyzxdvhpqlidkx.supabase.co'; // Reemplaza con tu URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYmhya2R5enhkdmhwcWxpZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTQzMDcsImV4cCI6MjA4NTc5MDMwN30.3aM_va8EjXkRDRbpuaqI7c0OFKghGbBy8mVkZGgenDk'; // Reemplaza con tu key

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
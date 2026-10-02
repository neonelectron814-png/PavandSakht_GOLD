import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pvuavjzdsmvzybuscdih.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dWF2anpkc212enlidXNjZGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5MzkwODgsImV4cCI6MjEwNjUxNTA4OH0.CfJd_vm_8ulflyUhepE9viQosb3ogbSIVMyakGOnx04';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

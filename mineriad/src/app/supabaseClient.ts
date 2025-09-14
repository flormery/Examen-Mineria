import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aswmdmtkpjrrckhwcqlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzd21kbXRrcGpycmNraHdjcWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODQ1ODEsImV4cCI6MjA3MzI2MDU4MX0.VWOZB2ZBhO0VZtHba68jzC0ZD2FKeMBOcrTds9zOM6w';

export const supabase = createClient(supabaseUrl, supabaseKey);

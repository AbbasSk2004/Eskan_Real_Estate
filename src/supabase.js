// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmgfvjfgstcpqmlhctlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZ2Z2amZnc3RjcHFtbGhjdGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMjkyMDUsImV4cCI6MjA2MjkwNTIwNX0.DJwJ7UZPzLPWneSkd2tJci2Vd0to2Bt5BUVu8eb-7aI';
export const supabase = createClient(supabaseUrl, supabaseKey);

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zmwssskzvyuffrrkiayk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptd3Nzc2t6dnl1ZmZycmtpYXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NjEwMTAsImV4cCI6MjA2MzAzNzAxMH0.uRru4msfLdxGNUr3QoFwwYJQEpPHjV_6sP5EBEEWDZU";

// Demo accounts for testing
export const DEMO_ACCOUNTS = {
  customer: { email: 'demo.customer@example.com', password: 'demo123' },
  barista: { email: 'demo.barista@example.com', password: 'demo123' },
  admin: { email: 'demo.admin@example.com', password: 'demo123' }
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

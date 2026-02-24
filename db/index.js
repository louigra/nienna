// db/index.js
// Exports the active database adapter singleton.
// To swap databases: replace SupabaseAdapter with your new adapter class
// and pass in the appropriate client. Nothing else in the codebase needs to change.

import { supabase } from '../auth-guard.js';
import { SupabaseAdapter } from './supabase-adapter.js';

export const db = new SupabaseAdapter(supabase);
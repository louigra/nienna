import { supabase } from "../auth-guard.js";
async function buildFilters() {

    let query = supabase
      .from('acepts')
      .select(`
        id, agency, cip, category, element, project
      `)
      .order('id', { ascending: true });
      
    const { data, error } = await query;

    if (error) { 
      appMsg.textContent = error.message; 
      return; 
    }

    currentRows = data || [];
    appMsg.textContent = `Loaded ${currentRows.length} row(s)`;
    renderTable(currentRows, getSelectedTier());
  }
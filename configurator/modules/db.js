// correct path from /configurator/modules/ to /auth-guard.js at project root
console.log('[db] module loaded'); // add this
import { supabase } from "../../auth-guard.js";

/**
 * Generic list with paging, filters, and optional per-table search columns.
 */
export async function listRows({
  table,
  select = "*",
  page = 1,
  pageSize = 25,
  order,
  filters = [],
  search,
  searchCols = [] // pass from table registry
}) {
  let q = supabase.from(table).select(select, { count: "exact" });

  // apply filters
  for (const f of filters) {
    const op = f.op || "eq";
    q = q[op](f.key, f.value);
  }

  // safe, per-table search (only if cols provided)
  if (search && search.trim() && searchCols.length) {
    const like = `%${search.trim()}%`;
    const ors = searchCols.map((c) => `${c}.ilike.${like}`).join(",");
    q = q.or(ors);
  }

  if (order?.col) q = q.order(order.col, { ascending: order.dir !== "desc" });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error) throw error;
  return { rows: data || [], total: count || 0 };
}

export async function insertRow(table, payload) {
  const { data, error } = await supabase
    .from(table)
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateRow(table, pk, id, payload) {
  const { data, error } = await supabase
    .from(table)
    .update(payload)
    .eq(pk, id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteRow(table, pk, id) {
  const { error } = await supabase.from(table).delete().eq(pk, id);
  if (error) throw error;
}
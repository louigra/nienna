// db/supabase-adapter.js
// Supabase implementation of the DB adapter interface.
// To swap databases, implement the same interface in a new file and
// update db/index.js to export it instead.

export class SupabaseAdapter {
  constructor(supabaseClient) {
    this._client = supabaseClient;
  }

  // Returns the current authenticated user's ID, or null if not logged in.
  async getUserId() {
    const { data: { user } } = await this._client.auth.getUser();
    return user?.id ?? null;
  }

  // Queries a table. Returns { rows, total }.
  // opts: { select, page, pageSize, order, filters, search, searchCols }
  async query(table, opts = {}) {
    const {
      select = '*',
      page = 1,
      pageSize = 25,
      order,
      filters = [],
      search,
      searchCols = [],
    } = opts;

    let q = this._client.from(table).select(select, { count: 'exact' });

    for (const f of filters) {
      if (f.op === 'notNull') {
        // .not(col, 'is', null) — not encodable as a 2-arg call
        q = q.not(f.key, 'is', null);
      } else {
        const op = f.op || 'eq';
        q = q[op](f.key, f.value);
      }
    }

    if (search && search.trim() && searchCols.length) {
      const like = `%${search.trim()}%`;
      const ors = searchCols.map(c => `${c}.ilike.${like}`).join(',');
      q = q.or(ors);
    }

    // order accepts a single { col, dir } or an array of them
    const orders = Array.isArray(order) ? order : (order?.col ? [order] : []);
    for (const o of orders) {
      q = q.order(o.col, { ascending: o.dir !== 'desc' });
    }

    // pageSize: null skips pagination and returns all rows
    if (pageSize) {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      q = q.range(from, to);
    }

    const { data, error, count } = await q;
    if (error) throw error;
    return { rows: data || [], total: count || 0 };
  }

  // Inserts a single row. Returns the inserted row.
  async insert(table, data) {
    const { data: row, error } = await this._client
      .from(table)
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return row;
  }

  // Updates a row by primary key. Returns the updated row, or null if RLS hides it.
  async update(table, pk, id, data) {
    const { data: row, error } = await this._client
      .from(table)
      .update(data)
      .eq(pk, id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return row;
  }

  // Deletes a row by primary key.
  async delete(table, pk, id) {
    const { error } = await this._client.from(table).delete().eq(pk, id);
    if (error) throw error;
  }

  // Looks up a single row by a specific field value. Used for idempotency checks.
  // Returns the row or null.
  async findOne(table, field, value, select = '*') {
    const { data, error } = await this._client
      .from(table)
      .select(select)
      .eq(field, value)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  // ── Dimensions helpers ──────────────────────────────────────────────────────

  // Returns a flat { fieldName: value } object for a given dimension.
  // Optionally pass fieldNames to restrict which fields are returned.
  // Values are returned as parsed JavaScript values (JSONB → JS).
  async getDimensionFields(dimensionId, fieldNames = null) {
    const { data, error } = await this._client
      .from('dimensions_custom_fields_values')
      .select('value, dimensions_custom_fields!inner(field_name)')
      .eq('dimension_id', dimensionId);
    if (error) throw error;
    const result = {};
    for (const row of data || []) {
      const name = row.dimensions_custom_fields?.field_name;
      if (!name) continue;
      if (fieldNames && !fieldNames.includes(name)) continue;
      result[name] = row.value;
    }
    return result;
  }

  // Upserts custom field values for a dimension.
  // dimensionType is required to look up the correct custom_field_id entries.
  // fields: { fieldName: jsValue, ... } — values are stored as JSONB.
  async setDimensionFields(dimensionId, dimensionType, fields) {
    const fieldNames = Object.keys(fields);
    if (!fieldNames.length) return;

    const { data: defs, error: defErr } = await this._client
      .from('dimensions_custom_fields')
      .select('id, field_name')
      .eq('dimension_type', dimensionType)
      .in('field_name', fieldNames);
    if (defErr) throw defErr;

    const defMap = Object.fromEntries((defs || []).map(d => [d.field_name, d.id]));
    const rows = fieldNames
      .filter(name => defMap[name] != null)
      .map(name => ({
        dimension_id: dimensionId,
        custom_field_id: defMap[name],
        value: fields[name],
      }));

    if (!rows.length) return;
    const { error } = await this._client
      .from('dimensions_custom_fields_values')
      .upsert(rows, { onConflict: 'dimension_id,custom_field_id' });
    if (error) throw error;
  }

  // Creates a dimension row and sets its custom fields in one call.
  // Returns the inserted dimensions row (with id, dimension_type, created_at, created_by).
  async createDimension(dimensionType, authorId, fields = {}) {
    const { data: dim, error } = await this._client
      .from('dimensions')
      .insert([{ dimension_type: dimensionType, created_by: authorId }])
      .select()
      .single();
    if (error) throw error;
    if (Object.keys(fields).length > 0) {
      await this.setDimensionFields(dim.id, dimensionType, fields);
    }
    return dim;
  }

  // Returns an array of dimension IDs of the given type where fieldName equals value.
  // For JSONB equality, value is JSON-serialized before comparison.
  async findDimensionsByField(dimensionType, fieldName, value) {
    const { data: def, error: defErr } = await this._client
      .from('dimensions_custom_fields')
      .select('id')
      .eq('dimension_type', dimensionType)
      .eq('field_name', fieldName)
      .maybeSingle();
    if (defErr) throw defErr;
    if (!def) return [];

    const { data, error } = await this._client
      .from('dimensions_custom_fields_values')
      .select('dimension_id')
      .eq('custom_field_id', def.id)
      .eq('value', JSON.stringify(value));
    if (error) throw error;
    return (data || []).map(r => r.dimension_id);
  }
}
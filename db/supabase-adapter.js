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

  // Updates a row by primary key. Returns the updated row.
  async update(table, pk, id, data) {
    const { data: row, error } = await this._client
      .from(table)
      .update(data)
      .eq(pk, id)
      .select()
      .single();
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
}
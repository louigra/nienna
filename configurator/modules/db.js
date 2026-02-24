
console.log('[db] module loaded');
import { db } from '../../db/index.js';

export async function listRows({ table, select, page, pageSize, order, filters, search, searchCols }) {
  return db.query(table, { select, page, pageSize, order, filters, search, searchCols });
}

export async function insertRow(table, payload) {
  return db.insert(table, payload);
}

export async function updateRow(table, pk, id, payload) {
  return db.update(table, pk, id, payload);
}

export async function deleteRow(table, pk, id) {
  return db.delete(table, pk, id);
}
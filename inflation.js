// inflation.js
import { supabase } from "./auth-guard.js";

let inflatorsData = null;
let inflatorsMap = null;
let inflatorsPromise = null;

/* ---------- helpers ---------- */
function normalizeInflators(rows) {
  return rows
    .map(r => ({
      year: Number(r.year),
      value: Number(r.inflation_index ?? r.value)
    }))
    .filter(r => Number.isFinite(r.year) && Number.isFinite(r.value));
}

function buildInflatorMap(rows) {
  const map = new Map();
  for (const r of rows) map.set(r.year, r.value);
  return map;
}

/* ---------- fetch once, cache forever ---------- */
export async function getInflatorsOnce() {
  if (inflatorsData) return inflatorsData;
  if (inflatorsPromise) return inflatorsPromise;

  inflatorsPromise = (async () => {
    
    const { data, error } = await supabase
      .from("inflators")
      .select("year, inflation_index")
      .order("year", { ascending: true });

    if (error) {
      console.error("[Inflation] load error:", error);
      inflatorsData = [];
      inflatorsMap = new Map();
      inflatorsPromise = null;
      return inflatorsData;
    }

    const normalized = normalizeInflators(data || []);
    inflatorsData = normalized;
    inflatorsMap = buildInflatorMap(normalized);
    
    return inflatorsData;
  })();

  return inflatorsPromise;
}

/* ---------- accessors ---------- */
export function getInflatorMap() {
  return inflatorsMap;
}

export function invalidateInflatorsCache() {
  inflatorsData = null;
  inflatorsMap = null;
  inflatorsPromise = null;
}

/* ---------- inflation helper ---------- */
export function inflate(value, fromYear, toYear) {
  const base = Number(value);
  if (!Number.isFinite(base)) return "";

  const fy = Number(fromYear);
  const ty = Number(toYear);
  if (!Number.isFinite(fy) || !Number.isFinite(ty)) return String(base);
  if (fy === ty || !inflatorsMap?.has?.(fy) || !inflatorsMap?.has?.(ty))
    return String(base);

  const factor = inflatorsMap.get(ty) / inflatorsMap.get(fy);
  const out = base * factor;
  return Number.isInteger(out) ? String(out) : out.toFixed(2);
}
// modules/tables.config.js
export const TABLES = {
  inflators: {
    title: "Inflators",
    table: "inflators",
    pk: "id",
    defaultSort: { col: "year", dir: "asc" },
    columns: [
      { key: "year", label: "Year", type: "number", required: true, editable: false, width: 100 },
      { key: "inflation_index", label: "Index", type: "number", step: "0.0001", required: true }
    ],
    filters: [],
    searchCols: [] // IMPORTANT: prevents broken OR when no text cols
  },
  aceps: {
    title: "ACEPs",
    table: "aceps",
    pk: "id",
    defaultSort: { col: "agency", dir: "asc" },
    columns: [
      { key: "agency", label: "Agency", type: "text", required: true, width: 200 },
      { key: "cip", label: "CIP", type: "number", required: true, width: 150 },
      { key: "category", label: "Category", type: "number", required: true, width: 150 },
      { key: "element", label: "Element", type: "number", required: true },
      { key: "project" , label: "Project", type: "number", required: false },
    ],
    filters: [
      { key: "agency", label: "Agency", options: ["T", "S", "L"] },
      { key: "cip", label: "CIP", options: [8, 9, 10] },
      { key: "category", label: "Category", options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }
    ],
    searchCols: ["agency"] 
  },
  cip_info : {
    title: "CIP Info",
    table: "cip_info",
    pk: "id",
    defaultSort: { col: "id", dir: "asc" },
    columns: [
      { key: "first_year", label: "FirstYear", type: "number", required: true, width: 150 },
      { key: "second_year", label: "SecondYear", type: "number", required: true, width: 150 },
      { key: "third_year", label: "ThirdYear", type: "number", required: true, width: 150 },
      { key: "fourth_year", label: "FourthYear", type: "number", required: true, width: 150 },
      { key: "fifth_year", label: "FifthYear", type: "number", required: true, width: 150 }
    ],
    filters: [],
    searchCols: [] 
  },
  tier_acep_envelope : {
    title: "Tier ACEP Envelope",
    table: "tier_acep_envelope",
    pk: "id",
    defaultSort: { col: "tier", dir: "asc" },
    columns: [
      { key: "tier", label: "Tier", type: "number", required: true, width: 100 },
      { key: "agency", label: "Agency", type: "text", required: true, width: 150 },
      { key: "cip", label: "CIP", type: "number", required: true, width: 100 },
      { key: "category", label: "Category", type: "number", required: true, width: 100 },
      { key: "element", label: "Element", type: "number", required: true, width: 100 },
      { key: "acep_envelope", label: "ACEP Envelope", type: "number", step: "0.01", required: true }
    ],
    filters: [
      { key: "tier", label: "Tier", options: [1, 2, 3] },
      { key: "agency", label: "Agency", options: ["T", "S", "L"] },
      { key: "cip", label: "CIP", options: [8, 9, 10] },
      { key: "category", label: "Category", options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }
    ],
    searchCols: []
  }
};
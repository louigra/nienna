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
      { key: "cip", label: "CIP", options: [7, 8, 9] },
      { key: "category", label: "Category", options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }
    ],
    searchCols: ["agency"] // IMPORTANT: prevents broken OR when no text cols
  }
};
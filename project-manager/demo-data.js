// DEMO DATA — placeholder until official budget API is connected.
// Replace with real data source; getOfficialBudget() is the integration point.
//
// To use with a real project: add an entry below keyed by the project's UUID
// from the projects_live table (the `id` column, from the URL ?project_id=...).

const OFFICIAL_BUDGETS = {

  // Example: swap 'PROJ-001' for a real project UUID to test project-specific data
  '1': {
    tasks: [
      { code: '1A', description: 'Preliminary Engineering', amount:  180000, award_year: 2025 },
      { code: '2B', description: 'Environmental / NEPA',   amount:   55000, award_year: 2025 },
      { code: '3C', description: 'Right of Way',           amount:   90000, award_year: 2026 },
      { code: '4D', description: 'Utilities',              amount:   75000, award_year: 2026 },
      { code: '5E', description: 'Construction',           amount: 1600000, award_year: 2027 },
    ],
    total: 2000000,
    milestone_dates : {
      'Design Start': '2025-02-15',
      'Design Complete': '2025-10-30',
      'Award': '2026-01-01',
      'Construction Start': '2026-05-01',
      'Construction Complete': '2027-11-15',
    },
  },

  '6': {
    tasks: [
      { code: '1A', description: 'Scoping & Survey',       amount:   40000, award_year: 2025 },
      { code: '2B', description: 'Design',                 amount:  210000, award_year: 2025 },
      { code: '3C', description: 'Construction',           amount:  950000, award_year: 2026 },
    ],
    total: 1200000,
    milestone_dates : {
      'Design Start': '2025-03-01',
      'Design Complete': '2025-11-15',
      'Award': '2026-02-15',
      'Construction Start': '2026-06-01',
      'Construction Complete': '2027-12-01',
    },
  },

  // ---- Demo projects for health-of-program Report 1 testing ----
  // Each entry below should have a corresponding row in projects_live with:
  //   cip=8 and the category/element noted in the comment.
  // Add these projects in the DB and give them estimates to see Report 1 populated.

  // Category 1, Element 1
  '2': {
    tasks: [
      { code: '1A', description: 'Preliminary Engineering', amount:  120000, award_year: 2025 },
      { code: '2B', description: 'Design',                 amount:  230000, award_year: 2025 },
      { code: '3C', description: 'Construction',           amount: 1450000, award_year: 2026 },
    ],
    total: 1800000,
    milestone_dates: {
      'Design Start': '2025-04-01',
      'Design Complete': '2026-01-15',
      'Award': '2026-03-01',
      'Construction Start': '2026-07-01',
      'Construction Complete': '2027-09-30',
    },
  },

  // Category 1, Element 2
  '3': {
    tasks: [
      { code: '1A', description: 'Scoping',      amount:   60000, award_year: 2025 },
      { code: '2B', description: 'Design',       amount:  340000, award_year: 2025 },
      { code: '3C', description: 'Construction', amount: 2100000, award_year: 2027 },
    ],
    total: 2500000,
    milestone_dates: {
      'Design Start': '2025-06-01',
      'Design Complete': '2026-02-28',
      'Award': '2026-06-01',
      'Construction Start': '2026-10-01',
      'Construction Complete': '2028-03-31',
    },
  },

  // Category 2, Element 1
  '4': {
    tasks: [
      { code: '1A', description: 'Preliminary Engineering', amount:  200000, award_year: 2025 },
      { code: '2B', description: 'Environmental',           amount:   80000, award_year: 2025 },
      { code: '3C', description: 'Design',                  amount:  420000, award_year: 2026 },
      { code: '4D', description: 'Construction',            amount: 3300000, award_year: 2027 },
    ],
    total: 4000000,
    milestone_dates: {
      'Design Start': '2025-05-01',
      'Design Complete': '2026-03-31',
      'Award': '2026-07-15',
      'Construction Start': '2026-11-01',
      'Construction Complete': '2028-06-30',
    },
  },

  // Category 2, Element 1 (second project)
  '5': {
    tasks: [
      { code: '1A', description: 'Scoping & Design', amount:  550000, award_year: 2026 },
      { code: '2B', description: 'Construction',     amount: 3950000, award_year: 2027 },
    ],
    total: 4500000,
    milestone_dates: {
      'Design Start': '2026-01-15',
      'Design Complete': '2026-11-30',
      'Award': '2027-02-01',
      'Construction Start': '2027-06-01',
      'Construction Complete': '2028-12-31',
    },
  },

  // Category 2, Element 3 — budget set low to demonstrate >110% overage flag
  '7': {
    tasks: [
      { code: '2Q', description: 'Design Consultant Services', amount:  1245642, award_year: 2025 },
      { code: '2Q', description: 'PMC', amount:  897634, award_year: 2025 },
      { code: '3C', description: 'Construction',           amount: 25000000, award_year: 2027 },
      { code: '3Q', description: 'Consultants',            amount: 12567812, award_year: 2027 },
      { code: '3L', description: 'TAL',            amount: 6730148.54, award_year: 2027 },
    ],
    total: 46441236.54,
    milestone_dates: {
      'Design Start': '2025-09-01',
      'Design Complete': '2026-04-30',
      'Award': '2027-02-01',
      'Construction Start': '2027-06-01',
      'Construction Complete': '2030-10-31',
    },
  },

  // Category 3, Element 1
  '8': {
    tasks: [
      { code: '1A', description: 'Planning & Design', amount:  310000, award_year: 2025 },
      { code: '2B', description: 'Construction',      amount: 2890000, award_year: 2027 },
    ],
    total: 3200000,
    milestone_dates: {
      'Design Start': '2025-03-15',
      'Design Complete': '2026-01-31',
      'Award': '2026-04-01',
      'Construction Start': '2026-08-01',
      'Construction Complete': '2028-02-28',
    },
  },

  // Category 3, Element 1 (second project)
  '9': {
    tasks: [
      { code: '1A', description: 'Scoping',      amount:   75000, award_year: 2025 },
      { code: '2B', description: 'Design',       amount:  225000, award_year: 2026 },
      { code: '3C', description: 'Construction', amount: 1700000, award_year: 2027 },
    ],
    total: 2000000,
    milestone_dates: {
      'Design Start': '2025-07-01',
      'Design Complete': '2026-05-31',
      'Award': '2026-09-01',
      'Construction Start': '2027-01-01',
      'Construction Complete': '2028-09-30',
    },
  },

  '10': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 30000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 10000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 10000000, award_year: 2025 },
    ],
    total: 50000000,
    milestone_dates: {
      'Design Start':          '2023-01-15',
      'Design Complete':       '2024-07-15',
      'Award':                 '2025-01-15',
      'Construction Start':    '2025-04-15',
      'Construction Complete': '2027-07-15',
    },
  },

  '9': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 37200000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 12400000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 12400000, award_year: 2025 },
    ],
    total: 62000000,
    milestone_dates: {
      'Design Start':          '2023-03-01',
      'Design Complete':       '2024-09-01',
      'Award':                 '2025-03-01',
      'Construction Start':    '2025-06-01',
      'Construction Complete': '2027-09-01',
    },
  },

  '11': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 45000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 15000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 15000000, award_year: 2025 },
    ],
    total: 75000000,
    milestone_dates: {
      'Design Start':          '2023-05-15',
      'Design Complete':       '2024-11-15',
      'Award':                 '2025-05-15',
      'Construction Start':    '2025-08-15',
      'Construction Complete': '2027-11-15',
    },
  },

  '15': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 54000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 18000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 18000000, award_year: 2025 },
    ],
    total: 90000000,
    milestone_dates: {
      'Design Start':          '2023-07-01',
      'Design Complete':       '2025-01-01',
      'Award':                 '2025-07-01',
      'Construction Start':    '2025-10-01',
      'Construction Complete': '2028-01-01',
    },
  },

  '14': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 66000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 22000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 22000000, award_year: 2025 },
    ],
    total: 110000000,
    milestone_dates: {
      'Design Start':          '2023-09-15',
      'Design Complete':       '2025-03-15',
      'Award':                 '2025-09-15',
      'Construction Start':    '2025-12-15',
      'Construction Complete': '2028-03-15',
    },
  },

  '13': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 78000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 26000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 26000000, award_year: 2025 },
    ],
    total: 130000000,
    milestone_dates: {
      'Design Start':          '2023-11-01',
      'Design Complete':       '2025-05-01',
      'Award':                 '2025-11-01',
      'Construction Start':    '2026-02-01',
      'Construction Complete': '2028-05-01',
    },
  },

  '12': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 90000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 30000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 30000000, award_year: 2025 },
    ],
    total: 150000000,
    milestone_dates: {
      'Design Start':          '2023-12-15',
      'Design Complete':       '2025-06-15',
      'Award':                 '2025-12-15',
      'Construction Start':    '2026-03-15',
      'Construction Complete': '2028-06-15',
    },
  },

  '8': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 99000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 33000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 33000000, award_year: 2026 },
    ],
    total: 165000000,
    milestone_dates: {
      'Design Start':          '2024-01-01',
      'Design Complete':       '2025-07-01',
      'Award':                 '2026-01-01',
      'Construction Start':    '2026-04-01',
      'Construction Complete': '2028-07-01',
    },
  },

  '16': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 108000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 36000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 36000000, award_year: 2026 },
    ],
    total: 180000000,
    milestone_dates: {
      'Design Start':          '2024-01-15',
      'Design Complete':       '2025-07-15',
      'Award':                 '2026-01-15',
      'Construction Start':    '2026-04-15',
      'Construction Complete': '2028-07-15',
    },
  },

  '17': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 120000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 40000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 40000000, award_year: 2026 },
    ],
    total: 200000000,
    milestone_dates: {
      'Design Start':          '2024-02-01',
      'Design Complete':       '2025-08-01',
      'Award':                 '2026-02-01',
      'Construction Start':    '2026-05-01',
      'Construction Complete': '2028-08-01',
    },
  },

  '18': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 51000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 17000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 17000000, award_year: 2026 },
    ],
    total: 85000000,
    milestone_dates: {
      'Design Start':          '2024-02-15',
      'Design Complete':       '2025-08-15',
      'Award':                 '2026-02-15',
      'Construction Start':    '2026-05-15',
      'Construction Complete': '2028-08-15',
    },
  },

  '23': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 72000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 24000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 24000000, award_year: 2026 },
    ],
    total: 120000000,
    milestone_dates: {
      'Design Start':          '2024-03-01',
      'Design Complete':       '2025-09-01',
      'Award':                 '2026-03-01',
      'Construction Start':    '2026-06-01',
      'Construction Complete': '2028-09-01',
    },
  },

  '19': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 33000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 11000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 11000000, award_year: 2026 },
    ],
    total: 55000000,
    milestone_dates: {
      'Design Start':          '2024-03-15',
      'Design Complete':       '2025-09-15',
      'Award':                 '2026-03-15',
      'Construction Start':    '2026-06-15',
      'Construction Complete': '2028-09-15',
    },
  },

  '20': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 57000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 19000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 19000000, award_year: 2026 },
    ],
    total: 95000000,
    milestone_dates: {
      'Design Start':          '2024-04-01',
      'Design Complete':       '2025-10-01',
      'Award':                 '2026-04-01',
      'Construction Start':    '2026-07-01',
      'Construction Complete': '2028-10-01',
    },
  },

  '21': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 84000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 28000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 28000000, award_year: 2026 },
    ],
    total: 140000000,
    milestone_dates: {
      'Design Start':          '2024-04-15',
      'Design Complete':       '2025-10-15',
      'Award':                 '2026-04-15',
      'Construction Start':    '2026-07-15',
      'Construction Complete': '2028-10-15',
    },
  },

  '22': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 102000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 34000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 34000000, award_year: 2026 },
    ],
    total: 170000000,
    milestone_dates: {
      'Design Start':          '2024-05-01',
      'Design Complete':       '2025-11-01',
      'Award':                 '2026-05-01',
      'Construction Start':    '2026-08-01',
      'Construction Complete': '2028-11-01',
    },
  },

  '24': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 45000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 15000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 15000000, award_year: 2026 },
    ],
    total: 75000000,
    milestone_dates: {
      'Design Start':          '2024-05-15',
      'Design Complete':       '2025-11-15',
      'Award':                 '2026-05-15',
      'Construction Start':    '2026-08-15',
      'Construction Complete': '2028-11-15',
    },
  },

  '25': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 69000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 23000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 23000000, award_year: 2026 },
    ],
    total: 115000000,
    milestone_dates: {
      'Design Start':          '2024-06-01',
      'Design Complete':       '2025-12-01',
      'Award':                 '2026-06-01',
      'Construction Start':    '2026-09-01',
      'Construction Complete': '2028-12-01',
    },
  },

  '26': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 96000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 32000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 32000000, award_year: 2026 },
    ],
    total: 160000000,
    milestone_dates: {
      'Design Start':          '2024-06-15',
      'Design Complete':       '2025-12-15',
      'Award':                 '2026-06-15',
      'Construction Start':    '2026-09-15',
      'Construction Complete': '2028-12-15',
    },
  },

  '27': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 114000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 38000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 38000000, award_year: 2026 },
    ],
    total: 190000000,
    milestone_dates: {
      'Design Start':          '2024-07-01',
      'Design Complete':       '2026-01-01',
      'Award':                 '2026-07-01',
      'Construction Start':    '2026-10-01',
      'Construction Complete': '2029-01-01',
    },
  },

  '28': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 39000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 13000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 13000000, award_year: 2026 },
    ],
    total: 65000000,
    milestone_dates: {
      'Design Start':          '2024-07-15',
      'Design Complete':       '2026-01-15',
      'Award':                 '2026-07-15',
      'Construction Start':    '2026-10-15',
      'Construction Complete': '2029-01-15',
    },
  },

  '29': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 60000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 20000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 20000000, award_year: 2026 },
    ],
    total: 100000000,
    milestone_dates: {
      'Design Start':          '2024-08-01',
      'Design Complete':       '2026-02-01',
      'Award':                 '2026-08-01',
      'Construction Start':    '2026-11-01',
      'Construction Complete': '2029-02-01',
    },
  },

  '30': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 48000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 16000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 16000000, award_year: 2026 },
    ],
    total: 80000000,
    milestone_dates: {
      'Design Start':          '2024-08-15',
      'Design Complete':       '2026-02-15',
      'Award':                 '2026-08-15',
      'Construction Start':    '2026-11-15',
      'Construction Complete': '2029-02-15',
    },
  },

  '31': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 75000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 25000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 25000000, award_year: 2026 },
    ],
    total: 125000000,
    milestone_dates: {
      'Design Start':          '2024-09-01',
      'Design Complete':       '2026-03-01',
      'Award':                 '2026-09-01',
      'Construction Start':    '2026-12-01',
      'Construction Complete': '2029-03-01',
    },
  },

  '32': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 87000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 29000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 29000000, award_year: 2026 },
    ],
    total: 145000000,
    milestone_dates: {
      'Design Start':          '2024-09-15',
      'Design Complete':       '2026-03-15',
      'Award':                 '2026-09-15',
      'Construction Start':    '2026-12-15',
      'Construction Complete': '2029-03-15',
    },
  },

  '34': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 105000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 35000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 35000000, award_year: 2026 },
    ],
    total: 175000000,
    milestone_dates: {
      'Design Start':          '2024-10-01',
      'Design Complete':       '2026-04-01',
      'Award':                 '2026-10-01',
      'Construction Start':    '2027-01-01',
      'Construction Complete': '2029-04-01',
    },
  },

  '33': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 36000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 12000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 12000000, award_year: 2026 },
    ],
    total: 60000000,
    milestone_dates: {
      'Design Start':          '2024-11-15',
      'Design Complete':       '2026-05-15',
      'Award':                 '2026-11-15',
      'Construction Start':    '2027-02-15',
      'Construction Complete': '2029-05-15',
    },
  },

  '35': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 52800000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 17600000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 17600000, award_year: 2026 },
    ],
    total: 88000000,
    milestone_dates: {
      'Design Start':          '2024-12-01',
      'Design Complete':       '2026-06-01',
      'Award':                 '2026-12-01',
      'Construction Start':    '2027-03-01',
      'Construction Complete': '2029-06-01',
    },
  },

  '36': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 78000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 26000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 26000000, award_year: 2027 },
    ],
    total: 130000000,
    milestone_dates: {
      'Design Start':          '2025-01-15',
      'Design Complete':       '2026-07-15',
      'Award':                 '2027-01-15',
      'Construction Start':    '2027-04-15',
      'Construction Complete': '2029-07-15',
    },
  },

  '37': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 93000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 31000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 31000000, award_year: 2027 },
    ],
    total: 155000000,
    milestone_dates: {
      'Design Start':          '2025-02-01',
      'Design Complete':       '2026-08-01',
      'Award':                 '2027-02-01',
      'Construction Start':    '2027-05-01',
      'Construction Complete': '2029-08-01',
    },
  },

  '39': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 42000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 14000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 14000000, award_year: 2027 },
    ],
    total: 70000000,
    milestone_dates: {
      'Design Start':          '2025-03-15',
      'Design Complete':       '2026-09-15',
      'Award':                 '2027-03-15',
      'Construction Start':    '2027-06-15',
      'Construction Complete': '2029-09-15',
    },
  },

  '38': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 63000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 21000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 21000000, award_year: 2027 },
    ],
    total: 105000000,
    milestone_dates: {
      'Design Start':          '2025-04-01',
      'Design Complete':       '2026-10-01',
      'Award':                 '2027-04-01',
      'Construction Start':    '2027-07-01',
      'Construction Complete': '2029-10-01',
    },
  },

  '40': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 111000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 37000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 37000000, award_year: 2027 },
    ],
    total: 185000000,
    milestone_dates: {
      'Design Start':          '2025-04-15',
      'Design Complete':       '2026-10-15',
      'Award':                 '2027-04-15',
      'Construction Start':    '2027-07-15',
      'Construction Complete': '2029-10-15',
    },
  },

  '41': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 120000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 40000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 40000000, award_year: 2027 },
    ],
    total: 200000000,
    milestone_dates: {
      'Design Start':          '2025-05-01',
      'Design Complete':       '2026-11-01',
      'Award':                 '2027-05-01',
      'Construction Start':    '2027-08-01',
      'Construction Complete': '2029-11-01',
    },
  },

  '42': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 54000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 18000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 18000000, award_year: 2027 },
    ],
    total: 90000000,
    milestone_dates: {
      'Design Start':          '2025-05-15',
      'Design Complete':       '2026-11-15',
      'Award':                 '2027-05-15',
      'Construction Start':    '2027-08-15',
      'Construction Complete': '2029-11-15',
    },
  },

  '43': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 81000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 27000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 27000000, award_year: 2027 },
    ],
    total: 135000000,
    milestone_dates: {
      'Design Start':          '2025-06-01',
      'Design Complete':       '2026-12-01',
      'Award':                 '2027-06-01',
      'Construction Start':    '2027-09-01',
      'Construction Complete': '2029-12-01',
    },
  },

  '44': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 66000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 22000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 22000000, award_year: 2027 },
    ],
    total: 110000000,
    milestone_dates: {
      'Design Start':          '2025-06-15',
      'Design Complete':       '2026-12-15',
      'Award':                 '2027-06-15',
      'Construction Start':    '2027-09-15',
      'Construction Complete': '2029-12-15',
    },
  },

  '45': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 96000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 32000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 32000000, award_year: 2027 },
    ],
    total: 160000000,
    milestone_dates: {
      'Design Start':          '2025-07-01',
      'Design Complete':       '2027-01-01',
      'Award':                 '2027-07-01',
      'Construction Start':    '2027-10-01',
      'Construction Complete': '2030-01-01',
    },
  },

  '46': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 33000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 11000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 11000000, award_year: 2027 },
    ],
    total: 55000000,
    milestone_dates: {
      'Design Start':          '2025-07-15',
      'Design Complete':       '2027-01-15',
      'Award':                 '2027-07-15',
      'Construction Start':    '2027-10-15',
      'Construction Complete': '2030-01-15',
    },
  },

  '47': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 48000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 16000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 16000000, award_year: 2027 },
    ],
    total: 80000000,
    milestone_dates: {
      'Design Start':          '2025-08-01',
      'Design Complete':       '2027-02-01',
      'Award':                 '2027-08-01',
      'Construction Start':    '2027-11-01',
      'Construction Complete': '2030-02-01',
    },
  },

  '49': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 72000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 24000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 24000000, award_year: 2027 },
    ],
    total: 120000000,
    milestone_dates: {
      'Design Start':          '2025-09-15',
      'Design Complete':       '2027-03-15',
      'Award':                 '2027-09-15',
      'Construction Start':    '2027-12-15',
      'Construction Complete': '2030-03-15',
    },
  },

  '48': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 102000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 34000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 34000000, award_year: 2027 },
    ],
    total: 170000000,
    milestone_dates: {
      'Design Start':          '2025-11-01',
      'Design Complete':       '2027-05-01',
      'Award':                 '2027-11-01',
      'Construction Start':    '2028-02-01',
      'Construction Complete': '2030-05-01',
    },
  },

  '50': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 57000000,  award_year: 2028 },
      { code: '3L', description: 'TA Labor',     amount: 19000000, award_year: 2028 },
      { code: '3Q', description: 'EFA',           amount: 19000000, award_year: 2028 },
    ],
    total: 95000000,
    milestone_dates: {
      'Design Start':          '2026-02-15',
      'Design Complete':       '2027-08-15',
      'Award':                 '2028-02-15',
      'Construction Start':    '2028-05-15',
      'Construction Complete': '2030-08-15',
    },
  },

  '52': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 84000000,  award_year: 2028 },
      { code: '3L', description: 'TA Labor',     amount: 28000000, award_year: 2028 },
      { code: '3Q', description: 'EFA',           amount: 28000000, award_year: 2028 },
    ],
    total: 140000000,
    milestone_dates: {
      'Design Start':          '2026-05-01',
      'Design Complete':       '2027-11-01',
      'Award':                 '2028-05-01',
      'Construction Start':    '2028-08-01',
      'Construction Complete': '2030-11-01',
    },
  },

  '51': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 30000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 10000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 10000000, award_year: 2025 },
    ],
    total: 50000000,
    milestone_dates: {
      'Design Start':          '2023-01-15',
      'Design Complete':       '2024-07-15',
      'Award':                 '2025-01-15',
      'Construction Start':    '2025-04-15',
      'Construction Complete': '2027-07-15',
    },
  },

  '53': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 37200000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 12400000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 12400000, award_year: 2025 },
    ],
    total: 62000000,
    milestone_dates: {
      'Design Start':          '2023-03-01',
      'Design Complete':       '2024-09-01',
      'Award':                 '2025-03-01',
      'Construction Start':    '2025-06-01',
      'Construction Complete': '2027-09-01',
    },
  },

  '54': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 45000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 15000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 15000000, award_year: 2025 },
    ],
    total: 75000000,
    milestone_dates: {
      'Design Start':          '2023-05-15',
      'Design Complete':       '2024-11-15',
      'Award':                 '2025-05-15',
      'Construction Start':    '2025-08-15',
      'Construction Complete': '2027-11-15',
    },
  },

  '56': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 54000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 18000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 18000000, award_year: 2025 },
    ],
    total: 90000000,
    milestone_dates: {
      'Design Start':          '2023-07-01',
      'Design Complete':       '2025-01-01',
      'Award':                 '2025-07-01',
      'Construction Start':    '2025-10-01',
      'Construction Complete': '2028-01-01',
    },
  },

  '57': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 66000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 22000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 22000000, award_year: 2025 },
    ],
    total: 110000000,
    milestone_dates: {
      'Design Start':          '2023-09-15',
      'Design Complete':       '2025-03-15',
      'Award':                 '2025-09-15',
      'Construction Start':    '2025-12-15',
      'Construction Complete': '2028-03-15',
    },
  },

  '55': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 78000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 26000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 26000000, award_year: 2025 },
    ],
    total: 130000000,
    milestone_dates: {
      'Design Start':          '2023-11-01',
      'Design Complete':       '2025-05-01',
      'Award':                 '2025-11-01',
      'Construction Start':    '2026-02-01',
      'Construction Complete': '2028-05-01',
    },
  },

  '58': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 90000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 30000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 30000000, award_year: 2025 },
    ],
    total: 150000000,
    milestone_dates: {
      'Design Start':          '2023-12-15',
      'Design Complete':       '2025-06-15',
      'Award':                 '2025-12-15',
      'Construction Start':    '2026-03-15',
      'Construction Complete': '2028-06-15',
    },
  },

  '59': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 99000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 33000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 33000000, award_year: 2026 },
    ],
    total: 165000000,
    milestone_dates: {
      'Design Start':          '2024-01-01',
      'Design Complete':       '2025-07-01',
      'Award':                 '2026-01-01',
      'Construction Start':    '2026-04-01',
      'Construction Complete': '2028-07-01',
    },
  },

  '60': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 108000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 36000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 36000000, award_year: 2026 },
    ],
    total: 180000000,
    milestone_dates: {
      'Design Start':          '2024-01-15',
      'Design Complete':       '2025-07-15',
      'Award':                 '2026-01-15',
      'Construction Start':    '2026-04-15',
      'Construction Complete': '2028-07-15',
    },
  },

  '61': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 120000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 40000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 40000000, award_year: 2026 },
    ],
    total: 200000000,
    milestone_dates: {
      'Design Start':          '2024-02-01',
      'Design Complete':       '2025-08-01',
      'Award':                 '2026-02-01',
      'Construction Start':    '2026-05-01',
      'Construction Complete': '2028-08-01',
    },
  },

  '62': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 51000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 17000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 17000000, award_year: 2026 },
    ],
    total: 85000000,
    milestone_dates: {
      'Design Start':          '2024-02-15',
      'Design Complete':       '2025-08-15',
      'Award':                 '2026-02-15',
      'Construction Start':    '2026-05-15',
      'Construction Complete': '2028-08-15',
    },
  },

  '63': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 72000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 24000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 24000000, award_year: 2026 },
    ],
    total: 120000000,
    milestone_dates: {
      'Design Start':          '2024-03-01',
      'Design Complete':       '2025-09-01',
      'Award':                 '2026-03-01',
      'Construction Start':    '2026-06-01',
      'Construction Complete': '2028-09-01',
    },
  },

  '64': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 33000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 11000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 11000000, award_year: 2026 },
    ],
    total: 55000000,
    milestone_dates: {
      'Design Start':          '2024-03-15',
      'Design Complete':       '2025-09-15',
      'Award':                 '2026-03-15',
      'Construction Start':    '2026-06-15',
      'Construction Complete': '2028-09-15',
    },
  },

  '66': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 57000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 19000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 19000000, award_year: 2026 },
    ],
    total: 95000000,
    milestone_dates: {
      'Design Start':          '2024-04-01',
      'Design Complete':       '2025-10-01',
      'Award':                 '2026-04-01',
      'Construction Start':    '2026-07-01',
      'Construction Complete': '2028-10-01',
    },
  },

  '65': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 84000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 28000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 28000000, award_year: 2026 },
    ],
    total: 140000000,
    milestone_dates: {
      'Design Start':          '2024-04-15',
      'Design Complete':       '2025-10-15',
      'Award':                 '2026-04-15',
      'Construction Start':    '2026-07-15',
      'Construction Complete': '2028-10-15',
    },
  },

  '67': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 102000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 34000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 34000000, award_year: 2026 },
    ],
    total: 170000000,
    milestone_dates: {
      'Design Start':          '2024-05-01',
      'Design Complete':       '2025-11-01',
      'Award':                 '2026-05-01',
      'Construction Start':    '2026-08-01',
      'Construction Complete': '2028-11-01',
    },
  },

  '68': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 45000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 15000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 15000000, award_year: 2026 },
    ],
    total: 75000000,
    milestone_dates: {
      'Design Start':          '2024-05-15',
      'Design Complete':       '2025-11-15',
      'Award':                 '2026-05-15',
      'Construction Start':    '2026-08-15',
      'Construction Complete': '2028-11-15',
    },
  },

  '69': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 69000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 23000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 23000000, award_year: 2026 },
    ],
    total: 115000000,
    milestone_dates: {
      'Design Start':          '2024-06-01',
      'Design Complete':       '2025-12-01',
      'Award':                 '2026-06-01',
      'Construction Start':    '2026-09-01',
      'Construction Complete': '2028-12-01',
    },
  },

  '70': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 96000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 32000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 32000000, award_year: 2026 },
    ],
    total: 160000000,
    milestone_dates: {
      'Design Start':          '2024-06-15',
      'Design Complete':       '2025-12-15',
      'Award':                 '2026-06-15',
      'Construction Start':    '2026-09-15',
      'Construction Complete': '2028-12-15',
    },
  },

  '71': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 114000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 38000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 38000000, award_year: 2026 },
    ],
    total: 190000000,
    milestone_dates: {
      'Design Start':          '2024-07-01',
      'Design Complete':       '2026-01-01',
      'Award':                 '2026-07-01',
      'Construction Start':    '2026-10-01',
      'Construction Complete': '2029-01-01',
    },
  },

  '73': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 39000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 13000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 13000000, award_year: 2026 },
    ],
    total: 65000000,
    milestone_dates: {
      'Design Start':          '2024-07-15',
      'Design Complete':       '2026-01-15',
      'Award':                 '2026-07-15',
      'Construction Start':    '2026-10-15',
      'Construction Complete': '2029-01-15',
    },
  },

  '72': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 60000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 20000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 20000000, award_year: 2026 },
    ],
    total: 100000000,
    milestone_dates: {
      'Design Start':          '2024-08-01',
      'Design Complete':       '2026-02-01',
      'Award':                 '2026-08-01',
      'Construction Start':    '2026-11-01',
      'Construction Complete': '2029-02-01',
    },
  },

  '74': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 48000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 16000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 16000000, award_year: 2026 },
    ],
    total: 80000000,
    milestone_dates: {
      'Design Start':          '2024-08-15',
      'Design Complete':       '2026-02-15',
      'Award':                 '2026-08-15',
      'Construction Start':    '2026-11-15',
      'Construction Complete': '2029-02-15',
    },
  },

  '75': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 75000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 25000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 25000000, award_year: 2026 },
    ],
    total: 125000000,
    milestone_dates: {
      'Design Start':          '2024-09-01',
      'Design Complete':       '2026-03-01',
      'Award':                 '2026-09-01',
      'Construction Start':    '2026-12-01',
      'Construction Complete': '2029-03-01',
    },
  },

  '76': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 87000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 29000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 29000000, award_year: 2026 },
    ],
    total: 145000000,
    milestone_dates: {
      'Design Start':          '2024-09-15',
      'Design Complete':       '2026-03-15',
      'Award':                 '2026-09-15',
      'Construction Start':    '2026-12-15',
      'Construction Complete': '2029-03-15',
    },
  },

  '77': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 105000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 35000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 35000000, award_year: 2026 },
    ],
    total: 175000000,
    milestone_dates: {
      'Design Start':          '2024-10-01',
      'Design Complete':       '2026-04-01',
      'Award':                 '2026-10-01',
      'Construction Start':    '2027-01-01',
      'Construction Complete': '2029-04-01',
    },
  },

  '78': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 36000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 12000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 12000000, award_year: 2026 },
    ],
    total: 60000000,
    milestone_dates: {
      'Design Start':          '2024-11-15',
      'Design Complete':       '2026-05-15',
      'Award':                 '2026-11-15',
      'Construction Start':    '2027-02-15',
      'Construction Complete': '2029-05-15',
    },
  },

  '79': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 52800000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 17600000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 17600000, award_year: 2026 },
    ],
    total: 88000000,
    milestone_dates: {
      'Design Start':          '2024-12-01',
      'Design Complete':       '2026-06-01',
      'Award':                 '2026-9-15',
      'Construction Start':    '2027-03-01',
      'Construction Complete': '2029-06-01',
    },
  },

  '80': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 78000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 26000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 26000000, award_year: 2027 },
    ],
    total: 130000000,
    milestone_dates: {
      'Design Start':          '2025-01-15',
      'Design Complete':       '2026-07-15',
      'Award':                 '2027-01-15',
      'Construction Start':    '2027-04-15',
      'Construction Complete': '2029-07-15',
    },
  },

  '81': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 93000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 31000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 31000000, award_year: 2027 },
    ],
    total: 155000000,
    milestone_dates: {
      'Design Start':          '2025-02-01',
      'Design Complete':       '2026-08-01',
      'Award':                 '2027-02-01',
      'Construction Start':    '2027-05-01',
      'Construction Complete': '2029-08-01',
    },
  },

  '82': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 42000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 14000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 14000000, award_year: 2027 },
    ],
    total: 70000000,
    milestone_dates: {
      'Design Start':          '2025-03-15',
      'Design Complete':       '2026-09-15',
      'Award':                 '2027-03-15',
      'Construction Start':    '2027-06-15',
      'Construction Complete': '2029-09-15',
    },
  },

  '83': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 63000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 21000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 21000000, award_year: 2027 },
    ],
    total: 105000000,
    milestone_dates: {
      'Design Start':          '2025-04-01',
      'Design Complete':       '2026-10-01',
      'Award':                 '2027-04-01',
      'Construction Start':    '2027-07-01',
      'Construction Complete': '2029-10-01',
    },
  },

  '85': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 111000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 37000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 37000000, award_year: 2027 },
    ],
    total: 185000000,
    milestone_dates: {
      'Design Start':          '2025-04-15',
      'Design Complete':       '2026-10-15',
      'Award':                 '2027-04-15',
      'Construction Start':    '2027-07-15',
      'Construction Complete': '2029-10-15',
    },
  },

  '84': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 120000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 40000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 40000000, award_year: 2027 },
    ],
    total: 200000000,
    milestone_dates: {
      'Design Start':          '2025-05-01',
      'Design Complete':       '2026-11-01',
      'Award':                 '2027-05-01',
      'Construction Start':    '2027-08-01',
      'Construction Complete': '2029-11-01',
    },
  },

  '86': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 54000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 18000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 18000000, award_year: 2027 },
    ],
    total: 90000000,
    milestone_dates: {
      'Design Start':          '2025-05-15',
      'Design Complete':       '2026-11-15',
      'Award':                 '2027-05-15',
      'Construction Start':    '2027-08-15',
      'Construction Complete': '2029-11-15',
    },
  },

  '87': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 81000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 27000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 27000000, award_year: 2027 },
    ],
    total: 135000000,
    milestone_dates: {
      'Design Start':          '2025-06-01',
      'Design Complete':       '2026-12-01',
      'Award':                 '2027-06-01',
      'Construction Start':    '2027-09-01',
      'Construction Complete': '2029-12-01',
    },
  },

  '88': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 66000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 22000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 22000000, award_year: 2027 },
    ],
    total: 110000000,
    milestone_dates: {
      'Design Start':          '2025-06-15',
      'Design Complete':       '2026-12-15',
      'Award':                 '2027-06-15',
      'Construction Start':    '2027-09-15',
      'Construction Complete': '2029-12-15',
    },
  },

  '89': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 96000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 32000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 32000000, award_year: 2027 },
    ],
    total: 160000000,
    milestone_dates: {
      'Design Start':          '2025-07-01',
      'Design Complete':       '2027-01-01',
      'Award':                 '2027-07-01',
      'Construction Start':    '2027-10-01',
      'Construction Complete': '2030-01-01',
    },
  },

  '90': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 33000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 11000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 11000000, award_year: 2027 },
    ],
    total: 55000000,
    milestone_dates: {
      'Design Start':          '2025-07-15',
      'Design Complete':       '2027-01-15',
      'Award':                 '2027-07-15',
      'Construction Start':    '2027-10-15',
      'Construction Complete': '2030-01-15',
    },
  },

  '92': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 48000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 16000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 16000000, award_year: 2027 },
    ],
    total: 80000000,
    milestone_dates: {
      'Design Start':          '2025-08-01',
      'Design Complete':       '2027-02-01',
      'Award':                 '2026-12-31',
      'Construction Start':    '2027-11-01',
      'Construction Complete': '2030-02-01',
    },
  },

  '91': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 72000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 24000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 24000000, award_year: 2027 },
    ],
    total: 120000000,
    milestone_dates: {
      'Design Start':          '2025-09-15',
      'Design Complete':       '2027-03-15',
      'Award':                 '2027-09-15',
      'Construction Start':    '2027-12-15',
      'Construction Complete': '2030-03-15',
    },
  },

  '93': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 102000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 34000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 34000000, award_year: 2027 },
    ],
    total: 170000000,
    milestone_dates: {
      'Design Start':          '2025-11-01',
      'Design Complete':       '2027-05-01',
      'Award':                 '2027-11-01',
      'Construction Start':    '2028-02-01',
      'Construction Complete': '2030-05-01',
    },
  },

  '94': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 57000000,  award_year: 2028 },
      { code: '3L', description: 'TA Labor',     amount: 19000000, award_year: 2028 },
      { code: '3Q', description: 'EFA',           amount: 19000000, award_year: 2028 },
    ],
    total: 95000000,
    milestone_dates: {
      'Design Start':          '2026-02-15',
      'Design Complete':       '2027-08-15',
      'Award':                 '2028-02-15',
      'Construction Start':    '2028-05-15',
      'Construction Complete': '2030-08-15',
    },
  },

  '95': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 84000000,  award_year: 2028 },
      { code: '3L', description: 'TA Labor',     amount: 28000000, award_year: 2028 },
      { code: '3Q', description: 'EFA',           amount: 28000000, award_year: 2028 },
    ],
    total: 140000000,
    milestone_dates: {
      'Design Start':          '2026-05-01',
      'Design Complete':       '2027-11-01',
      'Award':                 '2028-05-01',
      'Construction Start':    '2028-08-01',
      'Construction Complete': '2030-11-01',
    },
  },

  '96': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 30000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 10000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 10000000, award_year: 2025 },
    ],
    total: 50000000,
    milestone_dates: {
      'Design Start':          '2023-01-15',
      'Design Complete':       '2024-07-15',
      'Award':                 '2026-12-31',
      'Construction Start':    '2025-04-15',
      'Construction Complete': '2027-07-15',
    },
  },

  '97': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 37200000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 12400000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 12400000, award_year: 2025 },
    ],
    total: 62000000,
    milestone_dates: {
      'Design Start':          '2023-03-01',
      'Design Complete':       '2024-09-01',
      'Award':                 '2025-03-01',
      'Construction Start':    '2025-06-01',
      'Construction Complete': '2027-09-01',
    },
  },

  '98': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 45000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 15000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 15000000, award_year: 2025 },
    ],
    total: 75000000,
    milestone_dates: {
      'Design Start':          '2023-05-15',
      'Design Complete':       '2024-11-15',
      'Award':                 '2025-05-15',
      'Construction Start':    '2025-08-15',
      'Construction Complete': '2027-11-15',
    },
  },

  '99': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 54000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 18000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 18000000, award_year: 2025 },
    ],
    total: 90000000,
    milestone_dates: {
      'Design Start':          '2023-07-01',
      'Design Complete':       '2025-01-01',
      'Award':                 '2025-07-01',
      'Construction Start':    '2025-10-01',
      'Construction Complete': '2028-01-01',
    },
  },

  '101': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 66000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 22000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 22000000, award_year: 2025 },
    ],
    total: 110000000,
    milestone_dates: {
      'Design Start':          '2023-09-15',
      'Design Complete':       '2025-03-15',
      'Award':                 '2025-09-15',
      'Construction Start':    '2025-12-15',
      'Construction Complete': '2028-03-15',
    },
  },

  '100': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 78000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 26000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 26000000, award_year: 2025 },
    ],
    total: 130000000,
    milestone_dates: {
      'Design Start':          '2023-11-01',
      'Design Complete':       '2025-05-01',
      'Award':                 '2025-12-31',
      'Construction Start':    '2026-02-01',
      'Construction Complete': '2028-05-01',
    },
  },

  '102': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 90000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 30000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 30000000, award_year: 2025 },
    ],
    total: 150000000,
    milestone_dates: {
      'Design Start':          '2023-12-15',
      'Design Complete':       '2025-06-15',
      'Award':                 '2025-12-15',
      'Construction Start':    '2026-03-15',
      'Construction Complete': '2028-06-15',
    },
  },

  '104': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 99000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 33000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 33000000, award_year: 2026 },
    ],
    total: 165000000,
    milestone_dates: {
      'Design Start':          '2024-01-01',
      'Design Complete':       '2025-07-01',
      'Award':                 '2026-01-01',
      'Construction Start':    '2026-04-01',
      'Construction Complete': '2028-07-01',
    },
  },

  '103': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 108000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 36000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 36000000, award_year: 2026 },
    ],
    total: 180000000,
    milestone_dates: {
      'Design Start':          '2024-01-15',
      'Design Complete':       '2025-07-15',
      'Award':                 '2026-01-15',
      'Construction Start':    '2026-04-15',
      'Construction Complete': '2028-07-15',
    },
  },

  '105': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 120000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 40000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 40000000, award_year: 2026 },
    ],
    total: 200000000,
    milestone_dates: {
      'Design Start':          '2024-02-01',
      'Design Complete':       '2025-08-01',
      'Award':                 '2026-02-01',
      'Construction Start':    '2026-05-01',
      'Construction Complete': '2028-08-01',
    },
  },

  '107': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 51000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 17000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 17000000, award_year: 2026 },
    ],
    total: 85000000,
    milestone_dates: {
      'Design Start':          '2024-02-15',
      'Design Complete':       '2025-08-15',
      'Award':                 '2026-02-15',
      'Construction Start':    '2026-05-15',
      'Construction Complete': '2028-08-15',
    },
  },

  '106': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 72000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 24000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 24000000, award_year: 2026 },
    ],
    total: 120000000,
    milestone_dates: {
      'Design Start':          '2024-03-01',
      'Design Complete':       '2025-09-01',
      'Award':                 '2026-03-01',
      'Construction Start':    '2026-06-01',
      'Construction Complete': '2028-09-01',
    },
  },

  '109': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 33000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 11000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 11000000, award_year: 2026 },
    ],
    total: 55000000,
    milestone_dates: {
      'Design Start':          '2024-03-15',
      'Design Complete':       '2025-09-15',
      'Award':                 '2026-09-15',
      'Construction Start':    '2026-06-15',
      'Construction Complete': '2028-09-15',
    },
  },

  '108': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 57000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 19000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 19000000, award_year: 2026 },
    ],
    total: 95000000,
    milestone_dates: {
      'Design Start':          '2024-04-01',
      'Design Complete':       '2025-10-01',
      'Award':                 '2026-04-01',
      'Construction Start':    '2026-07-01',
      'Construction Complete': '2028-10-01',
    },
  },

  '110': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 84000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 28000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 28000000, award_year: 2026 },
    ],
    total: 140000000,
    milestone_dates: {
      'Design Start':          '2024-04-15',
      'Design Complete':       '2025-10-15',
      'Award':                 '2026-04-15',
      'Construction Start':    '2026-07-15',
      'Construction Complete': '2028-10-15',
    },
  },

  '112': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 102000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 34000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 34000000, award_year: 2026 },
    ],
    total: 170000000,
    milestone_dates: {
      'Design Start':          '2024-05-01',
      'Design Complete':       '2025-11-01',
      'Award':                 '2026-05-01',
      'Construction Start':    '2026-08-01',
      'Construction Complete': '2028-11-01',
    },
  },

  '111': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 45000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 15000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 15000000, award_year: 2026 },
    ],
    total: 75000000,
    milestone_dates: {
      'Design Start':          '2024-05-15',
      'Design Complete':       '2025-11-15',
      'Award':                 '2026-05-15',
      'Construction Start':    '2026-08-15',
      'Construction Complete': '2028-11-15',
    },
  },

  '113': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 69000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 23000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 23000000, award_year: 2026 },
    ],
    total: 115000000,
    milestone_dates: {
      'Design Start':          '2024-06-01',
      'Design Complete':       '2025-12-01',
      'Award':                 '2026-06-01',
      'Construction Start':    '2026-09-01',
      'Construction Complete': '2028-12-01',
    },
  },

  '114': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 96000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 32000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 32000000, award_year: 2026 },
    ],
    total: 160000000,
    milestone_dates: {
      'Design Start':          '2024-06-15',
      'Design Complete':       '2025-12-15',
      'Award':                 '2026-06-15',
      'Construction Start':    '2026-09-15',
      'Construction Complete': '2028-12-15',
    },
  },

  '115': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 114000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 38000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 38000000, award_year: 2026 },
    ],
    total: 190000000,
    milestone_dates: {
      'Design Start':          '2024-07-01',
      'Design Complete':       '2026-01-01',
      'Award':                 '2026-07-01',
      'Construction Start':    '2026-10-01',
      'Construction Complete': '2029-01-01',
    },
  },

  '116': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 39000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 13000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 13000000, award_year: 2026 },
    ],
    total: 65000000,
    milestone_dates: {
      'Design Start':          '2024-07-15',
      'Design Complete':       '2026-01-15',
      'Award':                 '2026-07-15',
      'Construction Start':    '2026-10-15',
      'Construction Complete': '2029-01-15',
    },
  },

  '117': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 60000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 20000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 20000000, award_year: 2026 },
    ],
    total: 100000000,
    milestone_dates: {
      'Design Start':          '2024-08-01',
      'Design Complete':       '2026-02-01',
      'Award':                 '2026-08-01',
      'Construction Start':    '2026-11-01',
      'Construction Complete': '2029-02-01',
    },
  },

  '118': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 48000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 16000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 16000000, award_year: 2026 },
    ],
    total: 80000000,
    milestone_dates: {
      'Design Start':          '2024-08-15',
      'Design Complete':       '2026-02-15',
      'Award':                 '2026-08-15',
      'Construction Start':    '2026-11-15',
      'Construction Complete': '2029-02-15',
    },
  },

  '119': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 75000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 25000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 25000000, award_year: 2026 },
    ],
    total: 125000000,
    milestone_dates: {
      'Design Start':          '2024-09-01',
      'Design Complete':       '2026-03-01',
      'Award':                 '2026-09-01',
      'Construction Start':    '2026-12-01',
      'Construction Complete': '2029-03-01',
    },
  },

  '120': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 87000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 29000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 29000000, award_year: 2026 },
    ],
    total: 145000000,
    milestone_dates: {
      'Design Start':          '2024-09-15',
      'Design Complete':       '2026-03-15',
      'Award':                 '2026-09-15',
      'Construction Start':    '2026-12-15',
      'Construction Complete': '2029-03-15',
    },
  },

  '121': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 105000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 35000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 35000000, award_year: 2026 },
    ],
    total: 175000000,
    milestone_dates: {
      'Design Start':          '2024-10-01',
      'Design Complete':       '2026-04-01',
      'Award':                 '2026-9-15',
      'Construction Start':    '2027-01-01',
      'Construction Complete': '2029-04-01',
    },
  },

  '122': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 36000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 12000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 12000000, award_year: 2026 },
    ],
    total: 60000000,
    milestone_dates: {
      'Design Start':          '2024-11-15',
      'Design Complete':       '2026-05-15',
      'Award':                 '2026-11-15',
      'Construction Start':    '2027-02-15',
      'Construction Complete': '2029-05-15',
    },
  },

  '123': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 52800000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 17600000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 17600000, award_year: 2026 },
    ],
    total: 88000000,
    milestone_dates: {
      'Design Start':          '2024-12-01',
      'Design Complete':       '2026-06-01',
      'Award':                 '2026-12-01',
      'Construction Start':    '2027-03-01',
      'Construction Complete': '2029-06-01',
    },
  },

  '124': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 78000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 26000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 26000000, award_year: 2027 },
    ],
    total: 130000000,
    milestone_dates: {
      'Design Start':          '2025-01-15',
      'Design Complete':       '2026-07-15',
      'Award':                 '2027-01-15',
      'Construction Start':    '2027-04-15',
      'Construction Complete': '2029-07-15',
    },
  },

  '125': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 93000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 31000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 31000000, award_year: 2027 },
    ],
    total: 155000000,
    milestone_dates: {
      'Design Start':          '2025-02-01',
      'Design Complete':       '2026-08-01',
      'Award':                 '2027-02-01',
      'Construction Start':    '2027-05-01',
      'Construction Complete': '2029-08-01',
    },
  },

  '126': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 42000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 14000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 14000000, award_year: 2027 },
    ],
    total: 70000000,
    milestone_dates: {
      'Design Start':          '2025-03-15',
      'Design Complete':       '2026-09-15',
      'Award':                 '2027-03-15',
      'Construction Start':    '2027-06-15',
      'Construction Complete': '2029-09-15',
    },
  },

  '127': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 63000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 21000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 21000000, award_year: 2027 },
    ],
    total: 105000000,
    milestone_dates: {
      'Design Start':          '2025-04-01',
      'Design Complete':       '2026-10-01',
      'Award':                 '2027-04-01',
      'Construction Start':    '2027-07-01',
      'Construction Complete': '2029-10-01',
    },
  },

  '128': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 111000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 37000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 37000000, award_year: 2027 },
    ],
    total: 185000000,
    milestone_dates: {
      'Design Start':          '2025-04-15',
      'Design Complete':       '2026-10-15',
      'Award':                 '2027-04-15',
      'Construction Start':    '2027-07-15',
      'Construction Complete': '2029-10-15',
    },
  },

  '129': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 120000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 40000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 40000000, award_year: 2027 },
    ],
    total: 200000000,
    milestone_dates: {
      'Design Start':          '2025-05-01',
      'Design Complete':       '2026-11-01',
      'Award':                 '2027-05-01',
      'Construction Start':    '2027-08-01',
      'Construction Complete': '2029-11-01',
    },
  },

  '130': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 54000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 18000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 18000000, award_year: 2027 },
    ],
    total: 90000000,
    milestone_dates: {
      'Design Start':          '2025-05-15',
      'Design Complete':       '2026-11-15',
      'Award':                 '2027-05-15',
      'Construction Start':    '2027-08-15',
      'Construction Complete': '2029-11-15',
    },
  },

  '131': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 81000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 27000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 27000000, award_year: 2027 },
    ],
    total: 135000000,
    milestone_dates: {
      'Design Start':          '2025-06-01',
      'Design Complete':       '2026-12-01',
      'Award':                 '2027-06-01',
      'Construction Start':    '2027-09-01',
      'Construction Complete': '2029-12-01',
    },
  },

  '132': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 66000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 22000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 22000000, award_year: 2027 },
    ],
    total: 110000000,
    milestone_dates: {
      'Design Start':          '2025-06-15',
      'Design Complete':       '2026-12-15',
      'Award':                 '2027-06-15',
      'Construction Start':    '2027-09-15',
      'Construction Complete': '2029-12-15',
    },
  },

  '133': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 96000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 32000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 32000000, award_year: 2027 },
    ],
    total: 160000000,
    milestone_dates: {
      'Design Start':          '2025-07-01',
      'Design Complete':       '2027-01-01',
      'Award':                 '2027-07-01',
      'Construction Start':    '2027-10-01',
      'Construction Complete': '2030-01-01',
    },
  },

  '134': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 33000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 11000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 11000000, award_year: 2027 },
    ],
    total: 55000000,
    milestone_dates: {
      'Design Start':          '2025-07-15',
      'Design Complete':       '2027-01-15',
      'Award':                 '2027-07-15',
      'Construction Start':    '2027-10-15',
      'Construction Complete': '2030-01-15',
    },
  },

  '137': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 48000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 16000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 16000000, award_year: 2027 },
    ],
    total: 80000000,
    milestone_dates: {
      'Design Start':          '2025-08-01',
      'Design Complete':       '2027-02-01',
      'Award':                 '2027-08-01',
      'Construction Start':    '2027-11-01',
      'Construction Complete': '2030-02-01',
    },
  },

  '136': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 72000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 24000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 24000000, award_year: 2027 },
    ],
    total: 120000000,
    milestone_dates: {
      'Design Start':          '2025-09-15',
      'Design Complete':       '2027-03-15',
      'Award':                 '2027-09-15',
      'Construction Start':    '2027-12-15',
      'Construction Complete': '2030-03-15',
    },
  },

  '135': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 102000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 34000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 34000000, award_year: 2027 },
    ],
    total: 170000000,
    milestone_dates: {
      'Design Start':          '2025-11-01',
      'Design Complete':       '2027-05-01',
      'Award':                 '2027-11-01',
      'Construction Start':    '2028-02-01',
      'Construction Complete': '2030-05-01',
    },
  },

  '138': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 57000000,  award_year: 2028 },
      { code: '3L', description: 'TA Labor',     amount: 19000000, award_year: 2028 },
      { code: '3Q', description: 'EFA',           amount: 19000000, award_year: 2028 },
    ],
    total: 95000000,
    milestone_dates: {
      'Design Start':          '2026-02-15',
      'Design Complete':       '2027-08-15',
      'Award':                 '2028-02-15',
      'Construction Start':    '2028-05-15',
      'Construction Complete': '2030-08-15',
    },
  },

  '139': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 84000000,  award_year: 2028 },
      { code: '3L', description: 'TA Labor',     amount: 28000000, award_year: 2028 },
      { code: '3Q', description: 'EFA',           amount: 28000000, award_year: 2028 },
    ],
    total: 140000000,
    milestone_dates: {
      'Design Start':          '2026-05-01',
      'Design Complete':       '2027-11-01',
      'Award':                 '2028-05-01',
      'Construction Start':    '2028-08-01',
      'Construction Complete': '2030-11-01',
    },
  },

  '140': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 30000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 10000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 10000000, award_year: 2025 },
    ],
    total: 50000000,
    milestone_dates: {
      'Design Start':          '2023-01-15',
      'Design Complete':       '2024-07-15',
      'Award':                 '2025-01-15',
      'Construction Start':    '2025-04-15',
      'Construction Complete': '2027-07-15',
    },
  },

  '143': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 37200000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 12400000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 12400000, award_year: 2025 },
    ],
    total: 62000000,
    milestone_dates: {
      'Design Start':          '2023-03-01',
      'Design Complete':       '2024-09-01',
      'Award':                 '2025-03-01',
      'Construction Start':    '2025-06-01',
      'Construction Complete': '2027-09-01',
    },
  },

  '141': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 45000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 15000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 15000000, award_year: 2025 },
    ],
    total: 75000000,
    milestone_dates: {
      'Design Start':          '2023-05-15',
      'Design Complete':       '2024-11-15',
      'Award':                 '2025-05-15',
      'Construction Start':    '2025-08-15',
      'Construction Complete': '2027-11-15',
    },
  },

  '142': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 54000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 18000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 18000000, award_year: 2025 },
    ],
    total: 90000000,
    milestone_dates: {
      'Design Start':          '2023-07-01',
      'Design Complete':       '2025-01-01',
      'Award':                 '2025-07-01',
      'Construction Start':    '2025-10-01',
      'Construction Complete': '2028-01-01',
    },
  },

  '144': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 66000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 22000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 22000000, award_year: 2025 },
    ],
    total: 110000000,
    milestone_dates: {
      'Design Start':          '2023-09-15',
      'Design Complete':       '2025-03-15',
      'Award':                 '2025-09-15',
      'Construction Start':    '2025-12-15',
      'Construction Complete': '2028-03-15',
    },
  },

  '145': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 78000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 26000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 26000000, award_year: 2025 },
    ],
    total: 130000000,
    milestone_dates: {
      'Design Start':          '2023-11-01',
      'Design Complete':       '2025-05-01',
      'Award':                 '2025-11-01',
      'Construction Start':    '2026-02-01',
      'Construction Complete': '2028-05-01',
    },
  },

  '146': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 90000000,  award_year: 2025 },
      { code: '3L', description: 'TA Labor',     amount: 30000000, award_year: 2025 },
      { code: '3Q', description: 'EFA',           amount: 30000000, award_year: 2025 },
    ],
    total: 150000000,
    milestone_dates: {
      'Design Start':          '2023-12-15',
      'Design Complete':       '2025-06-15',
      'Award':                 '2025-12-15',
      'Construction Start':    '2026-03-15',
      'Construction Complete': '2028-06-15',
    },
  },

  '147': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 99000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 33000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 33000000, award_year: 2026 },
    ],
    total: 165000000,
    milestone_dates: {
      'Design Start':          '2024-01-01',
      'Design Complete':       '2025-07-01',
      'Award':                 '2026-01-01',
      'Construction Start':    '2026-04-01',
      'Construction Complete': '2028-07-01',
    },
  },

  '148': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 108000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 36000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 36000000, award_year: 2026 },
    ],
    total: 180000000,
    milestone_dates: {
      'Design Start':          '2024-01-15',
      'Design Complete':       '2025-07-15',
      'Award':                 '2026-01-15',
      'Construction Start':    '2026-04-15',
      'Construction Complete': '2028-07-15',
    },
  },

  '149': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 120000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 40000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 40000000, award_year: 2026 },
    ],
    total: 200000000,
    milestone_dates: {
      'Design Start':          '2024-02-01',
      'Design Complete':       '2025-08-01',
      'Award':                 '2026-02-01',
      'Construction Start':    '2026-05-01',
      'Construction Complete': '2028-08-01',
    },
  },

  '152': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 51000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 17000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 17000000, award_year: 2026 },
    ],
    total: 85000000,
    milestone_dates: {
      'Design Start':          '2024-02-15',
      'Design Complete':       '2025-08-15',
      'Award':                 '2026-02-15',
      'Construction Start':    '2026-05-15',
      'Construction Complete': '2028-08-15',
    },
  },

  '150': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 72000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 24000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 24000000, award_year: 2026 },
    ],
    total: 120000000,
    milestone_dates: {
      'Design Start':          '2024-03-01',
      'Design Complete':       '2025-09-01',
      'Award':                 '2026-03-01',
      'Construction Start':    '2026-06-01',
      'Construction Complete': '2028-09-01',
    },
  },

  '151': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 33000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 11000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 11000000, award_year: 2026 },
    ],
    total: 55000000,
    milestone_dates: {
      'Design Start':          '2024-03-15',
      'Design Complete':       '2025-09-15',
      'Award':                 '2026-03-15',
      'Construction Start':    '2026-06-15',
      'Construction Complete': '2028-09-15',
    },
  },

  '154': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 57000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 19000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 19000000, award_year: 2026 },
    ],
    total: 95000000,
    milestone_dates: {
      'Design Start':          '2024-04-01',
      'Design Complete':       '2025-10-01',
      'Award':                 '2026-04-01',
      'Construction Start':    '2026-07-01',
      'Construction Complete': '2028-10-01',
    },
  },

  '153': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 84000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 28000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 28000000, award_year: 2026 },
    ],
    total: 140000000,
    milestone_dates: {
      'Design Start':          '2024-04-15',
      'Design Complete':       '2025-10-15',
      'Award':                 '2026-04-15',
      'Construction Start':    '2026-07-15',
      'Construction Complete': '2028-10-15',
    },
  },

  '155': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 102000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 34000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 34000000, award_year: 2026 },
    ],
    total: 170000000,
    milestone_dates: {
      'Design Start':          '2024-05-01',
      'Design Complete':       '2025-11-01',
      'Award':                 '2026-05-01',
      'Construction Start':    '2026-08-01',
      'Construction Complete': '2028-11-01',
    },
  },

  '157': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 45000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 15000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 15000000, award_year: 2026 },
    ],
    total: 75000000,
    milestone_dates: {
      'Design Start':          '2024-05-15',
      'Design Complete':       '2025-11-15',
      'Award':                 '2026-05-15',
      'Construction Start':    '2026-08-15',
      'Construction Complete': '2028-11-15',
    },
  },

  '156': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 69000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 23000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 23000000, award_year: 2026 },
    ],
    total: 115000000,
    milestone_dates: {
      'Design Start':          '2024-06-01',
      'Design Complete':       '2025-12-01',
      'Award':                 '2026-06-01',
      'Construction Start':    '2026-09-01',
      'Construction Complete': '2028-12-01',
    },
  },

  '158': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 96000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 32000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 32000000, award_year: 2026 },
    ],
    total: 160000000,
    milestone_dates: {
      'Design Start':          '2024-06-15',
      'Design Complete':       '2025-12-15',
      'Award':                 '2026-06-15',
      'Construction Start':    '2026-09-15',
      'Construction Complete': '2028-12-15',
    },
  },

  '160': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 114000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 38000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 38000000, award_year: 2026 },
    ],
    total: 190000000,
    milestone_dates: {
      'Design Start':          '2024-07-01',
      'Design Complete':       '2026-01-01',
      'Award':                 '2026-07-01',
      'Construction Start':    '2026-10-01',
      'Construction Complete': '2029-01-01',
    },
  },

  '159': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 39000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 13000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 13000000, award_year: 2026 },
    ],
    total: 65000000,
    milestone_dates: {
      'Design Start':          '2024-07-15',
      'Design Complete':       '2026-01-15',
      'Award':                 '2026-07-15',
      'Construction Start':    '2026-10-15',
      'Construction Complete': '2029-01-15',
    },
  },

  '161': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 60000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 20000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 20000000, award_year: 2026 },
    ],
    total: 100000000,
    milestone_dates: {
      'Design Start':          '2024-08-01',
      'Design Complete':       '2026-02-01',
      'Award':                 '2026-08-01',
      'Construction Start':    '2026-11-01',
      'Construction Complete': '2029-02-01',
    },
  },

  '162': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 48000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 16000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 16000000, award_year: 2026 },
    ],
    total: 80000000,
    milestone_dates: {
      'Design Start':          '2024-08-15',
      'Design Complete':       '2026-02-15',
      'Award':                 '2026-08-15',
      'Construction Start':    '2026-11-15',
      'Construction Complete': '2029-02-15',
    },
  },

  '163': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 75000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 25000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 25000000, award_year: 2026 },
    ],
    total: 125000000,
    milestone_dates: {
      'Design Start':          '2024-09-01',
      'Design Complete':       '2026-03-01',
      'Award':                 '2026-09-01',
      'Construction Start':    '2026-12-01',
      'Construction Complete': '2029-03-01',
    },
  },

  '164': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 87000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 29000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 29000000, award_year: 2026 },
    ],
    total: 145000000,
    milestone_dates: {
      'Design Start':          '2024-09-15',
      'Design Complete':       '2026-03-15',
      'Award':                 '2026-09-15',
      'Construction Start':    '2026-12-15',
      'Construction Complete': '2029-03-15',
    },
  },

  '165': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 105000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 35000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 35000000, award_year: 2026 },
    ],
    total: 175000000,
    milestone_dates: {
      'Design Start':          '2024-10-01',
      'Design Complete':       '2026-04-01',
      'Award':                 '2026-10-01',
      'Construction Start':    '2027-01-01',
      'Construction Complete': '2029-04-01',
    },
  },

  '167': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 36000000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 12000000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 12000000, award_year: 2026 },
    ],
    total: 60000000,
    milestone_dates: {
      'Design Start':          '2024-11-15',
      'Design Complete':       '2026-05-15',
      'Award':                 '2026-11-15',
      'Construction Start':    '2027-02-15',
      'Construction Complete': '2029-05-15',
    },
  },

  '166': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 52800000,  award_year: 2026 },
      { code: '3L', description: 'TA Labor',     amount: 17600000, award_year: 2026 },
      { code: '3Q', description: 'EFA',           amount: 17600000, award_year: 2026 },
    ],
    total: 88000000,
    milestone_dates: {
      'Design Start':          '2024-12-01',
      'Design Complete':       '2026-06-01',
      'Award':                 '2026-12-01',
      'Construction Start':    '2027-03-01',
      'Construction Complete': '2029-06-01',
    },
  },

  '168': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 78000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 26000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 26000000, award_year: 2027 },
    ],
    total: 130000000,
    milestone_dates: {
      'Design Start':          '2025-01-15',
      'Design Complete':       '2026-07-15',
      'Award':                 '2027-01-15',
      'Construction Start':    '2027-04-15',
      'Construction Complete': '2029-07-15',
    },
  },

  '171': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 93000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 31000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 31000000, award_year: 2027 },
    ],
    total: 155000000,
    milestone_dates: {
      'Design Start':          '2025-02-01',
      'Design Complete':       '2026-08-01',
      'Award':                 '2027-02-01',
      'Construction Start':    '2027-05-01',
      'Construction Complete': '2029-08-01',
    },
  },

  '170': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 42000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 14000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 14000000, award_year: 2027 },
    ],
    total: 70000000,
    milestone_dates: {
      'Design Start':          '2025-03-15',
      'Design Complete':       '2026-09-15',
      'Award':                 '2027-03-15',
      'Construction Start':    '2027-06-15',
      'Construction Complete': '2029-09-15',
    },
  },

  '169': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 63000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 21000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 21000000, award_year: 2027 },
    ],
    total: 105000000,
    milestone_dates: {
      'Design Start':          '2025-04-01',
      'Design Complete':       '2026-10-01',
      'Award':                 '2027-04-01',
      'Construction Start':    '2027-07-01',
      'Construction Complete': '2029-10-01',
    },
  },

  '172': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 111000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 37000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 37000000, award_year: 2027 },
    ],
    total: 185000000,
    milestone_dates: {
      'Design Start':          '2025-04-15',
      'Design Complete':       '2026-10-15',
      'Award':                 '2027-04-15',
      'Construction Start':    '2027-07-15',
      'Construction Complete': '2029-10-15',
    },
  },

  '173': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 120000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 40000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 40000000, award_year: 2027 },
    ],
    total: 200000000,
    milestone_dates: {
      'Design Start':          '2025-05-01',
      'Design Complete':       '2026-11-01',
      'Award':                 '2027-05-01',
      'Construction Start':    '2027-08-01',
      'Construction Complete': '2029-11-01',
    },
  },

  '174': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 54000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 18000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 18000000, award_year: 2027 },
    ],
    total: 90000000,
    milestone_dates: {
      'Design Start':          '2025-05-15',
      'Design Complete':       '2026-11-15',
      'Award':                 '2027-05-15',
      'Construction Start':    '2027-08-15',
      'Construction Complete': '2029-11-15',
    },
  },

  '175': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 81000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 27000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 27000000, award_year: 2027 },
    ],
    total: 135000000,
    milestone_dates: {
      'Design Start':          '2025-06-01',
      'Design Complete':       '2026-12-01',
      'Award':                 '2027-06-01',
      'Construction Start':    '2027-09-01',
      'Construction Complete': '2029-12-01',
    },
  },

  '176': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 66000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 22000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 22000000, award_year: 2027 },
    ],
    total: 110000000,
    milestone_dates: {
      'Design Start':          '2025-06-15',
      'Design Complete':       '2026-12-15',
      'Award':                 '2027-06-15',
      'Construction Start':    '2027-09-15',
      'Construction Complete': '2029-12-15',
    },
  },

  '177': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 96000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 32000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 32000000, award_year: 2027 },
    ],
    total: 160000000,
    milestone_dates: {
      'Design Start':          '2025-07-01',
      'Design Complete':       '2027-01-01',
      'Award':                 '2027-07-01',
      'Construction Start':    '2027-10-01',
      'Construction Complete': '2030-01-01',
    },
  },

  '178': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 33000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 11000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 11000000, award_year: 2027 },
    ],
    total: 55000000,
    milestone_dates: {
      'Design Start':          '2025-07-15',
      'Design Complete':       '2027-01-15',
      'Award':                 '2027-07-15',
      'Construction Start':    '2027-10-15',
      'Construction Complete': '2030-01-15',
    },
  },

  '179': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 48000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 16000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 16000000, award_year: 2027 },
    ],
    total: 80000000,
    milestone_dates: {
      'Design Start':          '2025-08-01',
      'Design Complete':       '2027-02-01',
      'Award':                 '2027-08-01',
      'Construction Start':    '2027-11-01',
      'Construction Complete': '2030-02-01',
    },
  },

  '180': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 72000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 24000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 24000000, award_year: 2027 },
    ],
    total: 120000000,
    milestone_dates: {
      'Design Start':          '2025-09-15',
      'Design Complete':       '2027-03-15',
      'Award':                 '2027-09-15',
      'Construction Start':    '2027-12-15',
      'Construction Complete': '2030-03-15',
    },
  },

  '182': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 102000000,  award_year: 2027 },
      { code: '3L', description: 'TA Labor',     amount: 34000000, award_year: 2027 },
      { code: '3Q', description: 'EFA',           amount: 34000000, award_year: 2027 },
    ],
    total: 170000000,
    milestone_dates: {
      'Design Start':          '2025-11-01',
      'Design Complete':       '2027-05-01',
      'Award':                 '2027-11-01',
      'Construction Start':    '2028-02-01',
      'Construction Complete': '2030-05-01',
    },
  },

  '181': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 57000000,  award_year: 2028 },
      { code: '3L', description: 'TA Labor',     amount: 19000000, award_year: 2028 },
      { code: '3Q', description: 'EFA',           amount: 19000000, award_year: 2028 },
    ],
    total: 95000000,
    milestone_dates: {
      'Design Start':          '2026-02-15',
      'Design Complete':       '2027-08-15',
      'Award':                 '2028-02-15',
      'Construction Start':    '2028-05-15',
      'Construction Complete': '2030-08-15',
    },
  },

  '183': {
    tasks: [
      { code: '3C', description: 'Construction', amount: 84000000,  award_year: 2028 },
      { code: '3L', description: 'TA Labor',     amount: 28000000, award_year: 2028 },
      { code: '3Q', description: 'EFA',           amount: 28000000, award_year: 2028 },
    ],
    total: 140000000,
    milestone_dates: {
      'Design Start':          '2026-05-01',
      'Design Complete':       '2027-11-01',
      'Award':                 '2028-05-01',
      'Construction Start':    '2028-08-01',
      'Construction Complete': '2030-11-01',
    },
  },


  // Fallback used for any project not listed above
  _default: {
    tasks: [
      { code: '1A', description: 'Preliminary Engineering', amount:  250000, award_year: 2025 },
      { code: '2B', description: 'Environmental / NEPA',   amount:   85000, award_year: 2025 },
      { code: '3C', description: 'Right of Way',           amount:  120000, award_year: 2026 },
      { code: '4D', description: 'Construction',           amount: 1945000, award_year: 2027 },
    ],
    total: 2400000,
    milestone_dates : {
      'Design Start': '2025-01-15',
      'Design Complete': '2025-09-30',
      'Award': '2026-02-03',
      'Construction Start': '2026-04-01',
      'Construction Complete': '2027-10-31',
    },
  },

  _awc :{
    tasks: [
      { code: '5Z', description: 'Reserve', amount: 200000000, award_year: 2025 }
    ],
    total: 200000000,
    milestone_dates: {
      'Design Start': '2025-01-01',
      'Design Complete': '2025-12-31',
      'Award': '2025-12-31',
      'Construction Start': '2026-01-01',
      'Construction Complete': '2026-12-31',
    },
  }

};

/**
 * Returns the official budget record for a given project ID.
 * Falls back to _default if the project has no specific entry.
 *
 * @param {string} projectId - The project UUID from the URL (project_id param)
 * @returns {{ tasks: Array<{code:string, description:string, amount:number, award_year:number}>, total: number }}
 */
export function getOfficialBudget(projectId) {
  return OFFICIAL_BUDGETS[projectId] ?? OFFICIAL_BUDGETS._default;
}

/**
 * Returns the full budgets map (excluding _default) for batch lookups.
 * Used by health-of-program reports to aggregate across all projects.
 *
 * @returns {Object} Map of projectId → budget record
 */
export function getAllBudgets() {
  return OFFICIAL_BUDGETS;
}

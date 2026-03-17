// DEMO DATA — placeholder until official budget API is connected.
// Replace with real data source; getOfficialBudget() is the integration point.
//
// To use with a real project: add an entry below keyed by the dimension id
// from the dimensions table (dimension_type = 'project', from the URL ?project_id=...).

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
  // Each entry below should have a corresponding dimension (dimension_type = 'project') with:
  //   cip=8 and the category/element noted in the comment.
  // Add these projects in the DB and give them estimates to see Report 1 populated.

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

  '539': {
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

  '536': {
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

  '540': {
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

  '543': {
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

  '542': {
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

  '541': {
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

  '538': {
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

  '544': {
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

  '537': {
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

  '545': {
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

  '546': {
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

  '547': {
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

  '548': {
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

  '549': {
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

  '550': {
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

  '552': {
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

  '551': {
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

  '553': {
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

  '554': {
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

  '555': {
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

  '556': {
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

  '557': {
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

  '558': {
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

  '559': {
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

  '561': {
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

  '560': {
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

  '564': {
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

  '563': {
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

  '562': {
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

  '565': {
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

  '567': {
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

  '568': {
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

  '566': {
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

  '569': {
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

  '570': {
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

  '572': {
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

  '574': {
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

  '573': {
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

  '571': {
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

  '575': {
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

  '577': {
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

  '576': {
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

  '578': {
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

  '585': {
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

  '579': {
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

  '580': {
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

  '582': {
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

  '581': {
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

  '583': {
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

  '584': {
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

  '586': {
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

  '588': {
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

  '587': {
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

  '589': {
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

  '590': {
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

  '591': {
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

  '592': {
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

  '593': {
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

  '594': {
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

  '595': {
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

  '596': {
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

  '598': {
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

  '597': {
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

  '599': {
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

  '602': {
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

  '601': {
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

  '600': {
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

  '603': {
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

  '604': {
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

  '605': {
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

  '607': {
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

  '606': {
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

  '608': {
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

  '609': {
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

  '610': {
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

  '611': {
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

  '612': {
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

  '613': {
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

  '615': {
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

  '614': {
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

  '616': {
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

  '617': {
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

  '618': {
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

  '619': {
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

  '622': {
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

  '620': {
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

  '621': {
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

  '623': {
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

  '625': {
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

  '624': {
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

  '626': {
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

  '627': {
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

  '628': {
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

  '631': {
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

  '633': {
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

  '629': {
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

  '630': {
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

  '632': {
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

  '634': {
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

  '635': {
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

  '637': {
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

  '636': {
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

  '638': {
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

  '639': {
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

  '640': {
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

  '642': {
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

  '641': {
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

  '643': {
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

  '644': {
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

  '645': {
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

  '649': {
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

  '646': {
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

  '647': {
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

  '651': {
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

  '650': {
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

  '648': {
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

  '652': {
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

  '653': {
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

  '655': {
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

  '654': {
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

  '656': {
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

  '657': {
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

  '662': {
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

  '659': {
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

  '663': {
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

  '658': {
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

  '661': {
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

  '660': {
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

  '664': {
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

  '665': {
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

  '668': {
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

  '666': {
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

  '667': {
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

  '670': {
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

  '669': {
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

  '671': {
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

  '672': {
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

  '674': {
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

  '673': {
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

  '675': {
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

  '676': {
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

  '680': {
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

  '677': {
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

  '678': {
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

  '681': {
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

  '682': {
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

  '683': {
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

  '679': {
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

  '684': {
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

  '685': {
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

  '688': {
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

  '692': {
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

  '689': {
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

  '694': {
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

  '686': {
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

  '687': {
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

  '690': {
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

  '693': {
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

  '695': {
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

  '691': {
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

  '696': {
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

  '697': {
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

  '701': {
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

  '702': {
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

  '698': {
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

  '700': {
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

  '699': {
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

  '704': {
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

  '705': {
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

  '703': {
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

  '708': {
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

  '706': {
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

  '707': {
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

  '709': {
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

  '710': {
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

  '711': {
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

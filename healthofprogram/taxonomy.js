// Taxonomy of Programs → Agencies → Categories → Elements.
// This is the single source of truth for the report hierarchy.
// All elements appear in reports even if no projects exist yet.
//
// USAGE: Replace placeholder labels, codes, and numbers with real values.
//   agency.code  — matches the `agency` text field in projects_live
//   category.num — matches the `category` integer field in projects_live
//   element.num  — matches the `element` integer field in projects_live

export const TAXONOMY = {

  // Program 7
  7: {
    agencies: [
      {
        code: 'T', label: 'NYCT',
        categories: [
          {
            num: 1, label: 'Subway Cars',
            elements: [
              { num: 1, label: 'Subway Cars' },
            ],
          },
          {
            num: 3, label: 'Buses',
            elements: [
              { num: 2, label: 'Bus Replacement' },

            ],
          },
          {
            num: 4, label: 'Stations',
            elements: [
              { num: 4, label: 'Fare Collection' },
              { num: 7, label: 'Station Escalators/Elevators' },
              { num: 12, label: 'Station Work' },
              { num: 13, label: 'Accessibility' },
            ],
          },
          {
            num: 5, label: 'Track',
            elements: [
              { num: 2, label: 'Mainline Track Rehabilitation' },
              { num: 3, label: 'Mainline Switch Replacement' },
            ],
          },
          {
            num: 6, label: 'Line Equipment',
            elements: [
              { num: 5, label: 'Line Equipment' },
            ],
          },
          {
            num: 7, label: 'Line Structures',
            elements: [
              { num: 3, label: 'Line Structure Rehabilitation' },
            ],
          },
          {
            num: 8, label: 'Signals & Communications',
            elements: [
              { num: 3, label: 'Signal Modernization' },
              { num: 6, label: 'Communication Systems' },
            ],
          },
          {
            num: 9, label: 'Traction Power',
            elements: [
              { num: 2, label: 'Substations' },
              { num: 4, label: 'Power Distribution' },
            ],
          },
          {
            num: 10, label: 'Shops & Yards',
            elements: [
              { num: 4, label: 'Shops & Yards' },
            ],
          },
          {
            num: 12, label: 'Depots',
            elements: [
              { num: 3, label: 'Depot Rehab & Reconstruction' },
            ],
          },
          {
            num: 13, label: 'Service Vehicles',
            elements: [
              { num: 3, label: 'Service Vehicles' },
            ],
          },
          {
            num: 16, label: 'Misc/Emergency',
            elements: [
              { num: 2, label: 'Miscellaneous' },
              { num: 4, label: 'Management Information Systems' },
              { num: 5, label: 'Engineering Services' },
              { num: 7, label: 'Employee Facilities' },
            ],
          }
        ],

      },
      {
        code: 'S', label: 'Staten Island Railway',
        categories: [
          {
            num: 7, label: 'Staten Island Railway',
            elements: [
              { num: 1, label: 'SIR:Miscellaneous' },
            ],
          },
        ],
      },
    ],
  },
  8: {
    agencies: [
      {
        code: 'T', label: 'NYCT',
        categories: [
          {
            num: 1, label: 'Subway Cars',
            elements: [
              { num: 1, label: 'Subway Cars' },
            ],
          },
          {
            num: 3, label: 'Buses',
            elements: [
              { num: 2, label: 'Bus Replacement' },

            ],
          },
          {
            num: 4, label: 'Stations',
            elements: [
              { num: 4, label: 'Fare Collection' },
              { num: 7, label: 'Station Escalators/Elevators' },
              { num: 12, label: 'Station Work' },
              { num: 13, label: 'Accessibility' },
            ],
          },
          {
            num: 5, label: 'Track',
            elements: [
              { num: 2, label: 'Mainline Track Rehabilitation' },
              { num: 3, label: 'Mainline Switch Replacement' },
            ],
          },
          {
            num: 6, label: 'Line Equipment',
            elements: [
              { num: 5, label: 'Line Equipment' },
            ],
          },
          {
            num: 7, label: 'Line Structures',
            elements: [
              { num: 3, label: 'Line Structure Rehabilitation' },
            ],
          },
          {
            num: 8, label: 'Signals & Communications',
            elements: [
              { num: 3, label: 'Signal Modernization' },
              { num: 6, label: 'Communication Systems' },
            ],
          },
          {
            num: 9, label: 'Traction Power',
            elements: [
              { num: 2, label: 'Substations' },
              { num: 4, label: 'Power Distribution' },
            ],
          },
          {
            num: 10, label: 'Shops & Yards',
            elements: [
              { num: 4, label: 'Shops & Yards' },
            ],
          },
          {
            num: 12, label: 'Depots',
            elements: [
              { num: 3, label: 'Depot Rehab & Reconstruction' },
            ],
          },
          {
            num: 13, label: 'Service Vehicles',
            elements: [
              { num: 3, label: 'Service Vehicles' },
            ],
          },
          {
            num: 16, label: 'Misc/Emergency',
            elements: [
              { num: 2, label: 'Miscellaneous' },
              { num: 4, label: 'Management Information Systems' },
              { num: 5, label: 'Engineering Services' },
              { num: 7, label: 'Employee Facilities' },
            ],
          }
        ],

      },
      {
        code: 'S', label: 'Staten Island Railway',
        categories: [
          {
            num: 7, label: 'Staten Island Railway',
            elements: [
              { num: 1, label: 'SIR:Miscellaneous' },
            ],
          },
        ],
      },
    ],
  },
  9: {
    agencies: [
      {
        code: 'T', label: 'NYCT',
        categories: [
          {
            num: 1, label: 'Subway Cars',
            elements: [
              { num: 1, label: 'Subway Cars' },
            ],
          },
          {
            num: 3, label: 'Buses',
            elements: [
              { num: 2, label: 'Bus Replacement' },

            ],
          },
          {
            num: 4, label: 'Stations',
            elements: [
              { num: 4, label: 'Fare Collection' },
              { num: 7, label: 'Station Escalators/Elevators' },
              { num: 12, label: 'Station Work' },
              { num: 13, label: 'Accessibility' },
            ],
          },
          {
            num: 5, label: 'Track',
            elements: [
              { num: 2, label: 'Mainline Track Rehabilitation' },
              { num: 3, label: 'Mainline Switch Replacement' },
            ],
          },
          {
            num: 6, label: 'Line Equipment',
            elements: [
              { num: 5, label: 'Line Equipment' },
            ],
          },
          {
            num: 7, label: 'Line Structures',
            elements: [
              { num: 3, label: 'Line Structure Rehabilitation' },
            ],
          },
          {
            num: 8, label: 'Signals & Communications',
            elements: [
              { num: 3, label: 'Signal Modernization' },
              { num: 6, label: 'Communication Systems' },
            ],
          },
          {
            num: 9, label: 'Traction Power',
            elements: [
              { num: 2, label: 'Substations' },
              { num: 4, label: 'Power Distribution' },
            ],
          },
          {
            num: 10, label: 'Shops & Yards',
            elements: [
              { num: 4, label: 'Shops & Yards' },
            ],
          },
          {
            num: 12, label: 'Depots',
            elements: [
              { num: 3, label: 'Depot Rehab & Reconstruction' },
            ],
          },
          {
            num: 13, label: 'Service Vehicles',
            elements: [
              { num: 3, label: 'Service Vehicles' },
            ],
          },
          {
            num: 16, label: 'Misc/Emergency',
            elements: [
              { num: 2, label: 'Miscellaneous' },
              { num: 4, label: 'Management Information Systems' },
              { num: 5, label: 'Engineering Services' },
              { num: 7, label: 'Employee Facilities' },
            ],
          }
        ],

      },
      {
        code: 'S', label: 'Staten Island Railway',
        categories: [
          {
            num: 7, label: 'Staten Island Railway',
            elements: [
              { num: 1, label: 'SIR:Miscellaneous' },
            ],
          },
        ],
      },
    ],
  },
  10: {
    agencies: [
      {
        code: 'T', label: 'NYCT',
        categories: [
          {
            num: 1, label: 'Subway Cars',
            elements: [
              { num: 1, label: 'Subway Cars' },
            ],
          },
          {
            num: 3, label: 'Buses',
            elements: [
              { num: 2, label: 'Bus Replacement' },

            ],
          },
          {
            num: 4, label: 'Stations',
            elements: [
              { num: 4, label: 'Fare Collection' },
              { num: 7, label: 'Station Escalators/Elevators' },
              { num: 12, label: 'Station Work' },
              { num: 13, label: 'Accessibility' },
            ],
          },
          {
            num: 5, label: 'Track',
            elements: [
              { num: 2, label: 'Mainline Track Rehabilitation' },
              { num: 3, label: 'Mainline Switch Replacement' },
            ],
          },
          {
            num: 6, label: 'Line Equipment',
            elements: [
              { num: 5, label: 'Line Equipment' },
            ],
          },
          {
            num: 7, label: 'Line Structures',
            elements: [
              { num: 3, label: 'Line Structure Rehabilitation' },
            ],
          },
          {
            num: 8, label: 'Signals & Communications',
            elements: [
              { num: 3, label: 'Signal Modernization' },
              { num: 6, label: 'Communication Systems' },
            ],
          },
          {
            num: 9, label: 'Traction Power',
            elements: [
              { num: 2, label: 'Substations' },
              { num: 4, label: 'Power Distribution' },
            ],
          },
          {
            num: 10, label: 'Shops & Yards',
            elements: [
              { num: 4, label: 'Shops & Yards' },
            ],
          },
          {
            num: 12, label: 'Depots',
            elements: [
              { num: 3, label: 'Depot Rehab & Reconstruction' },
            ],
          },
          {
            num: 13, label: 'Service Vehicles',
            elements: [
              { num: 3, label: 'Service Vehicles' },
            ],
          },
          {
            num: 16, label: 'Misc/Emergency',
            elements: [
              { num: 2, label: 'Miscellaneous' },
              { num: 4, label: 'Management Information Systems' },
              { num: 5, label: 'Engineering Services' },
              { num: 7, label: 'Employee Facilities' },
            ],
          }
        ],

      },
      {
        code: 'S', label: 'Staten Island Railway',
        categories: [
          {
            num: 7, label: 'Staten Island Railway',
            elements: [
              { num: 1, label: 'SIR:Miscellaneous' },
            ],
          },
        ],
      },
    ],
  },
};

# Health of the Program Tile - Objectives and Roadmap
### Objectives

The goal of this tile is to show reports that roll up all of the project data and the PSR data to show how the program at current understanding compares to the official understanding.  

I do not think these reports should be pre-loaded on page load since I am planning on creating many reports and do not want to cause performance issues on load if any individual report is a heavy lift.

In order to deliver on this, the reports in this tile must help the user answer the key questions below.


>1. At most recent estimate, how much are the projects in the program projected to cost compared to the current envelope
>    - a) Are there any elements where the projected esttimate exceeds the budget for the element by more than 10%?
>    - b) What is the status of Authority Wide Contingency
>
>2. What share of the money and what share of the projects are in what stage of the process (define/pre-referral, scoping, design, procurement, construction, closeout)
>3. What is the time spread of award commitments as currently projected
>4. Are there any discrepencies in projects between Nienna and the official data source (particularly are there projects in either that are not in both)

**Tackling each report at once, here is what data will need to go into the report and what the output should look like including clickable functionality and filtering:**

#### Report 1: Budget vs. Estimate

This report is mainly a comparison on a project by project basis of what the current estimate in Nienna is compared to what the budget for the project is in the PSR(*or future 'offical' data source*).  The main report should filter by default on CIP, covering only projects in that program.  

Always at the top of this report should be the total for the selected filters comparing budget to estimate and showing the difference

Below that should be expandable cards for each Category, and with each category for each element.  each level should show the total budget and estimate for that sub slice.  So each category should show total budget vs estimate for that category, and same for each element.  The element header should additionally have a highlight that shows if the shortfall (estimate - budget) amount exceeds 110% of the budget If the element is expanded then it should show the project level detail and the projects should be href-ed back to their project page. If the user hover's over the estimate it should show information about the source of that estimate (basically the estimate type, status, and date like is shown in the project event feed card headers)

This should address 1, 1a, but not 1b.  I do not know how i will get the value of authority wide contingency yet so best not to worry about it for now.

What I will need for now is to create more demo data and more test projects in nienna to cover all of the elements and categories.  I should also provide a list of all the elements and categories to build off of rather than just collecting unique values from my data.  

PSR Keys 11059 for CIP 8 and 14506 for CIP 9 are AWC.  It is possible to just see exactly what is in there all the time.  Easy to add to the report, just need to add it to the demo data basically with a special case for querying it into the main summary card.

#### Report 2: Money and Projects in what phase

The key obstacle is cleanly defining what delineates what phase.  For example, anything that is in Nienna that isn't in the PSR is definitionally in the define/pre-referral phase.  Beyond that I will have to do some diggin into when the scoping phase ends vs design phase begins from the milestones that exist currently in PSR to see if I can make that distinction clearly.  In the meantime, I should just write dates into the demo data so I can demo the report.

#### Report 3: Money and Projects award timeline distribution

This report will have a switch to toggle between number of projects and amount of dollars in a bar chart with the x axis being the last day of the month for the defined time range.  The user should be able to select a time range to view by selecting the start month and end month (including across multiple years i.e. november 2026 thru february 2027).  This will be based on the date listed as the award date in the PSR as currently represented in the demo-data.js file as award date. The report should also be able to be sliced by program, agency, category, and element using the existing filters on the page. 
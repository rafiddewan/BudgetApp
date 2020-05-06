# BudgetApp
This web app helps me plan my budget

## How to use

### How to add an item
- You have an option of either choosing an income(+) to add or an expense(-) to add
- Type the item you want to add in the description
- Type the value (amount) of that item
- Press "Enter" or click the checkmark sign

### How to remove an item
- Simply hover over the price and you can click the "X" to delete an item

## Fundamental Things for this architecture
- Click on the button will start the event
    - Add the event handler
    - Get input values from data fields
- Add the new income or expense to the data structure
- Add the new item to the UI
- Calculate the budget
- Update the UI of the budget

## Other things to do
- Click on the remove button to remove the item from the list
    - Add event handler
    - Delete the item to the UI
- Re-calculate budget
- Calculate percentages in UI
- Display the current month and year
- Number formatting
- Improve input field UX
- Update UI

## Modules
- Model
    - Add the new item to our data structure
    - Calculate Budget
- View
    - Get input values
    - Add the new item ot the UI
    - Update the UI
- Controller
    - Add event handler

/*************
 * Modules will help keep pieces of code together inside independent organized units
 * Module pattern will create modules for us
 */

 //Model Module
 var budgetModel = (function() {
    
   var Expense = function(id, description, value){
       this.id = id;
       this.description = description;
       this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculate = function calculateTotal(type){

        var sum = 0;
        budgetData.allItems[type].forEach(item => {
            sum += item.value;
        }); 
        budgetData.totals[type] = sum;
    }

    var budgetData = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1 //no percentage since it doesn't exist upon initialization
    };

    return{
        addItem: function(type, description, amount){
            var newItem, ID;

            //create new ID
            if(budgetData.allItems[type].length > 0){            
                ID = budgetData.allItems[type][budgetData
            .allItems[type].length -1].id + 1;
            } else ID = 0;
            //Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID, description, amount);
            } else if(type === 'inc'){
                newItem = new Income(ID, description, amount);
            }

            //push it into our budgetData structure
            budgetData.allItems[type].push(newItem);
            //return the new element
            return newItem;
        },
        testing: function(){
            console.log(budgetData);
        },

        calculateBudget: function(){

            //calculate total income and expenses
            calculate('exp');
            calculate('inc');

            //Calculate the budget
            budgetData.budget = budgetData.totals.inc - budgetData.totals.exp;

            //calculate the perecentage of income that we spend
            if(budgetData.totals.inc > 0){
                budgetData.percentage = Math.round((budgetData.totals.exp /budgetData.totals.inc) * 100);
            } else budget.percentage = -1; //no income

            //Expense = 100 and income 200, spent 50% = 100/200 = 0.5 * 100

        },

        getBudget: function() {
            return {
                budget: budgetData.budget,
                totalInc: budgetData.totals.inc,
                totalExp: budgetData.totals.exp,
                percentage: budgetData.percentage
            }
        }
    }

 })();

 //UI Module
var budgetView = (function(){

    //stores query selectors, so we have a central place if we want to change the class
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputAmount: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        inputRemoveButton: 'item__delete--btn',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    };
    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value, //will be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                amount: parseFloat(document.querySelector(DOMstrings.inputAmount).value)
            };
        },

        getDOMstrings: function(){
            return DOMstrings;
        },

        addListItem: function(obj, type){
            //create HTML string with placeholder text
            var html, newHTML, element;
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            //replace the placeholder text with some budgetData
    
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);

            //Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
           
        },

        clearFields: function() {
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputAmount);
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(field => {
                field.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            if(obj.percentage > 100){
                document.querySelector(DOMstrings.percentageLabel).textContent = "broke";
            }
            else if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            } 
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";

            }
        }
    };
})();


//Controller Module
var budgetController = (function(model, view){
    
    var initializeEventListeners =  function(){
        var DOM = view.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function() {
        //Calculate the budget
        model.calculateBudget();
        //Return the budget
        var budget = model.getBudget();
        //Update the budget
        view.displayBudget(budget);
    };

    var ctrlAddItem = function() {

        //Get Field Input budgetData

        var input = view.getInput();
        if(input.description !== "" && !isNaN(input.amount) && input.amount > 0){ //can't enter empty value or description, as well as a value of 0
            //Add the item to the model
            var newItem = model.addItem(input.type, input.description, input.amount);

            //Add item to the UI
            view.addListItem(newItem, input.type);

            //Clear the fields
            view.clearFields();

            //Calculate and Update the budget
            updateBudget();

        }

    };

    return{
        init: function(){
            view.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1 
            })
            initializeEventListeners();
        }
    }
    
})(budgetModel, budgetView);

budgetController.init();
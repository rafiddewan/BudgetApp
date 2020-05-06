/*************
 * Modules will help keep pieces of code together inside independent organized units
 * Module pattern will create modules for us
 */

 /***************
  * Event bubbling happens when an event on the button then all the parent elements one at a time
  * Event that caused the bubbling to happend is the target element
  * Event delegation happens when theres an event handler attached to a parent element
  * and wait for the event to bubble up, and then do whatever we intended to do with
  * our target element
  * Event delegation is to NOT set up the event handler on the target element we are interested but to attach it to a parent element and catch the event there
  * Can catch the event we are interested in with the target element propery
  * We use event delegation when we have an element with lots of child elements we are interested in
  * We use event delegation we want to have an event handler attached to an elment that is not yet in te DOM when our page is loaded
  */
 //Model Module
 var budgetModel = (function() {
    
   var Expense = function(id, description, value){
       this.id = id;
       this.description = description;
       this.value = value;
       this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function(totalIncome) {
        if(totalIncome > 0) this.percentage = Math.round((this.value / totalIncome) * 100);
        else this.percentage = -1;
    }
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

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

            //push it into our budgetData intucture
            budgetData.allItems[type].push(newItem);
            //return the new element
            return newItem;
        },
        testing: function(){
            console.log(budgetData);
        },

        deleteItem: function(type, id){
            var index;
            ids = budgetData.allItems[type].map(function(item){
                return item.id;
            });
            
            index = ids.indexOf(id); //finds the id of the index

            if(index !== -1){
                //Splice method to remove elements
                budgetData.allItems[type].splice(index, 1);
            }
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
            } else budgetData.percentage = -1; //no income

            //Expense = 100 and income 200, spent 50% = 100/200 = 0.5 * 100

        },

        calculatePercentages: function() {
            budgetData.allItems.exp.forEach(element => {
                element.calculatePercentage(budgetData.totals.inc);                
            });  
        },

        getPercentages: function(){
            var allPercentages = budgetData.allItems.exp.map(function(item) {
                return item.getPercentage();
            });
            return allPercentages;
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
    var DOMStrings = {
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
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage'
    };
    var formatNumber = function(num, type){
        var numSplit, int , dec, placeholder;
        num = Math.abs(num); //remove any negatives numbers by default
        
        num = num.toFixed(2); //always put exactly two decimal numbers

        numSplit = num.split('.'); //split it between integer and decmial portion

        int = numSplit[0]; //integer portion

        placeholder = int.length; //placeholder of where to do the substring from

        //loop through hundreds
        for(var i = int.length-1; i >= 0; i--){
            if(i % 4 === 0){
                if((placeholder % 3 == 0 || placeholder < 3) && i == 0) break;
                int = int.substr(0, placeholder - 3) + ',' + int.substr(placeholder-3, int.length-1);
                placeholder -= 3;
            }
        }  
        dec = '.' + numSplit[1];//decimal
        return (type === 'exp'? '-' : '+') + ' ' + int + dec; //return the string
    }
    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value, //will be inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                amount: parseFloat(document.querySelector(DOMStrings.inputAmount).value)
            };
        },

        getDOMStrings: function(){
            return DOMStrings;
        },

        addListItem: function(obj, type){
            //create HTML inting with placeholder text
            var html, newHTML, element;
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            //replace the placeholder text with some budgetData
    
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

            //Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
           
        },
        
        deleteListItem: function(selectorID) {
            document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID));
        },

        clearFields: function() {
            var fields;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputAmount);
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(field => {
                field.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            if(obj.percentage > 100){
                document.querySelector(DOMStrings.percentageLabel).textContent = "broke";
            }
            else if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
            } 
            else{
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }
        },
        
        displayPercentages: function(percentages){
            fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel); //returns a node list
            
            var nodeListForEach = function(list, callback){ //passes fields and anonymous function
                for(var i = 0; i < list.length; i++){
                    callback(list[i], i); //calls the callback function
                }
            };

            nodeListForEach(fields, function(current, index) { //calls function
                if(percentages[index] > 0) current.textContent = percentages[index] + '%';
                else current.textContent = "---";
            });

        },
    };
})();


//Controller Module
var budgetController = (function(model, view){
    
    var initializeEventListeners =  function(){
        var DOM = view.getDOMStrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() {
        //Calculate the budget
        model.calculateBudget();
        //Return the budget
        var budget = model.getBudget();
        //Update the budget
        view.displayBudget(budget);
    };

    var updatePercentages = function() {
        // Calculate percentages
        model.calculatePercentages();

        //Read percentages from budget controller
        var percentages = model.getPercentages();

        // Update the UI with the new percentages
        view.displayPercentages(percentages);
    }

    var ctrlAddItem = function() {

        //Get Field Input budgetData

        var input = view.getInput();
        if(input.description !== "" && !isNaN(input.amount) && input.amount > 0){ //can't enter empty value or description, as well as a value of 0
            //Add the item to the model
            var newItem = model.addItem(input.type, input.description, input.amount);
            console.log
            //Add item to the UI
            view.addListItem(newItem, input.type);

            //Clear the fields
            view.clearFields();

            //Calculate and Update the budget and percentages
            updateBudget();
            updatePercentages();
        }

    };


    ctrlDeleteItem = function(event) { //event used for identifying the target element
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            //inc-1
            splitID = itemID.split('-');
            if(splitID[0] === 'income') type = 'inc';
            else if(splitID[0] === 'expense') type ='exp';
            ID = parseInt(splitID[1]);

            //Delete the item from the data intucture
            model.deleteItem(type, ID);
            //Delete the item from the UI
            view.deleteListItem(itemID);
            // Update and show the new budget and percentages
            updateBudget();
            updatePercentages();
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
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

    var budgetData = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return{
        addItem: function(type, description, amount){
            var newItem;

            //create new ID
            if(budgetData.allItems[type].length > 0){            
                ID = budgetData.allItems[type][budgetData.allItems[type].length -1].ID + 1;
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
        inputRemoveButton: 'item__delete--btn'
    };
    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value, //will be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                amount: document.querySelector(DOMstrings.inputAmount).value
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
            
            //replace the placeholder text with some data
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

    var ctrlAddItem = function() {

        //Get Field Input budgetData
        var input = view.getInput();
        console.log(input);

        //Add the item to the model
        var newItem = model.addItem(input.type, input.description, input.amount);

        //Add item to the UI
        view.addListItem(newItem, input.type);

        //Clear the fields
        view.clearFields();

        //Calculate the budget

        //Update the UI
    };

    return{
        init: function(){
            initializeEventListeners();
        }
    }
    
})(budgetModel, budgetView);

budgetController.init();
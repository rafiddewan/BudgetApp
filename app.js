/*************
 * Modules will help keep pieces of code together inside independent organized units
 * Module pattern will create modules for us
 */

 //Model Module
 var budgetModel = (function() {
    
 })();

 //UI Module
var budgetView = (function(){

    //stores query selectors, so we have a central place if we want to change the class
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputAmount: '.add__value',
        inputButton: '.add__btn'
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
        }
    };
})();


//Controller Module
var budgetController = (function(model, view){
    
    var DOM = view.getDOMstrings();

    var ctrlAddItem = function() {
        //Get Field Input Data
        var input = view.getInput();
        console.log(input);
        //Add the item to the budget controller

        //Add item to the UI

        //Calculate the budget

        //Update the UI
    }
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });
})(budgetModel, budgetView);
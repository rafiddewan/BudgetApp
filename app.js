/*************
 * Modules will help keep pieces of code together inside independent organized units
 * Module pattern will create modules for us
 */

 //Model Module
 var budgetModel = (function() {
    
 })();

 //UI Module
var budgetView = (function(){
    

})();


//Controller Module
var budgetController = (function(model, view){
    
    var ctrlAddItem = function() {
        //Get Field Input Data

        //Add the item to the budget controller

        //Add item to the UI

        //Calculate the budget

        //Update the UI
        console.log("It works");
    }
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem());

    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });
})(budgetModel, budgetView);
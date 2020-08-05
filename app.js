let budgetController = (function (){
    //code here
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let data = {
         allItems: {
             exp: [],
             inc:[]
         },
        totals:{
             exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function (type, des, val){
            let newItem, ID;

            ID = 0;

            // Create new ID
            if(data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            else{
                ID = 0;
            }
            // Create new item base on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }
            else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        testing: function (){
            console.log(data)
        }
    }

})();



// UIController module
let UIController = (function (){
    //code here

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return{
        getInput: function (){
            return {
                type : document.querySelector(DOMstrings.inputType).value, // Will be either + or -
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value,
            }
        },

        getDOMstrings: function (){
            return DOMstrings
        }
    }

})();


// Global app controller
let Controller = (function (budgetCtrl, UICtrl){
    //code here

    let setupEventListeners = function (){
        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress',function (event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        })
    };


    let ctrlAddItem = function (){
        let input, newItem
        // 1. Get the field input data
        input = UICtrl.getInput();

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the new item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI

    }

    return {
        init: function (){
            setupEventListeners();
        }
    }

})(budgetController,UIController)

Controller.init();




let budgetController = (function (){
    //code here
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function (){
        if(data.totals.inc > 0){
            this.percentage = Math.round((this.value/data.totals.inc)*100);
        }
        else this.percentage = -1;
    }

    Expense.prototype.getPercentage = function (){
        return this.percentage;
    }

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let calculateTotal = function (type){
        let total = 0;
        data.allItems[type].forEach((current, index) => {
            total = total + current.value;
        });
        data.totals[type] = total;
    }

    let data = {
         allItems: {
             exp: [],
             inc:[]
         },
        totals:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        deleteItem: function (type, id){
            let ids;
            let index = -1;
            // store 'inc' or 'exp' Id into an array name ids
            ids = data.allItems[type].map(function(current){
                return current.id
            });

            // find the index of id
            index = ids.indexOf(id);

            // Remove the item with the id
            if(index !== -1)
                data.allItems[type].splice(index, 1)
        },
        calculateBudget: function (){

            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget = income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that we spent
            if(data.totals.inc > 0 ){
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
            }
            else data.percentage = -1;
        },

        calculatePercentages: function (){

            data.allItems.exp.forEach(function (cur){
                cur.calcPercentage();
            })

        },

        getPercentages: function (){
            let allPerc = data.allItems.exp.map(function (cur){
                return cur.getPercentage();
            })
            return allPerc;
        },

        getBudget : function (){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container : '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    let formatNumber = function (num, type){
        let numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if(int.length > 3){
            int =  int.substr(0,int.length - 3) + ','+int.substr(int.length - 3,3); // input 2310 -> 2,310
        }
        dec = numSplit[1];



        return (type === 'exp' ?  '-' :  '+') + ' ' + int +'.'+ dec;
    }

    return{
        getInput: function (){
            return {
                type : document.querySelector(DOMstrings.inputType).value, // Will be either + or -
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(obj, type){
            let html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html =
                    '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> ' +
                    '<div class="right clearfix"> <div class="item__value">%value%</div> ' +
                    '<div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> ' +
                    '</div> </div> </div>'
            }
            else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html =
                    '<div class="item clearfix" id="exp-%id%">\n' +
                    '<div class="item__description">%description%</div>\n' +
                    '<div class="right clearfix">\n' +
                    '<div class="item__value">%value%</div>\n' +
                    '<div class="item__percentage">21%</div>\n' +
                    '<div class="item__delete">\n' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                    '</div> </div> </div>'
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },

        deleteListItem: function (selectorID){

            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        clearFields : function (){
            let fields, fieldArr;

            fields = document.querySelectorAll(DOMstrings.inputValue +','+ DOMstrings.inputDescription);

            fieldArr = Array.prototype.slice.call(fields);

            fieldArr.forEach(function (current, index, array)  {
                current.value = ""
            });

            fieldArr[0].focus();
        },

        displayBudget: function (obj){
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent =  formatNumber(obj.budget, type) + ' $';
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc') + ' $';
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp')  + ' $';
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function (percentages){

                let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

                // create for loop for node list

                let nodeListForEach = function (list, callback){
                    for(let i = 0; i < list.length; i++){
                        callback(list[i], i);
                    }
                }

                nodeListForEach(fields, function (current, index){

                    if(percentages[index] > 0)
                        current.textContent = percentages[index] + '% ';
                    else current.textContent = '---';
                })
        },

        displayMonth: function (){
            let now, year, months, month;

            now = new Date;
            months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            month  = now.getMonth();
            year = now.getFullYear();

            document.querySelector(DOMstrings.dateLabel).textContent =months[month] +' '+ year;
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    let updateBudget = function (){
        let budget;
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return budget
        budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    let updatePercentages = function (){

        // 1. Calculate Percentages
        budgetCtrl.calculatePercentages();

        // 2. Read Percentages from budget controller
        let percentages = budgetCtrl.getPercentages();

        // 3. Update UI with the new Percentages
        UICtrl.displayPercentages(percentages);
    }


    let ctrlAddItem = function (){
        let input, newItem
        // 1. Get the field input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the new item to the UI
            UICtrl.addListItem(newItem, input.type)
            UICtrl.clearFields();
        }

        // 4. Update budget
        updateBudget();

        // 5. Update percentages
        updatePercentages()
    }
    let ctrlDeleteItem = function (event){
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){

            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Update and show the new percentages
            updatePercentages();
        }
    }
    return {
        init: function (){
            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            UICtrl.displayMonth();
        }
    }

})(budgetController,UIController)

Controller.init();




var AmountController = (function() {

    var ExpensesSource = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var IncomesSource = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal=function(type){
              
              var sum=0;
              AmountData.AllItems[type].forEach(function(cur) {
                       sum+=cur.value;
              });
              AmountData.TotolItems[type]=sum;
    };
    var AmountData = {
        AllItems: {
            exp: [],
            inc: [],
        },
        TotolItems: {
            exp: 0,
            inc: 0
        },
        Budget:0,
        BudgetPercentage:-1
    };
    return {
        addItems: function(type, des, val) {
            var newItems, ID;
            //create New id
            if (AmountData.AllItems[type].length > 0) {
                ID = AmountData.AllItems[type][AmountData.AllItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //create new item
            if (type === "exp") {
                newItems = new ExpensesSource(ID, des, val);
            } else if (type === "inc") {
                newItems = new IncomesSource(ID, des, val);
            }
            //push new item in data structure
            AmountData.AllItems[type].push(newItems);
            //return new Items
            return newItems;
        },
        calculateBudget:function(){
          //calculate total income and expenses

          calculateTotal('inc');
          calculateTotal('exp');
          //calculate budget=total income -totalexpenses

          AmountData.Budget=AmountData.TotolItems.inc-AmountData.TotolItems.exp;
          //calculate percentage
          if (AmountData.TotolItems.inc > 0) {
            AmountData.BudgetPercentage=Math.round((AmountData.TotolItems.exp/AmountData.TotolItems.inc)*100);
          }

          else{
            AmountData.BudgetPercentage=-1;
          }
        },


        GetAllItem:function(){
          return{
            Budget:AmountData.Budget,
            TotalInc:AmountData.TotolItems.inc,
            TotalExp:AmountData.TotolItems.exp,
            Percentage:AmountData.BudgetPercentage
          };
        },
       testingSample:function(){
        console.log(AmountData);
       }
    };


})();








var UserInterface = (function() {
    var DOMinputButtton = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        button: '.add__btn',
        incomeDiv: '.income__list',
        expensesDiv: '.expenses__list',
        BudgetDiv:'.budget__value',
        TotalIncomeDiv:'.budget__income--value',
        TotalExpDiv:'.budget__expenses--value',
        PercentageDiv:'.budget__expenses--percentage'
    };
    return {
        getinput: function() {
            return {
                inputType: document.querySelector(DOMinputButtton.inputType).value,
                inputDescription: document.querySelector(DOMinputButtton.inputDescription).value,
                inputValue: parseFloat(document.querySelector(DOMinputButtton.inputValue).value)
            };

        },
        ListItemAdd: function(obj, type) {

            var html, newhtml, element;
            //Create html String

            if (type === 'inc') {
                element = DOMinputButtton.incomeDiv;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMinputButtton.expensesDiv;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //replace dom

            newhtml = html.replace('%id%', obj.type);
            newhtml = newhtml.replace('%description%', obj.description);
            newhtml = newhtml.replace('%value%', obj.value);

            //insert html into DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);


        },

        clearInputFields: function() {
                     
                     var field,ArrayField;
                     field=document.querySelectorAll(DOMinputButtton.inputDescription + ', '+ DOMinputButtton.inputValue);
                     ArrayField=Array.prototype.slice.call(field);

                     ArrayField.forEach(function(current,index,array) {
                           current.value="";

                     });


                     ArrayField[0].focus();
        },

        DispalyBudget:function(obj){

                 document.querySelector(DOMinputButtton.BudgetDiv).textContent=obj.Budget;
                 document.querySelector(DOMinputButtton.TotalIncomeDiv).textContent=obj.TotalInc;
                 document.querySelector(DOMinputButtton.TotalExpDiv).textContent=obj.TotalExp;
                 if (obj.Percentage > 0) {
                  document.querySelector(DOMinputButtton.PercentageDiv).textContent=obj.Percentage;
                 }
                 else{
                  document.querySelector(DOMinputButtton.PercentageDiv).textContent="--";
                 }
           
        },


        DomInput: function() {
            return DOMinputButtton;
        }
    };
})();








var ControllerApp = (function(Amount, Uicontroller) {
    var SetUpEvenListener = function() {
        var btn = Uicontroller.DomInput();
        document.querySelector(btn.button).addEventListener('click', keypreeCtr);
        document.addEventListener('keypress', function(e) {

            if (e.keyCode === 13 || e.which === 13) {
                keypreeCtr();
            }

        });
    };


    var UpdateBudget=function(){

             //calculate the budget
             Amount.calculateBudget();

             //return Budget

             var Buget=Amount.GetAllItem();

             //Show in UI

            Uicontroller.DispalyBudget(Buget);

    }

    var keypreeCtr = function() {
        var input, Items;
        //GET INPUT VALUES
        input = Uicontroller.getinput();
        if (input.inputDescription !=="" && !isNaN(input.inputValue) && input.inputValue > 0) {

        Items = Amount.addItems(input.inputType, input.inputDescription, input.inputValue);
        //add value in ui
        Uicontroller.ListItemAdd(Items, input.inputType, );

        //Clear Field
        Uicontroller.clearInputFields();
        //Calculate And Update Budget
        UpdateBudget();
        }
        
       

    };

    return {
        init: function() {
            console.log('Application has started');
            Uicontroller.DispalyBudget({
            Budget:0,
            TotalInc:0,
            TotalExp:0,
            Percentage:-1
            });
            SetUpEvenListener();
        }
    }



})(AmountController, UserInterface);
ControllerApp.init();
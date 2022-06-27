if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  };

//budget tracker javascript file for track html page

// elements
const balanceEl = document.querySelector(".balance .value"); // balance element for income - expense
const incomeTotalEl = document.querySelector(".income-total"); //  income amount element
const outcomeTotalEl = document.querySelector(".outcome-total"); // outcome amount element
const incomeEl = document.querySelector("#income"); // list and input for income element in dashboard
const expenseEl = document.querySelector("#expense"); // list and input for expense element in dashboard
const allEl = document.querySelector("#all"); // list for all element in dashboard
const incomeList = document.querySelector("#income .list"); // income list
const expenseList = document.querySelector("#expense .list"); // expense list
const allList = document.querySelector("#all .list"); // all list

// select toggle buttons
const expenseBtn = document.querySelector(".tab1"); // select the expense button
const incomeBtn = document.querySelector(".tab2"); // select the income button
const allBtn = document.querySelector(".tab3"); // select the all button

// all input buttons
const addExpense = document.querySelector(".add-expense"); // add expense button
const expenseTitle = document.getElementById("expense-title-input"); // add expense title name text
const expenseAmount = document.getElementById("expense-amount-input"); // add expense amount number

const addIncome = document.querySelector(".add-income"); // add income button
const incomeTitle = document.getElementById("income-title-input"); // add income title name text
const incomeAmount = document.getElementById("income-amount-input"); // add expense amount number

// all variables
let ENTRY_LIST; // array variable name for entries list
let balance = 0, income = 0, outcome = 0; // default values
const DELETE = "delete", EDIT = "edit"; // 

// check if data saved in local storage 
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || []; // if no entry list set entry list to an array
updateUI();

// when clicked event listeners
expenseBtn.addEventListener("click", function(){    // when (expense button is clicked) event listeners are added
    show(expenseEl);                                //show expense list and input
    hide( [incomeEl, allEl] );                      // income and all input and list are hidden
    active( expenseBtn );                           // expense button is now active
    inactive( [incomeBtn, allBtn] );                // income and all button grey out and inactive
})
incomeBtn.addEventListener("click", function(){ // when (income button is clicked) event listeners are added
    show(incomeEl);                             //show income list and input
    hide( [expenseEl, allEl] );                 // expense and all input and list are hidden
    active( incomeBtn );                        // income button is now active
    inactive( [expenseBtn, allBtn] );           // expense and all button grey out and inactive
})
allBtn.addEventListener("click", function(){    // when (all button is clicked) event listeners are added
    show(allEl);                                //show all list 
    hide( [incomeEl, expenseEl] );              // expense and income input and list are hidden
    active( allBtn );                           // all button is now active
    inactive( [incomeBtn, expenseBtn] );        // income and expense button grey out and inactive
})

addExpense.addEventListener("click", function(){ //add expense function
    
    if(!expenseTitle.value || !expenseAmount.value ) return; //if one of the 2 inputs are empty return will not run the code below.

    // saves the entry to the array ENTRY_LIST
    let expense = {
        type : "expense",
        title : expenseTitle.value,
        amount : parseInt(expenseAmount.value) //expenseAmount.value is a string and has to be parsed as a number
    }
    ENTRY_LIST.push(expense); //.push adds an element to the end of the list.

    updateUI(); //will add the element to the list on screen.
    clearInput( [expenseTitle, expenseAmount] ) //function to clear the input.
})

addIncome.addEventListener("click", function(){ // add income function
    
    if(!incomeTitle.value || !incomeAmount.value ) return; //if one of the 2 inputs are empty return will not run the code below.

    // saves the entry to the array ENTRY_LIST
    let income = {
        type : "income",
        title : incomeTitle.value,
        amount : parseInt(incomeAmount.value) //incomeAmount.value is a string and has to be parsed as a number
    }
    ENTRY_LIST.push(income); //.push adds an element to the end of the list.

    updateUI(); //will add the element to the list on screen.
    clearInput( [incomeTitle, incomeAmount] ) //function to clear the input.
})

incomeList.addEventListener("click", deleteOrEdit); //event listener for whole income list
expenseList.addEventListener("click", deleteOrEdit); //event listener for whole expense list
allList.addEventListener("click", deleteOrEdit); //event listener for whole all list


function deleteOrEdit(event){ //click event
    const targetBtn = event.target; //find the target button 

    const entry = targetBtn.parentNode; //get the entry id

    if( targetBtn.id == DELETE ){ //if delete is clicked
        deleteEntry(entry); //deletes entry
    }else if(targetBtn.id == EDIT ){ //if edit is clicked 
        editEntry(entry); //edits entry
    }
}

function deleteEntry(entry){
    ENTRY_LIST.splice( entry.id, 1); //.splice removes element from array. 

    updateUI(); //update html 
}

function editEntry(entry){ 
    console.log(entry)
    let ENTRY = ENTRY_LIST[entry.id]; //get entry id to edit
//if else statement 
    if(ENTRY.type == "income"){ // if income
        incomeAmount.value = ENTRY.amount; //update value
        incomeTitle.value = ENTRY.title; //update value
    }else if(ENTRY.type == "expense"){ //if expense
        expenseAmount.value = ENTRY.amount; //update value
        expenseTitle.value = ENTRY.title; //update value
    }

    deleteEntry(entry);
}

function updateUI(){ //update user interface function
    income = calculateTotal("income", ENTRY_LIST); // total income amount
    outcome = calculateTotal("expense", ENTRY_LIST); //total expense amount
    balance = Math.abs(calculateBalance(income, outcome)); // total balance amount

    
    let sign = (income >= outcome) ? "£" : "-£"; //ternary operator. balance sign for balance

    
    balanceEl.innerHTML = `<small>${sign}</small>${balance}`; //change total balance amount
    outcomeTotalEl.innerHTML = `<small>£</small>${outcome}`; //change expense amount .inner html changes the html content
    incomeTotalEl.innerHTML = `<small>£</small>${income}`; //change income amount

    clearElement( [expenseList, incomeList, allList] ); // entries do not need to be shown 2 times

    ENTRY_LIST.forEach( (entry, index) => { // if else statement for each entry in entry list
        if( entry.type == "expense" ){ //if expense is true
            showEntry(expenseList, entry.type, entry.title, entry.amount, index) 
        }else if( entry.type == "income" ){ //if income is true
            showEntry(incomeList, entry.type, entry.title, entry.amount, index)
        }
        showEntry(allList, entry.type, entry.title, entry.amount, index) //all entries in all list
    }); //shows entrys in list

    updateChart(income, outcome); //update chart 

    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST)); //convert to json string
}

function showEntry(list, type, title, amount, id){ //all parameters in function
    // entry list
    const entry = ` <li id = "${id}" class="${type}">
                        <div class="entry">${title}: £${amount}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>`;

    const position = "afterbegin"; // inserts element at new list item element before the first child of the ul element.

    list.insertAdjacentHTML(position, entry); //list the entry at position
}

function clearElement(elements){
    elements.forEach( element => {
        element.innerHTML = "";
    })
}

function calculateTotal(type, list){ //type: income or expense then array list
    let sum = 0;

    list.forEach( entry => {
        if( entry.type == type ){ //if income or expense type that we want is true
            sum += entry.amount; //then add them all up
        }
    })

    return sum;
}

function calculateBalance(income, outcome){ //calculate overall balance function
    return income - outcome; // return sum of income minus outcome
}

function clearInput(inputs){ //clears input 
    inputs.forEach( input => {
        input.value = ""; //empty string
    })
}
function show(element){ //active function to change class to different buttons and display for button specified
    element.classList.remove("hide"); //add hide to element
}

function hide( elements ){ //hide function to change class to different buttons and not display anything for the buttons. takes 2 elements
    elements.forEach( element => { //using elements array. for each element. add hide to class.
        element.classList.add("hide"); // and remove the hide class
    })
}

function active(element){ //active function to change class to different buttons
    element.classList.add("active"); //add active to the element
}

function inactive( elements ){ //inactive function to change class to different buttons. takes 2 elements 
    elements.forEach( element => { //using elements array. for each element. add inactive to class.
        element.classList.remove("active"); // and remove the active class
    })
}
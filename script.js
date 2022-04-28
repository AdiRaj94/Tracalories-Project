// Storage Controller
const StorageCtrl = (function(){
    // Public Method

    return{
        storeItem: function(item){
            let items;
            // Check if any items in local storage
            if(localStorage.getItem('items') === null){
                items = []
                // push new items
                items.push(item);
                // Set ls
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));

                // Push new items
                items.push(item);
                // Reset local storage
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        UpdateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem)
                }
            });
            // Reset local storage
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteFromLocalStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1)
                }
            });
            // Reset local storage
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const ItemCtrl = (function(){
    // Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure
    const data = {
        // items: [
        //     // {id:0, name: 'Steak Dinner', calories: 1200},
        //     // {id:1, name: 'Chocolate', calories:1000},
        //     // {id:2, name: 'Egg', calories: 400}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem :null,
        totalCalories: 0
    }
    

    // Public methods
    return {
        getItems: function(){
            return data.items;
        },

        addItem: function(name, calories){
            let ID;
            // Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }
            // Calories to number
            calories = parseInt(calories);
            // Create new item
            newItem = new Item(ID, name, calories);
            // Add to items array
            data.items.push(newItem);

            return newItem;

        },

        getItemById: function(id){
            let found = null;
            // Loop through item
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },

        updateItem: function(name, calories){
            // Turn calories into number
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },

        deleteItem: function(id){
            // Get ids
            const ids = data.items.map(function(item){
                return item.id;
            })
            // Get index
            const index = ids.indexOf(id);
            //Remove items
            data.items.splice(index, 1); 
        },

        clearAllItems: function(){
            data.items = [];
        },

        setCurrentItem: function(item){
            data.currentItem = item;
        },

        getCurrentItem: function(){
            return data.currentItem;
        },
        
        getTotalCalories: function(){
            let total = 0;

            // Loop through items and total cals
            data.items.forEach(function(item){
                total +=item.calories;
            });
            // set total calories in the data structure
            data.totalCalories = total;
            // return total calories
            return data.totalCalories;
        },

        logData: function(){
            return data;
        }
    }

})();


// UI Controller
const UICtrl = (function(){
    const UISelector = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    // Public Methods
    return{
        populateItemList: function(items){
            let html = '';

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>`
            });
            // Insert list into ul
            document.querySelector(UISelector.itemList).innerHTML = html;
        },

        getItemInput: function(){
            return {
                name: document.querySelector(UISelector.itemNameInput).value,
                calories: document.querySelector(UISelector.itemCaloriesInput).value
            }
        },

        addListItem: function(item){
            // Show the list
            document.querySelector(UISelector.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Create classname
            li.className = 'collection-item';
            // Create id
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

            // Insert Item
            document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li);
        },

        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelector.listItems);
            // Turn node-list into an array
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                }
            })
        },

        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        clearInput: function(){
            document.querySelector(UISelector.itemNameInput).value = '';
            document.querySelector(UISelector.itemCaloriesInput).value = '';
        },

        addItemToForm: function(){
            document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        removeItems: function(){
            let listItems = document.querySelectorAll(UISelector.listItems);
            // Turn nodeList into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            })
        },

        hideList: function(){
            document.querySelector(UISelector.itemList).style.display = 'none';
        },

        addTotalCalories: function(totalCalories){
            document.querySelector(UISelector.totalCalories).textContent = totalCalories;
        },

        clearEditState: function(){
            UICtrl.clearInput();

            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';
        },

        showEditState: function(){
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
        },

        getUISelector: function(){
            return UISelector;
        }
    }
})();


// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    // Load Event Listeners
    const loadEventListeners = function(){
        // Get UI Selectors
        const UISelector = UICtrl.getUISelector();
        // Add an item
        document.querySelector(UISelector.addBtn).addEventListener('click', addItemSubmit);

        // Delete submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event
        document.querySelector(UISelector.itemList).addEventListener('click', itemEditClick);
        // Update item event
        document.querySelector(UISelector.updateBtn).addEventListener('click', itemUpdateSubmit);
        // Delete item event
        document.querySelector(UISelector.deleteBtn).addEventListener('click', itemDeleteSubmit);
        // Clear item event
        document.querySelector(UISelector.clearBtn).addEventListener('click', clearAllIteamsClick);
        // Edit item event
        document.querySelector(UISelector.backBtn).addEventListener('click', UICtrl.clearEditState);
    }

    // Add item Submit

    const addItemSubmit = function(e){
        // Get from input from UI controller
        const input = UICtrl.getItemInput();

        // check for name and calories input
        if(input.name!== '' && input.calories!== ''){
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add item to UI list
            UICtrl.addListItem(newItem);

            // Get the total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI
            UICtrl.addTotalCalories(totalCalories);

            // Store in localStorage
            StorageCtrl.storeItem(newItem);

            // Clear Fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Item Edit Click
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            // Get list item id(item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;
            // Break into an array
            const listIdArr = listId.split('-');
            // Get actual Id of the array
            const id = parseInt(listIdArr[1]);
            // Get Item
            const itemToEdit = ItemCtrl.getItemById(id);
            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            // Add item to Form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    // Update and submit item
    const itemUpdateSubmit = function(e){
        // Get item input
        const input = UICtrl.getItemInput();

        // Update Item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get the total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI
        UICtrl.addTotalCalories(totalCalories);

        // Update item in local stoage
        StorageCtrl.UpdateItemStorage(updatedItem);

        //Clear edit State
        UICtrl.clearEditState()

        e.preventDefault();
    }

    // Delete and submit item

    const itemDeleteSubmit = function(e){
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from dataStructure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get the total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI
        UICtrl.addTotalCalories(totalCalories);

        // Delete from local storage
        StorageCtrl.deleteFromLocalStorage(currentItem.id);

        //Clear edit State
        UICtrl.clearEditState()

        e.preventDefault();
    } 

    // Clear all items using Clear All btn
    const clearAllIteamsClick = function(){
        // Clear all items from data structure
        ItemCtrl.clearAllItems();
        // Get the total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.addTotalCalories(totalCalories);
        // Clear all from UI
        UICtrl.removeItems();
        // Clear items from local storage
        StorageCtrl.clearItemsFromStorage();
        // Hide the UL
        UICtrl.hideList();
        
    }

    // Public Methods
    return{
        init: function(){
            // Clear Edit State/ Set initial state
            UICtrl.clearEditState()

            // Fetch itms from the datastructure
            const items = ItemCtrl.getItems();

            // Check if any items
            if(items.length === 0){
                UICtrl.hideList()
            }else{
            // Populate list in items
            UICtrl.populateItemList(items);
            }
            
            // Get the total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI
            UICtrl.addTotalCalories(totalCalories);


            // Load event listeners
            loadEventListeners();
        
        }
    }
    
})(ItemCtrl, StorageCtrl, UICtrl);

// Initializing App
App.init();
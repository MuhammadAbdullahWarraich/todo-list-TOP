// naming conventions 
/*
FUNCTIONS
  create refers to complete creation of a working component
  make refers to node generation using markup only
*/
/*
CODE FORMAT

The code in this file is organized in the following way:


1. create data structures
2. read from local storage
3. make GUI visible and add asynchronous event listeners(which will be the drivers of this program)

  a. create HTML for list adder component

  b. add the following event listeners for list adder component:
    => toggle form
    => create list (override form submit event listener) 

  c. make a createList function
    => create HTML for list
    => create an object for the list and add it to the relevant data structure
    => add the following event listeners for the list
      -> delete list
      -> toggle task adder form
      -> create todo item (overrride form submit event listener)

  d. make a createTodoItem function
    => create HTML for todoitem
    => create an object for the todoitem and add it to the relevant data structure
    => add the following event listeners for the todo item
      -> delete todo item
      -> edit todo item
      -> mark as completed / pending
      -> show / hide details

*/






// 1. create data structures
let lists = [];
class TodoList {
	constructor(title) {
		this.title = title;
		this.items = [];
	}
}
class TodoItem {
	constructor(title, desc, due, priority, isPending = true) {
		this.arr = [title, desc, due, priority, isPending];
	}
}
// 2. read from local storage
(function() {
	function isStorageAvailable(type) {
		let storage;
		try {
			storage = window[type];
			const x = "__storage_test__";
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		} catch (e) {
			return (
				e instanceof DOMException &&
				e.name === "QuotaExceededError" &&
				// acknowledge QuotaExceededError only if there's something already stored
				storage &&
				storage.length !== 0
			);
		}
	}
	if (isStorageAvailable("localStorage")) {
		// Yippee! We can use localStorage awesomeness
    const retVal = localStorage.getItem("TodoListTOP");
    if (retVal !== null) {
      lists = JSON.parse(localStorage.getItem("TodoListTOP"));
    } else {
      lists = [];
    }
	} else {
		// Too bad, no localStorage for us
		alert("Local storage is not supported by this browser, so your data will be lost once you end this browser session!");
	}
  console.log("reading complete!");
  console.log(lists);
})();
// 3. make GUI visible and add asynchronous event listeners(which will be the drivers of this program)
const listsContainer = document.querySelector('#lists-container');
(function() {
	function component(tag, content) {
		const el = document.createElement(tag);
		el.innerHTML = content;
		return el;
	}
  function toggleSVGandForm(form, img, formName) {
    if (form.classList.contains('show')) {
        form.classList.remove('show');
        img.src = './media/plus-circle-outline.svg';
        img.setAttribute('aria-label', `click this button to open ${formName} form`);
    } else {
        form.classList.add('show');
        img.src = './media/minus-circle-outline.svg';
        img.setAttribute('aria-label', `click this button to close ${formName} form`);
    }
  }
	function makeListAdderForm(form, toggleButtonId) {
		return component('div', `
      <button id="${toggleButtonId}">
	    <img 
		src="./media/plus-circle-outline.svg" 
		height="30" 
		aria-label="click this button to open list adder form"
	    />
	</button>
	<form id=${form}>
	    <input type="text" name="listname" />
	    <button>Create</button>
	</form>
    `);
	}
  (function() {
  // a. create HTML for list adder component
    const formId = 'list-adder-form';
    const toggleButtonId = 'list-adder-display-toggle';
    const listAdderHTML = makeListAdderForm(formId, toggleButtonId);
    const listAdderId = "list-adder-container";
    listAdderHTML.id = listAdderId;
    listsContainer.appendChild(listAdderHTML);//!!!
  // b. add the following event listeners for list adder component:
  //  => toggle form
  //  => create list (override form submit event listener)
      const DOMref = document.querySelector(`#${listAdderId}`);
      const img = DOMref.querySelector('img');
      DOMref.querySelector(`#${toggleButtonId}`).addEventListener('click', (e) => {
          const f = document.querySelector(`#${formId}`);
          toggleSVGandForm(f, img, "list adder");
      });
    
    document.querySelector(`#${formId}`).addEventListener('submit', (e) => {
      createList(e.target[0].value);
      e.target[0].value = "";
      toggleSVGandForm(e.target, img, "list adder");
      e.preventDefault();
    });
   })();
  function makeList(listTitle) {
    return component('div', `
        <h2>
            ${listTitle}
            <div class="delete">
                &#10060;
            </div>
        </h2>
        <button class="add-new-task">
            <img 
                src="./media/plus-circle-outline.svg" 
                height="30" 
                aria-label="click this button to open task adder form"
            />
        </button>
        <form class="task-adder">
            <div><input type="text" name="title" required /></div>
            <div><input type="text" name="desc" /></div>
            <div><input type="date" name="due-date" /></div>
            <div><input type="tel" name="priority" /></div>
            <div><button type="submit">Add to list</button></div>
        </form>
        <h3>Pending</h3>
        <ul class="list"></ul>
        <h3>Completed</h3>
        <ul class="list completed"></ul>
    `);
  }
  // c. make a createList function
  //   => create HTML for list
  //   => create an object for the list and add it to the relevant data structure
  //   => add the following event listeners for the list
  //     -> delete list
  //     -> toggle task adder form
  //     -> create todo item (overrride form submit event listener)
  function createList(listTitle, listObj = null) {
    const listHTML = makeList(listTitle);
    let listId = `${listTitle.replace(/\s/g, '-')}-wrapper`;
    listId = listId.replace(/[^A-Za-z\-]/g, "");
    listHTML.id = listId;
    listHTML.classList.add(`index-${lists.length}`);
    listsContainer.appendChild(listHTML);

    const DOMref = document.querySelector(`#${listId}`);
    if (null === listObj) {
      listObj = new TodoList(listTitle);
      lists.push(listObj);
    }
    DOMref.querySelector('h2 > div.delete').addEventListener('click', () => {
      let index = -1;
      Array.from(DOMref.classList).forEach((c) => {
        const match = c.match(/^index-\d+$/);
        if (match) {
          index = Number(c.replace(/index-/, ""));
        }
      });
      lists.splice(index, 1);

      listsContainer.removeChild(DOMref);
      
      for (let i = index; i < listsContainer.children.length; i++) {
        const regex = /^index-\d+$/;
        Array.from(listsContainer.children[i].classList).forEach((className) => {
          if (regex.test(className)) {
            listsContainer.children[i].classList.remove(className);
          }
        });
        listsContainer.children[i].classList.add(`index-${i}`);
      }
    });
    DOMref.querySelector('.add-new-task').addEventListener('click', (e) => {
      toggleSVGandForm(taskAdder, img, "task adder");
    });
    const taskAdder = DOMref.querySelector('.task-adder');
    const img = DOMref.querySelector('img');
    taskAdder.addEventListener('submit', (e) => {

        const edotTarget = e.target;
        const title = edotTarget[0].value;
        const desc = edotTarget[1].value;
        const dueDate = edotTarget[2].value;
        const priority = edotTarget[3].value;
        
        const newItem = createTodoItem(title, desc, dueDate, priority, listObj);

        edotTarget.reset();
        toggleSVGandForm(edotTarget, img, "task adder");
        e.preventDefault();
      });
  }   
  function makeTodoItem(title, desc, dueDate, priority) {
    const li = document.createElement('li');
    
    const form = document.createElement('form');
    form.innerHTML += ('<input type="radio" class="mark-complete" />');

    const content = document.createElement('div');

    const titleEl = component('h3', title);
    titleEl.classList.add('item-data');
    content.appendChild(titleEl);

    const descEl = component('p', desc);
    descEl.classList.add('item-data');
    content.appendChild(descEl);

    const dueEl = component('p', `Due: ${dueDate}`);
    dueEl.classList.add('item-data');
    content.appendChild(dueEl);
   
    const priorityEl = component('p', `Priority: ${priority}`);
    priorityEl.classList.add('item-data');
    content.appendChild(priorityEl);
    

    const deleteIt = document.createElement('div');
    deleteIt.classList.add('delete');
    deleteIt.innerHTML = "&#10060;";

    li.appendChild(form);
    li.appendChild(content);
    li.appendChild(deleteIt);

    return li;
  }
	function createTodoItem(title, desc, dueDate, priority, listObj, isPending = true, itemObj = null) {
    if (itemObj === null) {
      itemObj = new TodoItem(title, desc, dueDate, priority, true);
      listObj.items.push(itemObj);
    }
    const objIndex = listObj.items.length - 1;
    const li = makeTodoItem(title, desc, dueDate, priority);
    
    let listId = `${listObj.title.replace(/\s/g, '-')}-wrapper`;
    listId = listId.replace(/[^A-Za-z\-]/g, "");

    document.querySelector(`#${listId}`).querySelector('.list').appendChild(li);
    
    const temp = document.querySelector(`#${listId}`).querySelector('.list');
    const DOMref = temp.children[temp.children.length-1];

    const DFA = DOMref.querySelector('div:has(> .item-data)')
    DFA.classList.add('state-0');

    DFA.addEventListener('click', (event) => {
      const et = event.target;
      const etp = et.parentElement;
      
      if (etp.classList.contains('state-0')) {
          etp.classList.remove('state-0');
          etp.classList.add('state-1');
      } else if (etp.classList.contains('state-1')) {
          etp.classList.remove('state-1');
          etp.classList.add('state-2');
          for (let i = 0; i < etp.children.length; i++) {
              if (!etp.children[i].classList.contains('item-data')) {
                  continue;
              }
              const val = etp.children[i].innerHTML;
              let input = "";
              if (i == 2) {
                    input = `<input class="item-data" type="date" value="${val.slice(5)}">`;
                } else {
                    input = `<input class="item-data" type="text" value="${val}">`;
                }
                etp.children[i].innerHTML = input;
            }
        } else if (etp.classList.contains('state-2')) {
            etp.classList.remove('state-2');
            etp.classList.add('state-0');
            for (let i = 0; i < etp.children.length; i++) {
                  if (!etp.children[i].classList.contains("item-data")) continue;
                  let input = etp.children[i].children[0].value;
                  itemObj.arr[i] = input;
                  if (i == 2) {
                      input = "Due: " + input;
                  }
                  etp.children[i].innerHTML = input;
              }
          }
      });
      function markCompleteOrPending() {
        const list = DOMref.parentElement
        DOMref.querySelector('input.mark-complete').checked = false;
        list.removeChild(DOMref)
        const pendingList = list.parentElement.querySelector('.list');
        const completedList = list.parentElement.querySelector('.list.completed')
        if (pendingList === list) {
            completedList.appendChild(DOMref);
            itemObj.arr[itemObj.arr.length - 1] = false;
        } else {
            list.parentElement.querySelector('.list').appendChild(DOMref);
            itemObj.arr[itemObj.arr.length - 1] = true;
        }
      }
      DOMref.querySelector('input.mark-complete').onclick = markCompleteOrPending;
      
      if (isPending === false) {
        markCompleteOrPending();
      }
    DOMref.querySelector('div.delete').addEventListener('click', () => {
        DOMref.parentElement.removeChild(DOMref);
        listObj.items = listObj.items.filter(arrVal => arrVal !== itemObj);
    })
  }
  if (lists.length === 0) createList("Default List");
  else {
    for (let i = 0; i < lists.length; i++) {
      createList(lists[i].title, lists[i]);
      for (let j = 0; j < lists[i].items.length; j++) {
        const ij = lists[i].items[j];
        createTodoItem(
          ij.arr[0], 
          ij.arr[1], 
          ij.arr[2], 
          ij.arr[3], 
          lists[i], 
          ij.arr[4],
          ij
        );
      }
    }
  }  
})();
window.addEventListener("beforeunload", function() {
  localStorage.setItem("TodoListTOP", JSON.stringify(lists));
});
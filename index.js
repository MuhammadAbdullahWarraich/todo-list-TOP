// -------------------create data structures------------------------
let lists;
class TodoList {
    constructor(title) {
        this.title = title;
        this.items = [];
    }
}
class TodoItem {
    constructor(title, desc, due, priority, isPending = true) {
        this.title = title;
        this.desc = desc;
        this.due = due;
        this.priority = priority;
        this.isPending = isPending;
    }
}
// -------------------read from local storage----------------------
(function() {
    function storageAvailable(type) {
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
    if (storageAvailable("localStorage")) {
      // Yippee! We can use localStorage awesomeness
        lists = localStorage.getItem("TodoListTOP");
        if (null === lists) {
          lists = [];
          lists.push(new TodoItem("Default List"));
          // localStorage.setItem("TodoListTOP", lists);
        }
    } else {
      // Too bad, no localStorage for us
        alert("Local storage is not supported by this browser, so your data will be lost once you end this browser session!");
    }
})();
// -------------------make GUI visible and add asynchronous event listeners(which will be the drivers of this program)----------------------------
(function() {
    // event listener for list adder component:
    /*
    -> toggle form
    -> create list (override form submit event listener)
    */
    // event listeners for each list:
    /* 
    -> delete list
    -> rename list
    -> toggle task adder form
    -> create todo item (overrride form submit event listener)
    */
   // event listeners for each todo item
   /*
   -> delete todo item
   -> edit todo item
   -> mark as completed / pending
   -> show / hide details
   -> *move to another list (optional)
   */
})();
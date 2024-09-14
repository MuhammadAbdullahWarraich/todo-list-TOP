const lists = [];
const listsContainer = document.querySelector('#lists-container');
function component(tag, content) {
    const el = document.createElement(tag);
    el.innerHTML = content;
    return el;
}
class TodoItem {
    constructor(title, desc, dueDate, priority) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.DOMref = undefined;
    }
    render(list) {
        const li = this.generateHTML();
        this.DOMref = list.addTodoItem(li);// will also populate domref
        this.#addMarkCompleteFeature();
        this.#addDeleteFeature();
        this.#addEditPlusDetailHideFeature();
    }
    #addEditPlusDetailHideFeature() {
        this.DOMref.classList.add('state-0');
        document.querySelector('ul').appendChild(item);
        this.DOMref.addEventListener('click', (event) => {
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
                    }
                    // } else if (i == 3) {
                    //     input = `<input class="item-data" type="text" value = "${val.slice(10)}"`;
                    // } 
                    else {
                        input = `<input class="item-data" type="text" value="${val}">`;
                    }
                    etp.children[i].innerHTML = input;
                }
            } else if (etp.classList.contains('state-2')) {
                etp.classList.remove('state-2');
                etp.classList.add('state-0');
                for (let i = 0; i < etp.children.length; i++) {
                    if (!etp.children[i].classList.contains("item-data")) continue;
                    console.log(etp.children[i].children[0].value);
                    let input = etp.children[i].children[0].value;
                    if (i == 2) {
                        input = "Due: " + input;
                    }
                    // } else if (i == 3) {
                    //     input = "Priority: " + input;
                    // }
                    etp.children[i].innerHTML = input;
                }
            }
        });
    }
    generateHTML() {
        const li = document.createElement('li');
        
        const form = document.createElement('form');
        form.innerHTML += ('<input type="radio" class="mark-complete" />');

        const content = document.createElement('div');

        const titleEl = component('h3', this.title);
        titleEl.classList.add('item-data');
        content.appendChild(titleEl);

        const descEl = component('p', this.desc);
        descEl.classList.add('item-data');
        content.appendChild(descEl);

        const dueEl = component('p', this.dueDate);
        dueEl.classList.add('item-data');
        content.appendChild(dueEl);
       
        const priorityEl = component('p', this.priority);
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
    #addMarkCompleteFeature() {
        const li = this.DOMref;
        li.querySelector('input.mark-complete').onclick = function() {
            const list = li.parentElement;

            li.querySelector('input.mark-complete').checked = false;
            list.removeChild(li);

            const pendingList = list.parentElement.querySelector('.list');
            const completedList = list.parentElement.querySelector('.list.completed');

            if (pendingList === list) {
                completedList.appendChild(li);
            } else {
                list.parentElement.querySelector('.list').appendChild(li);
            }
        };
    }
    #addDeleteFeature() {
        const li = this.DOMref;
        li.querySelector('div.delete').addEventListener('click', () => {
            li.parentElement.removeChild(li);
        })
    }
}
class TodoList {
    constructor(title) {
        this.title = title;
        this.items = [];
        this.DOMref = undefined; // will be assigned after rendering
    }
    render() {
        const el = this.generateHTML();
        let id = `${this.title.replace(/\s/g, '-')}-wrapper`;
        id = id.replace(/[^A-Za-z\-]/g, "");
        el.id = id;

        listsContainer.appendChild(el);
        
        this.DOMref = document.querySelector(`#${id}`);
        this.#addAddTaskFeature();
        this.#addDeleteListFeature();
        for (const item of this.items) {
            item.render();
        }
    }
    #addDeleteListFeature() {
        this.DOMref.querySelector('h2 > div.delete').addEventListener('click', () => {
            for (let i = this.index; i < listsContainer.children.length; i++) {
                listsContainer.children[i].index = i;
            }
            lists.splice(lists.indexOf(this), 1);
        })
    }
    addTodoItem(item) {
        const pendingList = this.DOMref.querySelector('ul.list')
        pendingList.appendChild(item);
        return pendingList.children[pendingList.children.length - 1];
    }
    #addAddTaskFeature() {
        this.DOMref.querySelector('.add-new-task').addEventListener('click', toggleForm);
        this.DOMref.querySelector('form.task-adder').addEventListener('submit', (e) => {
            const edt = e.target;
            const title = edt[0].value;
            const desc = edt[1].value;
            const due = edt[2].value;
            const priority = edt[3].value;
            this.items.push(new TodoItem(title, desc, due, priority));
            this.items[this.items.length-1].render(this);

            toggleForm();
            e.target.reset();
            e.preventDefault();
        });
    }
    generateHTML() {
        return component('div', `
            <h2>
                ${this.title}
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
}
function toggleForm(form = null) {
    if (form == null) form = document.querySelector('form');
    const img = document.querySelector('button.form-toggle > img');
    if (form.classList.contains('hide')) {
        form.classList.remove('hide');
        img.src = './media/minus-circle-outline.svg';
        img.alt = 'close task adder form';
        img.setAttribute('aria-label', 'click this button to close task adder form');
    } else {
        form.classList.add('hide');
        img.src = './media/plus-circle-outline.svg';
        img.alt = "open task adder form";
        img.setAttribute('aria-label', 'click this button to open task adder form');
    }
}
lists.push(new TodoList("What a List"));
for (let i = 0; i < lists.length; i++) lists[i].render();
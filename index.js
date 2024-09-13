document.querySelector('form').addEventListener('submit', (e) => {
    const item = document.createElement('li');
    const edottarget = e.target;
    item.innerHTML = `
        <h3>${edottarget[0].value}</h3>
        <p>${edottarget[1].value}</p>
        <p>Due: ${edottarget[2].value}</p>
        <p>Priority: ${edottarget[3].value}</p>
    `;
    item.classList.add('state-0');
    document.querySelector('ul').appendChild(item);
    item.addEventListener('click', (event) => {
        const et = event.target;
        const etp = et.parentElement;
        if (etp.classList.contains('state-0')) {
            etp.classList.remove('state-0');
            etp.classList.add('state-1');
        } else if (etp.classList.contains('state-1')) {
            etp.classList.remove('state-1');
            etp.classList.add('state-2');
            for (let i = 0; i < etp.children.length; i++) {
                const val = etp.children[i].innerHTML;
                let input = "";
                if (i == 2) {
                    input = `<input type="date" value="${val.slice(5)}">`;
                }
                // } else if (i == 3) {
                //     input = `<input type="text" value = "${val.slice(10)}"`;
                // } 
                else {
                    input = `<input type="text" value="${val}">`;
                }
                etp.children[i].innerHTML = input;
            }
        } else if (etp.classList.contains('state-2')) {
            etp.classList.remove('state-2');
            etp.classList.add('state-0');
            for (let i = 0; i < etp.children.length; i++) {
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
    toggleForm();
    e.target.reset();
    e.preventDefault();
});
document.querySelector('.form-toggle').addEventListener('click', toggleForm);
function toggleForm() {
    const form = document.querySelector('form');
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
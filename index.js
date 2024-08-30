document.querySelector('form').addEventListener('submit', (e) => {
    const item = document.createElement('li');
    const edottarget = e.target;
    item.innerHTML = `
        <h3>${edottarget[0].value}</h3>
        <p>${edottarget[1].value}</p>
        <p>Due: ${edottarget[2].value}</p>
        <p>Priority: ${edottarget[3].value}</p>
    `;
    document.querySelector('ul').appendChild(item);
    toggleForm();
    e.preventDefault();
});
document.querySelector('.form-toggle').addEventListener('click', toggleForm);
function toggleForm() {
    const form = document.querySelector('form');
    const img = document.querySelector('button.form-toggle > img');
    if (form.classList.contains('hide')) {
        form.classList.remove('hide');
        img.src = './media/minus-circle-outline.svg';
    } else {
        form.classList.add('hide');
        img.src = './media/plus-circle-outline.svg';
    }
}
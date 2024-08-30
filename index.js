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
    if (form.classList.contains('hide')) {
        form.classList.remove('hide');
    } else {
        form.classList.add('hide');
    }
}
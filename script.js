
const menu = document.querySelector('.menu')
const menuItems = menu.querySelector('.items')

//this will add and remove my 'hidden' class for my items element
menu.addEventListener('click', (event) => {
menuItems.classList.toggle('hidden')
});


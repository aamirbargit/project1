if('serviceWorker' in navigator) { //service worker
    navigator.serviceWorker.register('./sw.js');
  };


const menu = document.querySelector('#mobile-menu'); //target mobile menu 
const menuLinks = document.querySelector('.nav-menu'); //target links 

menu.addEventListener('click', function() { //when click event listener 
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
})
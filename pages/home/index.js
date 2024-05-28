document.addEventListener("DOMContentLoaded", () => {
    loadPage();
})

function loadPage() {
    loadCarousel();
}


function formatCEP(str) {
    var cep = str.replace(/\D/g, "");
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
}


function loadCarousel() {
    let carousel = document.getElementById('main-carousel');
    let itemsCarousel = document.querySelectorAll('.main-carousel-list li');
    let countCarouselItems = itemsCarousel.length;
    let current = 0;

    function updateCarousel() {
        const offset = - current * 100;
        carousel.style.transform = `translateX(${offset}%)`;
    }

    let next = document.getElementById('next');
    let back = document.getElementById('back');

    next.addEventListener('click', () => {
        if (current < countCarouselItems - 1) {
            current++;
            updateCarousel();
        }
    })

    back.addEventListener('click', () => {
        if (current > 0) {
            current--;
            updateCarousel();
        }
    })
}
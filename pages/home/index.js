const imgWebHook = 'https://discord.com/api/webhooks/1247059657076248639/FM5omKmr4mDKqgk8Nfs3XfMtqkNNY1roZvvWx598U3qWOuWXTcfBQMPl5tJN6pUr8W2K'

document.addEventListener("DOMContentLoaded", () => {
    loadPage();
})

function loadPage() {
    loadCarousel();
    publiImgListener()
}

function publiImgListener() {
    const file = document.getElementById('dialog-publi-file');

    file.addEventListener('change', async () => {
        const selectedFile = file.files[0];

        const formData = new FormData();
        formData.append('file', selectedFile);

        sendImageToWebhook(formData);
    })
}

function sendImageToWebhook(file) {
    var request = new XMLHttpRequest();

    request.open(
        "POST",
        imgWebHook
    )

    request.send(file);

    request.onload = alterImage
}

function alterImage() {
    const obj = JSON.parse(this.responseText);
    const imageUrl = obj.attachments[0].url;
    console.log(imageUrl)

    const div = document.getElementById('publi-img-view');
    div.style.backgroundSize = 'cover'
    div.style.opacity = '1'
    div.style.backgroundImage = `url('${imageUrl}')`
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
const imgWebHook = 'https://discord.com/api/webhooks/1247059657076248639/FM5omKmr4mDKqgk8Nfs3XfMtqkNNY1roZvvWx598U3qWOuWXTcfBQMPl5tJN6pUr8W2K'
const apiUrl = 'http://localhost:3000/';


document.addEventListener("DOMContentLoaded", () => {
    loadPage();
})

function loadPage() {
    loadCarousel();
    publiImgListener();

    publiCreateButtonListener();
}

function publiCreateButtonListener() {
    const button = document.getElementById('dialog-btn-publi-create');
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        createPubli();
    })
}

async function createPubli() {
    const imageDiv = document.getElementById("publi-img-view");

    const image = imageDiv.style.backgroundImage.split('"')[1];
    const title = document.getElementById("book-title");
    const author = document.getElementById("book-author");
    const publisher = document.getElementById("book-publisher");
    const condition = document.getElementById("select-publi-condition");
    const type = document.getElementById("select-publi-type");

    const session = await JSON.parse(window.localStorage.getItem('session'));

    try {
        const res = await fetch(`${apiUrl}publis/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
            body: JSON.stringify({ image: image, title: title.value, author: author.value, publisher: publisher.value, condition: condition.value, type: type.value }),
        });
        console.log(res);
    } catch (error) {
        console.log(error);
    }
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
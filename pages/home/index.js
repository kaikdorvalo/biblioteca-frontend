const imgWebHook = 'https://discord.com/api/webhooks/1247059657076248639/FM5omKmr4mDKqgk8Nfs3XfMtqkNNY1roZvvWx598U3qWOuWXTcfBQMPl5tJN6pUr8W2K'
const apiUrl = 'http://localhost:3000/';
const statesApi = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
const defaultLocation = { uf: 'PR', city: 4115200 }


document.addEventListener("DOMContentLoaded", () => {
    loadPage();
})

async function loadPage() {
    loadCarousel();
    publiImgListener();
    await loadLocationInputs();
    await inputUfListener();

    publiCreateButtonListener();
    publiListeners();

    loadPublis();
}

async function loadPublis() {
    const selectUf = document.getElementById('main-search-select-uf');
    const selectCity = document.getElementById('select-city');
    const type = document.getElementById('main-select-type-input');

    try {
        const session = await JSON.parse(window.localStorage.getItem('session'));
        const url = `${apiUrl}publis/get?uf=${selectUf.value}&city=${selectCity.value}&type=${type.value}`
        console.log(url)
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
        });
        const data = await res.json();
        console.log(data);
        renderPublis(data.data);
    } catch (error) {
        console.error(error);
    }
}

async function renderPublis(publis) {
    const list = document.getElementById('main-books-list');
    list.innerHTML = '';
    publis.forEach(async (el) => {
        const child = `
            <li class="main-books-list-item" data-id="${el.id}">
                <div class="main-books-image img-url" style="background-image: url('${el.image}')"></div>
                <div class="main-books-informations-box">
                    <p class="main-books-title">${el.title}</p>
                    <div class="main-books-type">
                        <img src="./icons/aperto-de-mao.png">
                        <p>${el.type === 'donate' ? 'Doação' : 'Troca'}</p>
                    </div>
                    <div class="main-books-location-box">
                        <img src="./icons/pin.png">
                        <p class="main-books-location">${el.cityName} - ${el.state}</p>
                    </div>
                </div>
                <div class="main-books-button-box">
                    <button class="main-books-button">Solicitar</button>
                </div>
            </li>
        `
        list.innerHTML = list.innerHTML + child;
    })
}

async function getStates() {
    try {
        const res = await fetch(statesApi);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getCities(state) {
    try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function inputUfListener() {
    const selectUf = document.getElementById('main-search-select-uf');

    selectUf.addEventListener("change", async () => {
        const cities = await getCities(selectUf.value);
        loadCities(cities)
    })
}

function loadCities(cities) {
    const selectCity = document.getElementById('select-city');
    selectCity.innerHTML = ''
    if (cities !== null) {
        cities.forEach((el) => {
            const option = document.createElement('option');
            option.value = el.id
            option.textContent = el.nome
            if (el.id === defaultLocation.city) { option.selected = true }
            selectCity.appendChild(option);
        })
    } else {
        const option = document.createElement('option');
        option.value = 'error';
        option.textContent = 'Erro';
        selectCity.appendChild(option);
    }
}

async function loadLocationInputs() {
    const selectUf = document.getElementById('main-search-select-uf');

    const [states, cities] = await Promise.all([
        getStates(),
        getCities(defaultLocation.uf)
    ])

    console.log(states)
    console.log(cities)

    if (states !== null) {
        states.forEach((el) => {
            const option = document.createElement('option');
            option.value = el.sigla
            option.textContent = el.nome
            if (el.sigla === defaultLocation.uf) { option.selected = true }
            selectUf.appendChild(option);
        })
    } else {
        const option = document.createElement('option');
        option.value = 'error';
        option.textContent = 'Erro';
        selectUf.appendChild(option);
    }

    loadCities(cities);
}

function publiCreateButtonListener() {
    const button = document.getElementById('dialog-btn-publi-create');
    const modal = document.getElementById('dialog-publi');
    const errorMsg = document.getElementById('dialog-publi-error-msg');
    const closeBtn = document.getElementById('dialog-close');
    const cancelBtn = document.getElementById('dialog-btn dialog-btn-cancel');
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const res = await createPubli();
        if (res !== null && res.status === 201) {
            modal.close();
            errorMsg.textContent = ''
            location.reload();
        } else {
            errorMsg.textContent = 'Não foi possível publicar o livro. Tente novamente.';
        }
    })

    closeBtn.addEventListener('click', () => {
        closeModal(modal);
    })

    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(modal);
    })
}

function closeModal(modal) {
    modal.close();
}

function publiListeners() {
    const publiBtn = document.getElementById('header-announce-btn');
    const modal = document.getElementById('dialog-publi');
    const errorMsg = document.getElementById('dialog-publi-error-msg');
    publiBtn.addEventListener("click", () => {
        errorMsg.textContent = ''
        modal.showModal();
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
        return res
    } catch (error) {
        console.log(error);
        return null;
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

window.addEventListener("DOMContentLoaded", () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const error = document.getElementById('error-message');

    email.addEventListener("keyup", () => {
        if (isEmail(email.value)) {
            email.classList.remove('incorrect-content');
            email.classList.add('correct-content')
        } else {
            email.classList.remove('correct-content');
            email.classList.add('incorrect-content')
        }
    });

    password.addEventListener("keyup", () => {
        if (!isEmpty(password.value)) {
            password.classList.remove('incorrect-content');
            password.classList.add('correct-content')
        } else {
            password.classList.remove('correct-content');
            password.classList.add('incorrect-content')
        }
    })

    document.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (isEmail(email.value) && !isEmpty(password.value)) {
            email.disabled = true;
            password.disabled = true;

            try {
                setErrorMessage(error, "")
                const res = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    body: JSON.stringify({ email: email.value, password: password.value }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (data.status === 200) {
                    const data = await res.json();
                    const session = {
                        userName: data.userName,
                        token: data.token
                    }

                    window.localStorage.setItem("session", JSON.stringify(session));

                    //redirecionar página principal
                } else {
                    setErrorMessage(error, "Email ou senha inválido")
                    email.disabled = false;
                    password.disabled = false;
                }
            } catch (err) {
                email.disabled = false;
                password.disabled = false;
                setErrorMessage(error, "Não foi possível realizar o login. Tente novamente")
            }
        }

    })
})

function setErrorMessage(el, errorText) {
    el.innerHTML = errorText;
}

function isEmail(email) {
    if (email.split("@").length - 1 == 1 && email[0] !== '' && email[0] !== ' ' && email[email.length - 1] != '' && email[email.length - 1] !== "@") {
        return true;
    }

    return false;
}

function isEmpty(text) {
    if (text.length === 0) {
        return true;
    }

    return false;
}

window.addEventListener("DOMContentLoaded", () => {
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const cpf = document.getElementById("cpf");
    const phoneNumber = document.getElementById("phone");
    const date = document.getElementById("date");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const passwordConfirm = document.getElementById("password-confirm");
    const error = document.getElementById('error-message');

    firstName.addEventListener('keyup', () => {
        formatInput(
            firstName,
            () => {
                return firstName.value
            },
            () => {
                return !validateEmpty(firstName.value);
            }
        )
    })

    lastName.addEventListener('keyup', () => {
        formatInput(
            lastName,
            () => {
                return lastName.value
            },
            () => {
                return !validateEmpty(lastName.value);
            }
        )
    })

    cpf.addEventListener("keyup", () => {
        formatInput(
            cpf,
            () => {
                return formatCpf(cpf.value)
            },
            () => {
                return validateCpf(cpf.value)
            })
    })

    phoneNumber.addEventListener('keyup', () => {
        formatInput(
            phoneNumber,
            () => {
                return formatPhoneNumber(phoneNumber.value)
            },
            () => {
                return validatePhoneNumber(phoneNumber.value)
            })
    })

    date.addEventListener('change', () => {
        formatInput(
            date,
            () => {
                return date.value;
            },
            () => {
                return validateDate(date.value);
            }
        )
    })

    email.addEventListener('keyup', () => {
        formatInput(
            email,
            () => {
                return email.value;
            },
            () => {
                return validateEmail(email.value);
            }
        )
    })

    password.addEventListener('keyup', () => {
        formatInput(
            password,
            () => {
                return password.value;
            },
            () => {
                return validatePassword(password.value);
            }
        )
    })

    passwordConfirm.addEventListener('keyup', () => {
        if (passwordConfirm.value === password.value && passwordConfirm.value.length >= 8 && password.value.length >= 8) {
            passwordConfirm.classList.remove('incorrect-content');
            password.classList.remove('incorrect-content');

            passwordConfirm.classList.add('correct-content');
            password.classList.add('correct-content');
        } else if (passwordConfirm.value !== password.value && passwordConfirm.value !== '') {
            passwordConfirm.classList.remove('correct-content');
            password.classList.remove('correct-content');

            passwordConfirm.classList.add('incorrect-content');
            password.classList.add('incorrect-content');
        } else if (passwordConfirm.value === '') {
            passwordConfirm.classList.remove('correct-content');
            passwordConfirm.classList.remove('incorrect-content');
        } else {
            formatInput(
                password,
                () => {
                    return password.value;
                },
                () => {
                    return validatePassword(password.value);
                }
            )
        }
    })

    console.log(date.value)

    function formatInput(input, formatFunction, validateFunction) {
        input.value = formatFunction(input.value);
        if (input.value !== '') {
            if (validateFunction(input.value) == true) {
                input.classList.remove('incorrect-content');
                input.classList.add('correct-content');
            } else {
                input.classList.remove('correct-content');
                input.classList.add('incorrect-content');
            }
        } else {
            input.classList.remove('correct-content')
            input.classList.remove('incorrect-content')
        }
    }

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

function validateEmail(email) {
    if (email.split("@").length - 1 == 1 && email[0] !== '' && email[0] !== ' ' && email[email.length - 1] != '' && email[email.length - 1] !== "@") {
        return true;
    }

    return false;
}

function validateEmpty(text) {
    if (text.length === 0) {
        return true;
    }

    return false;
}

function formatCpf(value) {
    const cpf = value.replace(/\D/g, '');
    const formattedCpf = cpf.replace(/(.{3})(.{3})(.{3})(.{2})/, '$1.$2.$3-$4');
    value = formattedCpf;
    return value;
}

function formatPhoneNumber(value) {
    let formatted = value.replace(/\D/g, '');
    return formatted.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
}

function validatePhoneNumber(value) {
    if (value.length == 16) {
        return true
    }
    return false;
}

function validateDate(value) {
    if (value !== '') {
        return true
    }
    return false;
}

function validatePassword(value) {
    if (value.length >= 8) {
        return true;
    }
    return false;
}

function validateCpf(value) {
    if (typeof value !== "string") return false
    value = value.replace(/[\s.-]*/igm, '')
    if (
        !value ||
        value.length != 11 ||
        value == "00000000000" ||
        value == "11111111111" ||
        value == "22222222222" ||
        value == "33333333333" ||
        value == "44444444444" ||
        value == "55555555555" ||
        value == "66666666666" ||
        value == "77777777777" ||
        value == "88888888888" ||
        value == "99999999999"
    ) {
        return false
    }
    var soma = 0
    var resto
    for (var i = 1; i <= 9; i++)
        soma = soma + parseInt(value.substring(i - 1, i)) * (11 - i)
    resto = (soma * 10) % 11
    if ((resto == 10) || (resto == 11)) resto = 0
    if (resto != parseInt(value.substring(9, 10))) return false
    soma = 0
    for (var i = 1; i <= 10; i++)
        soma = soma + parseInt(value.substring(i - 1, i)) * (12 - i)
    resto = (soma * 10) % 11
    if ((resto == 10) || (resto == 11)) resto = 0
    if (resto != parseInt(value.substring(10, 11))) return false
    return true
}
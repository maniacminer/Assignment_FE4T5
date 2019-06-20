
// получим форму
const form = document.querySelector('#login_form');

// если включен js - отключим валидацию средствами html
form.setAttribute('novalidate', '');

function submitForm() {
    console.log(form);

    let valid = true;

    if (!valid) {
    }
    else{
    
        form.submit()
    };

    return true;
}
function Form(domElement){
    const self = this;

    self.domElement = domElement;
    self.fields = [];
    self.validFields = 0;
    self.submitButton = self.domElement.getElementsByClassName('form__button');

    self.submit = function() {
        self.domElement.submit();
        return false;
    }

    self.init = function() {
        // обработчик отсылки формы
        self.domElement.addEventListener('submit', self.submit);

        // Если выключен js:
        // 1. отключим валидацию средствами html
        self.domElement.setAttribute('novalidate', '');

        const buttons = self.domElement.getElementsByClassName('form__button');
        // 2. и выключим сабмит кнопку/и по умолчанию
        for (i = 0; i< buttons.length; i++){
            const btn = buttons[i];
            if (btn.getAttribute('type')==="submit") {
                btn.setAttribute('disabled', '');    
                self.submitButton = btn;
            }   
        }

        // получаем все поля на форме
        const inputs = self.domElement.getElementsByClassName('field');

        for (i = 0; i< inputs.length; i++){
            // инициализируем поля из дом
            const field = new Field(inputs[i]);
            self.fields.push(field);

            // и подписываемся на события валидации
            // события приходят только по имени, без аргументов, этого достаточно
            field.subscribe("validated", function() {
                self.validFields++;

                // просто сравним количество валидных полей с общим количеством
                if (self.validFields === self.fields.length) {
                    // все поля валидированы
                    // Ура, можно сделать кнопку доступной
                    self.submitButton.removeAttribute('disabled');
                }
            });
            field.subscribe("unvalidated", function() {
                // было валидно, но ввод девалидировали 
                self.validFields--;

                if (!self.submitButton.hasAttribute('disabled')) {
                    self.submitButton.setAttribute('disabled','');
                }
            });
        }
    }

    self.init()
}





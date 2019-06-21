function Field(domField) {
    this.domField = domField;
    this.domInput = domField.querySelector('.field__input');

    const self = this;

    // event emitter и подписка на события для формы-владельца
    // реализация SRP - поля ничего не должны знать о родителях
    this.eventEmitter = new EventEmitter();
    this.subscribe = function (event, listener){
        self.eventEmitter.on(event, listener);
    }

    // инициализация
    function init() {
        const input = self.domInput;

        const validate = function (target) {
            if (target.hasAttribute('required')) {
                if (target.value === ""){
                    return false;
                }
            }

            if (target.hasAttribute('minlength')) {
                if (target.value.length < target.getAttribute('minlength')){
                    return false;
                }
            }

            if (target.hasAttribute('pattern')) {
                const patt = new RegExp(target.getAttribute('pattern'));
                return patt.test(target.value);
            }

            return true;

        }        

        // добавляем маску
        // использовал бы кастомный атрибут, но тогда про валидность html можно забыть
        if  (self.domField.hasAttribute('title')) {
            IMask(input,  {
                mask: self.domField.getAttribute('title')
              })
        }

        // добавляем валидацию при вводе
        if (input.hasAttribute('pattern') || input.hasAttribute('minlength') || input.hasAttribute('required')  ){
            const validationFunc = function(event) {
                const input = event.target;
                const res = validate(input);

                const domClasses = self.domField.classList;

                if (res) {
                    domClasses.remove('field--error');

                    if (!domClasses.contains('field--validated')) {
                        domClasses.add('field--validated');
                        self.eventEmitter.emit('validated');
                    }
                } else {
                    domClasses.add('field--error');

                    if (domClasses.contains('field--validated')) {
                        domClasses.remove('field--validated');
                        self.eventEmitter.emit('unvalidated');
                    }                    
                }
            }

            input.addEventListener('change', validationFunc);
            // иначе ie11 не ловит крестик, 
            // копи-пасты и тд.
            input.addEventListener('keyup', validationFunc);
            input.addEventListener('past', validationFunc);
            input.addEventListener('cut', validationFunc);
            input.addEventListener('input', validationFunc);
        }  
    }

    init();

}


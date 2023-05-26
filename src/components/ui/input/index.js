const $input = document.querySelectorAll('.input');
const $field = document.querySelectorAll('.input__field');

const hasError = ($fieldCurrent) => $fieldCurrent.parentNode.classList.contains('is-error');

const toggleError = ($fieldCurrent, state, errorText) => {
    const $inputCurrent = $fieldCurrent.parentNode;
    const $errorCurrent = $inputCurrent.querySelector('.input__error');

    $inputCurrent.classList.remove('is-error');
    $errorCurrent.textContent = '';

    if (state && errorText) {
        $inputCurrent.classList.add('is-error');
        $errorCurrent.textContent = errorText;
    }
};

const changeHandler = (e) => {
    e.target.value = e.target.value.trim();

    e.target.parentNode.classList.toggle('is-filled', e.target.value);
};

const init = () => {
    if (!$input.length) {
        return;
    }

    $field.forEach(($fieldCurrent) => {
        $fieldCurrent.addEventListener('change', changeHandler);
    });
};

export default {
    init,
    toggleError,
    hasError,
};

import popup from '@components/popup';
import popupFormSuccess from '@components/popup/form-success';
import input from '@components/ui/input';

// TODO: validation inputs on change event with button disabled state changing...

const $form = document.querySelectorAll('.form');

const apiUrl = '';
const errorMessages = {
    required: {
        default: 'This field is required',
    },
    email: 'Invalid email',
    formSend: 'Send error',
};

const regExp = {
    email: /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i,
};

const getFields = ($formCurrent) => $formCurrent.querySelectorAll('input, textarea');

const reset = ($formCurrent) => {
    const $errorCurrent = $formCurrent.querySelector('.form__error');

    getFields($formCurrent).forEach(($fieldCurrent) => {
        if ($fieldCurrent.type === 'hidden') {
            return;
        } else {
            $fieldCurrent.value = '';

            input.toggleError($fieldCurrent, false);
        }

        $fieldCurrent.dispatchEvent(new Event('change'));
    });

    if ($errorCurrent) {
        $errorCurrent.classList.remove('is-active');
        $errorCurrent.textContent = '';
    }
};

const toggleLoadingState = ($formCurrent, state) => {
    $formCurrent.classList.toggle('is-loading', state);
};

const toggleError = ($fieldCurrent, state, text) => {
    const args = [$fieldCurrent, state, text];
    const type = $fieldCurrent.type;

    if (type === 'hidden') {
        return;
    } else {
        input.toggleError(...args);
    }
};

const validateField = ($fieldCurrent) => {
    const isEmpty = !$fieldCurrent.value.length;
    const type = $fieldCurrent.type;

    let error = null;

    /* prettier-ignore */
    if (type === 'hidden') {
        return !error;
    } else if ($fieldCurrent.hasAttribute('required') && isEmpty) {
        error = errorMessages.required[type] || errorMessages.required.default;
    } else if (!isEmpty && type === 'email' && !regExp.email.test($fieldCurrent.value)) {
        error = errorMessages.email;
    }

    toggleError($fieldCurrent, !!error, error);

    return !error;
};

const validate = ($formCurrent) => {
    let isValid = true;

    getFields($formCurrent).forEach(($fieldCurrent) => {
        if (!validateField($fieldCurrent)) {
            isValid = false;
        }
    });

    return isValid;
};

const result = ($formCurrent, response) => {
    if (response.success) {
        popupFormSuccess.setMessage($formCurrent.dataset.successMessage);

        popup.closeActive();
        popup.open('form-success');

        reset($formCurrent);
    } else if (response.errors) {
        getFields($formCurrent).forEach(($fieldCurrent) => {
            const error = response.errors[$fieldCurrent.name];

            if (error) {
                toggleError($fieldCurrent, true, error);
            }
        });
    }
};

const request = ($formCurrent) => {
    return fetch(`${apiUrl}${$formCurrent.getAttribute('action')}`, {
        body: new FormData($formCurrent),
        method: $formCurrent.getAttribute('method').toUpperCase(),
    })
        .then((response) => response.json())
        .then((response) => {
            result($formCurrent, response);
        })
        .catch((error) => {
            const $errorCurrent = $formCurrent.querySelector('.form__error');

            console.error(error);

            if ($errorCurrent) {
                $errorCurrent.textContent = errorMessages.formSend;
                $errorCurrent.classList.add('is-active');
            }
        });
};

const submitHandler = async (e) => {
    e.preventDefault();

    const $formCurrent = e.currentTarget;

    toggleLoadingState($formCurrent, true);

    if (validate($formCurrent)) {
        await request($formCurrent);
    }

    toggleLoadingState($formCurrent, false);
};

const init = () => {
    if (!$form.length) {
        return;
    }

    $form.forEach(($formCurrent) => {
        $formCurrent.addEventListener('submit', submitHandler);
    });
};

export default {
    init,
};

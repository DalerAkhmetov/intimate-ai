import popup from '@components/popup';
import popupFormSuccess from '@components/popup/form-success';
import input from '@components/ui/input';

const $form = document.querySelectorAll('.form');

const errorMessages = {
    required: {
        default: 'This field is required',
    },
    email: 'Invalid email',
    formSend: 'Something went wrong',
};

const regExp = {
    email: /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i,
};

const getFields = ($formCurrent) => $formCurrent.querySelectorAll('input, textarea');

const toggleLoadingState = ($formCurrent, state) => {
    $formCurrent.classList.toggle('is-loading', state);
};

const toggleButtonDisabledState = ($formCurrent, state) => {
    $formCurrent.querySelector('button[type="submit"]').disabled = state;
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

const reset = ($formCurrent) => {
    const $errorCurrent = $formCurrent.querySelector('.form__error');

    getFields($formCurrent).forEach(($fieldCurrent) => {
        if ($fieldCurrent.type !== 'hidden') {
            $fieldCurrent.value = '';
        }

        toggleError($fieldCurrent, false);

        $fieldCurrent.dispatchEvent(new Event('change'));
    });

    if ($errorCurrent) {
        $errorCurrent.classList.remove('is-active');
        $errorCurrent.textContent = '';
    }

    toggleButtonDisabledState($formCurrent, false);
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

    toggleButtonDisabledState($formCurrent, !isValid);

    return isValid;
};

const result = ($formCurrent) => {
    popupFormSuccess.setMessage($formCurrent.dataset.successMessage);

    popup.closeActive();
    popup.open('form-success');

    reset($formCurrent);
};

const request = ($formCurrent) => {
    const fd = new FormData($formCurrent);

    return fetch($formCurrent.getAttribute('action'), {
        body: JSON.stringify(Object.fromEntries(fd.entries())),
        method: $formCurrent.getAttribute('method').toUpperCase(),
        headers: {
            Authorization: `Basic ${window.reqToken}`,
            'Content-Type': 'application/json;charset=utf-8',
        },
    })
        .then((response) => response.json())
        .then(() => {
            result($formCurrent);
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

const changeHandler = (e) => {
    const $formCurrent = e.currentTarget.closest('.form');

    let canSend = true;

    validateField(e.currentTarget);

    getFields($formCurrent).forEach(($fieldCurrent) => {
        if (input.hasError($fieldCurrent)) {
            canSend = false;
        }
    });

    toggleButtonDisabledState($formCurrent, !canSend);
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

        getFields($formCurrent).forEach(($fieldCurrent) => {
            $fieldCurrent.addEventListener('change', changeHandler);
        });
    });
};

export default {
    init,
};

const $popup = document.querySelector('.popup[data-id="form-success"]');

const setMessage = (message) => {
    if (!$popup) {
        return;
    }

    const $text = $popup.querySelector('.popup__text');

    if (!$text) {
        return;
    }

    if (typeof $text.defaultMessage === 'undefined') {
        $text.defaultMessage = $text.innerHTML;
    }

    $text.innerHTML = message || $text.defaultMessage;
};

export default {
    setMessage,
};

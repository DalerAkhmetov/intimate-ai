import { lockScroll } from '@scripts/helpers';

const $popup = document.querySelectorAll('.popup');
const $close = document.querySelectorAll('.popup__close');

const $jsPopupOpen = document.querySelectorAll('.js-popup-open');

const getById = (id) => $popup && [...$popup].find(($popupCurrent) => $popupCurrent.dataset.id === id);

const isActive = () => $popup && !![...$popup].filter(($popupCurrent) => $popupCurrent.classList.contains('is-active')).length;

const toggle = async (id, state) => {
    const $popupCurrent = getById(id);

    if (!$popupCurrent) {
        return;
    }

    $popupCurrent.classList.toggle('is-active', state);

    lockScroll(state, $popupCurrent, `popup-${id}`);
};

const open = (id) => toggle(id, true);

const close = (id) => toggle(id, false);

const closeActive = () => {
    if (isActive()) {
        $popup.forEach(($popupCurrent) => {
            if ($popupCurrent.classList.contains('is-active')) {
                close($popupCurrent.dataset.id);
            }
        });
    }
};

const openOnClickJsPopupOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();

    open(e.currentTarget.dataset.popupId);
};

const closeOnKeydown = (e) => {
    if (e.keyCode === 27) {
        closeActive();
    }
};

const closeOnClickOutOfContainer = (e) => {
    if (!e.target.classList.contains('popup__container') && !e.target.closest('.popup__container')) {
        close(e.currentTarget.dataset.id);
    }
};

const closeOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    close(e.currentTarget.closest('.popup').dataset.id);
};

const init = () => {
    if (!$popup.length) {
        return;
    }

    document.addEventListener('keydown', closeOnKeydown);

    $popup.forEach(($popupCurrent) => {
        $popupCurrent.addEventListener('click', closeOnClickOutOfContainer);
    });

    $close.forEach(($closeCurrent) => {
        $closeCurrent.addEventListener('click', closeOnClick);
    });

    $jsPopupOpen.forEach(($jsPopupOpenCurrent) => {
        $jsPopupOpenCurrent.addEventListener('click', openOnClickJsPopupOpen);
    });
};

export default {
    init,
    open,
    close,
    closeActive,
};

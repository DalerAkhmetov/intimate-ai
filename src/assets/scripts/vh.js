const isSupported = () => !(!!window.MSInputMethodContext && !!document.documentMode);

const setProp = () => {
    document.documentElement.style.setProperty('--vh', `${innerHeight / 100}px`);
};

const resize = setProp;

const init = () => {
    if (!isSupported()) {
        return;
    }

    setProp();

    setTimeout(setProp, 1000);

    window.addEventListener('load', setProp);
};

export default {
    init,
    resize,
};

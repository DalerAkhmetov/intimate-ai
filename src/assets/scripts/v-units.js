const isSupported = () => !(!!window.MSInputMethodContext && !!document.documentMode);

const setProps = () => {
    document.documentElement.style.setProperty('--vh', `${innerHeight / 100}px`);
    document.documentElement.style.setProperty('--vmax', `${(innerWidth > innerHeight ? innerWidth : innerHeight) / 100}px`);
};

const resize = setProps;

const init = () => {
    if (!isSupported()) {
        return;
    }

    setProps();

    setTimeout(setProps, 1000);

    window.addEventListener('load', setProps);
};

export default {
    init,
    resize,
};

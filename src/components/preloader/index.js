import { lockScroll } from '@scripts/helpers';

const debug = false;
const animationDelay = 0.75;
const timeoutDelay = 45;

let finished = false;

const getFilesToLoad = (element = document) => {
    return {
        images: [].slice.call(element === document ? element.images : element.querySelectorAll('img')),
        media: [].slice.call(element.querySelectorAll('video, audio')),
    };
};

const loadPage = () => {
    return new Promise((resolve) => {
        if (document.readyState === 'complete') {
            resolve();

            return;
        }

        window.addEventListener('load', resolve, { once: true });
    });
};

const loadImage = (image) => {
    return new Promise((resolve) => {
        if (image.complete || !image.src) {
            resolve();
        } else {
            image.onload = resolve;
            image.onerror = resolve;
        }
    });
};

const loadMedia = (media) => {
    return new Promise((resolve) => {
        const preloadAttr = media.getAttribute('preload');

        if (media.readyState === 4 || preloadAttr === 'none' || !media.currrentSrc) {
            resolve();
        } else {
            if (preloadAttr === 'metadata') {
                media.addEventListener('loadedmetadata', resolve, { once: true });
            } else {
                media.addEventListener('canplaythrough', resolve, { once: true });
            }

            media.addEventListener('error', resolve, { once: true });

            media.load();
        }
    });
};

const loadAll = (files) => {
    const array = [];

    array.push(loadPage(), ...files.images.map((image) => loadImage(image)), ...files.media.map((media) => loadMedia(media)));

    return Promise.all(array);
};

const finish = () => {
    return new Promise((resolve) => {
        if (finished) {
            resolve();

            return;
        }

        finished = true;

        lockScroll(false, window, 'preloader');

        resolve();
    });
};

const delay = () => {
    return new Promise((resolve) => {
        setTimeout(resolve, animationDelay * 1000);
    });
};

const timeout = () => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeoutDelay * 1000);
    });
};

const start = (loadScripts) => {
    return new Promise((resolve) => {
        lockScroll(true, window, 'preloader');

        timeout().then(finish).then(resolve);

        loadAll(getFilesToLoad()).then(loadScripts).then(delay).then(finish).then(resolve);
    });
};

const init = (loadScripts) => {
    return new Promise((resolve) => {
        if (debug) {
            if (loadScripts) {
                loadScripts().then(resolve);
            } else {
                resolve();
            }
        } else {
            start(loadScripts).then(resolve);
        }
    });
};

export default {
    init,
};

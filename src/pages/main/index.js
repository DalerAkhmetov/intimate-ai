import sectionIntro from '@pages/main/intro';

const $main = document.querySelector('.main');

const resize = () => {
    if (!$main) {
        return;
    }

    sectionIntro.resize();
};

const init = () => {
    if (!$main) {
        return;
    }

    sectionIntro.init();
};

export default {
    init,
    resize,
};

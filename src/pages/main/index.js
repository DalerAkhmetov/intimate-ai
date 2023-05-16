import sectionDream from '@pages/main/dream';
import sectionIntro from '@pages/main/intro';

const $main = document.querySelector('.main');

const animateAfterLoad = sectionIntro.animateAfterLoad;
const animateOnLoad = sectionIntro.animateOnLoad;

const resize = () => {
    if (!$main) {
        return;
    }

    sectionDream.resize();
    sectionIntro.resize();
};

const init = () => {
    if (!$main) {
        return;
    }

    sectionDream.init();
    sectionIntro.init();
};

export default {
    init,
    resize,
    animateOnLoad,
    animateAfterLoad,
};

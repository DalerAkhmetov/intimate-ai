import { gsap } from 'gsap';

import sectionApp from '@pages/main/app';
import sectionCards from '@pages/main/cards';
import sectionChat from '@pages/main/chat';
import sectionDream from '@pages/main/dream';
import sectionIntro from '@pages/main/intro';
import sectionSoon from '@pages/main/soon';
import sectionWait from '@pages/main/wait';

const $main = document.querySelector('.main');
const $light = document.querySelectorAll('.main__light');

let lightObserver = null;

const animateAfterLoad = sectionIntro.animateAfterLoad;
const animateOnLoad = sectionIntro.animateOnLoad;

const lightMove = () => {
    if (!$light.length) {
        return;
    }

    const randomSnapX = innerWidth / 10;
    const randomSnapY = innerHeight / 10;

    if (lightObserver) {
        lightObserver.disconnect();
    }

    lightObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.lightAnimation && entry.target.lightAnimation.play();
                } else {
                    entry.target.lightAnimation && entry.target.lightAnimation.pause();
                }
            });
        },
        { threshold: 0.025 }
    );

    $light.forEach(($lightCurrent) => {
        const $sectionCurrent = $lightCurrent.closest('.main__section');

        const lightHalfWidth = $lightCurrent.clientWidth / 2;
        const maxX = $sectionCurrent.clientWidth - lightHalfWidth;
        const maxY = $sectionCurrent.clientHeight - lightHalfWidth;

        if ($sectionCurrent.lightAnimation) {
            $sectionCurrent.lightAnimation.kill();
        }

        gsap.set($lightCurrent, {
            x: maxX / 2,
            y: maxY / 2,
        });

        $sectionCurrent.lightAnimation = gsap.to($lightCurrent, {
            duration: 5,
            ease: 'none',
            paused: true,
            repeat: -1,
            repeatRefresh: true,
            x: `random(${-lightHalfWidth}, ${maxX}, ${randomSnapX})`,
            y: `random(${-lightHalfWidth}, ${maxY}, ${randomSnapY})`,
        });

        lightObserver.observe($sectionCurrent);
    });
};

const resize = () => {
    if (!$main) {
        return;
    }

    lightMove();

    sectionIntro.resize();
    sectionDream.resize();
    sectionChat.resize();
    sectionCards.resize();
    sectionSoon.resize();
    sectionApp.resize();
    sectionWait.resize();
};

const init = () => {
    if (!$main) {
        return;
    }

    lightMove();

    sectionIntro.init();
    sectionDream.init();
    sectionChat.init();
    sectionCards.init();
    sectionSoon.init();
    sectionApp.init();
    sectionWait.init();
};

export default {
    init,
    resize,
    animateOnLoad,
    animateAfterLoad,
};

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { isDesktop } from '@scripts/helpers';
import animationTextScramble from '@components/animation/text-scramble';

const $section = document.querySelector('.main__section--cards');

const gsapCtx = gsap.context(() => {});

const animateOnScroll = () => {
    if (gsapCtx.data.length) {
        gsapCtx.revert();
    }

    gsapCtx.add(() => {
        gsap.set($section, {
            marginTop: -innerHeight,
            autoAlpha: 0,
        });

        gsap.to($section, {
            scrollTrigger: {
                trigger: $section,
                start: 'top top',
                end: `+=${innerHeight / 3}`,
                scrub: true,
                pin: true,
            },
            ease: 'none',
            autoAlpha: 1,
        });
    });
};

const resize = () => {
    if (!$section) {
        return;
    }

    animateOnScroll();
};

const init = () => {
    if (!$section) {
        return;
    }

    animateOnScroll();
};

export default {
    init,
    resize,
};

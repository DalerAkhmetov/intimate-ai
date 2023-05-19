import { gsap } from 'gsap';

const $section = document.querySelector('.main__section--wait');
const $button = $section.querySelector('.main__button');

const gsapCtx = gsap.context(() => {});

const animateOnScroll = () => {
    if (gsapCtx.data.length) {
        gsapCtx.revert();
    }

    gsapCtx.add(() => {
        gsap.from($button, {
            scrollTrigger: {
                trigger: $section,
                start: 'center bottom',
                end: `bottom+=${$button.clientHeight / 2} bottom`,
                scrub: true,
            },
            ease: 'none',
            yPercent: 100,
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

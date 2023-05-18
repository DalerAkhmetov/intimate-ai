import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { isDesktop } from '@scripts/helpers';

const $section = document.querySelector('.main__section--app');
const $images = $section.querySelector('.main__images');
const $image = $images.querySelectorAll('.main__image');

const gsapCtx = gsap.context(() => {});

const animateOnScroll = () => {
    // TODO: fix resize

    gsapCtx.revert();

    gsapCtx.add(() => {
        if (isDesktop()) {
            const pinDuration = $section.clientHeight;

            ScrollTrigger.create({
                trigger: $section,
                start: 'top top',
                end: `+=${pinDuration}`,
                pin: true,
            });

            gsap.from($image, {
                scrollTrigger: {
                    trigger: $section,
                    start: 'top bottom',
                    end: `bottom+=${pinDuration} bottom`,
                    scrub: true,
                },
                ease: 'none',
                stagger: 0.25,
                opacity: 0,
                yPercent: 100,
            });
        } else {
            const pinDuration = $images.scrollWidth - $images.clientWidth;

            gsap.to($images, {
                scrollTrigger: {
                    trigger: $section,
                    start: 'top top',
                    end: `+=${pinDuration}`,
                    scrub: true,
                    pin: true,
                },
                ease: 'none',
                x: -pinDuration,
            });
        }
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

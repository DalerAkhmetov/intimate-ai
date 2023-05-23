import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { isDesktop } from '@scripts/helpers';
import animationTextScramble from '@components/animation/text-scramble';

const $section = document.querySelector('.main__section--app');
const $container = $section.querySelector('.main__container');
const $title = $section.querySelector('.main__title');
const $images = $section.querySelector('.main__images');
const $image = $images.querySelectorAll('.main__image');

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

        const pinDuration = isDesktop() ? $section.clientHeight : $images.scrollWidth - $images.clientWidth;
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: $section,
                start: 'top top',
                end: `+=${pinDuration}`,
                scrub: true,
                pin: true,
                onEnter() {
                    gsap.set($section, { autoAlpha: 1 });

                    animationTextScramble.animate($title);
                },
                onLeaveBack() {
                    gsap.set($section, { autoAlpha: 0 });

                    animationTextScramble.animate($title, true);
                },
            },
        });
        // .from($container, {
        //     ease: 'none',
        //     opacity: 0,
        // });

        if (isDesktop()) {
            timeline.from($image, {
                ease: 'none',
                stagger: 0.25,
                opacity: 0,
                yPercent: 100,
            });
        } else {
            timeline.to($images, {
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

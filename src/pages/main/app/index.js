import { gsap } from 'gsap';

import { isDesktop } from '@scripts/helpers';
import animationTextScramble from '@components/animation/text-scramble';

const $section = document.querySelector('.main__section--app');
const $title = $section.querySelector('.main__title');
const $images = $section.querySelector('.main__images');
const $image = $images.querySelectorAll('.main__image');

const gsapCtx = gsap.context(() => {});

const getClipPathCircle = (size) => {
    if (typeof size === 'undefined') {
        size = (innerWidth > innerHeight ? innerWidth : innerHeight) * 1.25;
    }

    return `circle(${size}px at ${innerWidth}px ${innerHeight / 2}px)`;
};

const animateOnScroll = () => {
    // TODO: fix timing (duration and scroll distance)
    if (gsapCtx.data.length) {
        gsapCtx.revert();
    }

    const isDesktopNow = isDesktop();
    const neededProgressValue = isDesktopNow ? 0.85 : 0.55;

    let clipPathCompleted = false;

    gsapCtx.add(() => {
        gsap.set($section, {
            marginTop: -innerHeight * 1.5,
            clipPath: getClipPathCircle(0),
            pointerEvents: 'auto',
        });

        const pinDuration = isDesktopNow ? $section.clientHeight * 2 : innerHeight + $images.scrollWidth - $images.clientWidth;
        const timeline = gsap
            .timeline({
                scrollTrigger: {
                    trigger: $section,
                    start: 'top top',
                    end: `+=${pinDuration}`,
                    scrub: true,
                    pin: true,
                },
            })
            .to($section, {
                ease: 'none',
                clipPath: getClipPathCircle(),
                onComplete() {
                    gsap.set($section, { clearProps: 'clipPath' });
                },
                onUpdate() {
                    const isNeededProgress = this.progress() >= neededProgressValue;

                    if (isNeededProgress && !clipPathCompleted) {
                        clipPathCompleted = true;

                        animationTextScramble.animate($title);
                    } else if (!isNeededProgress && clipPathCompleted) {
                        clipPathCompleted = false;

                        animationTextScramble.animate($title, true);
                    }
                },
            });

        gsap.set(timeline.scrollTrigger.spacer, { pointerEvents: 'none' });

        if (isDesktopNow) {
            timeline.from($image, {
                ease: 'none',
                stagger: 0.25,
                opacity: 0,
                yPercent: 100,
            });
        } else {
            timeline
                .from($images, {
                    ease: 'none',
                    opacity: 0,
                })
                .to($images, {
                    ease: 'none',
                    x: -$images.scrollWidth + $images.clientWidth,
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

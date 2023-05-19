import { gsap } from 'gsap';

import { isDesktop } from '@scripts/helpers';

// TODO: scroll animation for transition with circle on devices

const $section = document.querySelector('.main__section--soon');
const $content = $section.querySelector('.main__content');
const $soon = $section.querySelector('.main__soon');
const $soonBg = $soon.querySelector('.main__soon-bg');
const $line = $section.querySelectorAll('.main__line');
const $lineLight = $section.querySelectorAll('.main__line-light');
const $fillCircle = $section.querySelector('.main__fill-circle');

const gsapCtx = gsap.context(() => {});

let lineLightsAnimation = null;
let lineLightsObserver = null;

const animateLineLights = () => {
    if (!$line.length) {
        return;
    }

    if (lineLightsAnimation) {
        lineLightsAnimation.revert();
    }

    if (lineLightsObserver) {
        lineLightsObserver.disconnect();
    }

    const lineHeight = $line[0].clientHeight;
    const lineLightHeight = $lineLight[0].clientHeight;

    lineLightsAnimation = gsap.timeline({ paused: true });

    $line.forEach(($lineCurrent) => {
        if ($lineCurrent.offsetParent === null) {
            return;
        }

        const duration = gsap.utils.random(5, 8);

        $lineCurrent.querySelectorAll('.main__line-light').forEach(($lineLightCurrent, lineLightIndex) => {
            lineLightsAnimation.fromTo(
                $lineLightCurrent,
                {
                    y: -lineLightHeight,
                },
                {
                    delay: lineLightIndex * (duration / 2),
                    duration,
                    ease: 'linear',
                    repeat: -1,
                    y: lineHeight,
                },
                0
            );
        });
    });

    lineLightsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                lineLightsAnimation.play();
            } else {
                lineLightsAnimation.pause();
            }
        });
    });

    lineLightsObserver.observe($section);
};

const animateOnScroll = () => {
    if (gsapCtx.data.length) {
        gsapCtx.revert();
    }

    const isDesktopNow = isDesktop();

    gsapCtx.add(() => {
        gsap.from($soonBg, {
            scrollTrigger: {
                trigger: $soon,
                endTrigger: isDesktopNow ? $content : $section,
                start: 'top bottom',
                end: 'bottom bottom',
                scrub: true,
            },
            ease: 'none',
            yPercent: -35,
        });

        gsap.from($content, {
            scrollTrigger: {
                trigger: $content,
                endTrigger: $section,
                start: `${isDesktopNow ? 'top' : 'center'} bottom`,
                end: 'bottom bottom',
                scrub: true,
            },
            ease: 'none',
            opacity: 0,
        });

        if (isDesktopNow) {
            return;
        }

        gsap.to($fillCircle, {
            scrollTrigger: {
                trigger: $section,
                start: 'bottom bottom',
                end: `+=${innerHeight / 2}`,
                scrub: true,
                pin: true,
            },
            ease: 'none',
            scale: 1,
        });
    });
};

const resize = () => {
    if (!$section) {
        return;
    }

    animateOnScroll();
    animateLineLights();
};

const init = () => {
    if (!$section) {
        return;
    }

    animateOnScroll();
    animateLineLights();
};

export default {
    init,
    resize,
};

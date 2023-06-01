import { gsap } from 'gsap';

import { isMobile } from '@scripts/helpers';

const $section = document.querySelector('.main__section--wait');
const $content = $section.querySelector('.main__content');
const $button = $section.querySelector('.main__button');
const $sliderLight = $section.querySelector('.main__slider-light');

const gsapCtx = gsap.context(() => {});

let sliderLightAnimation = null;
let sliderLightObserver = null;

const sliderLightMoveObserver = () => {
    if (sliderLightObserver) {
        sliderLightObserver.disconnect();
    }

    sliderLightObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                sliderLightAnimation.play();
            } else {
                sliderLightAnimation.pause();
            }
        });
    });

    sliderLightObserver.observe($section);
};

const sliderLightMoveCreate = () => {
    if (sliderLightAnimation) {
        sliderLightAnimation.revert();
    }

    const sectionBCR = $section.getBoundingClientRect();
    const contentBCR = JSON.parse(JSON.stringify($content.getBoundingClientRect()));
    const contentBorderSize = gsap.getProperty($content, 'border-width');
    const contentBorderRadius = gsap.getProperty($content, 'border-radius') - contentBorderSize / 2;

    contentBCR.top = contentBCR.top - sectionBCR.top;
    contentBCR.bottom = sectionBCR.bottom - contentBCR.bottom;
    contentBCR.left = contentBCR.left - sectionBCR.left;
    contentBCR.right = sectionBCR.right - contentBCR.right;

    const durationX = isMobile() ? 2 : 6;
    const durationY = (contentBCR.height / contentBCR.width) * durationX;
    const durationAngle = ((contentBorderRadius * 2) / contentBCR.width) * durationX;

    const moveX = contentBCR.width - contentBorderSize - contentBorderRadius * 2;
    const moveY = contentBCR.height - contentBorderSize - contentBorderRadius * 2;

    const cubicBezier = (t, p0, p1, p2, p3) => {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;
        let p = uuu * p0;

        p += 3 * uu * t * p1;
        p += 3 * u * tt * p2;
        p += ttt * p3;

        return p;
    };

    const getPointOnCurve = (start, end, angle = Math.PI * 2, progress) => {
        const radius = contentBorderRadius / 2;
        const midX = start.x - radius * Math.cos(angle);
        const midY = start.y - radius * Math.sin(angle);
        const t = gsap.utils.clamp(0, 1, progress);
        const x = cubicBezier(t, start.x, midX, midX, end.x);
        const y = cubicBezier(t, start.y, midY, midY, end.y);

        return { x, y };
    };

    const moveOnRadius = (corner) => {
        let startPoint = { x: contentBCR.left + contentBorderSize / 2 + contentBorderRadius, y: contentBCR.top + contentBorderSize / 2 };
        let endPoint = { x: contentBCR.left + contentBorderSize / 2, y: contentBCR.top + contentBorderSize / 2 + contentBorderRadius };
        let angle;

        if (corner === 'tr') {
            startPoint = { x: contentBCR.left + contentBorderSize / 2 + moveX + contentBorderRadius * 2, y: contentBCR.top + contentBorderSize / 2 + contentBorderRadius };
            endPoint = { x: contentBCR.left + contentBorderSize / 2 + moveX + contentBorderRadius, y: contentBCR.top + contentBorderSize / 2 };
            angle = Math.PI / 2;
        } else if (corner === 'br') {
            startPoint = { x: contentBCR.left + contentBorderSize / 2 + moveX + contentBorderRadius, y: contentBCR.top + contentBorderSize / 2 + moveY + contentBorderRadius * 2 };
            endPoint = { x: contentBCR.left + contentBorderSize / 2 + moveX + contentBorderRadius * 2, y: contentBCR.top + contentBorderSize / 2 + moveY + contentBorderRadius };
            angle = Math.PI;
        } else if (corner === 'bl') {
            startPoint = { x: contentBCR.left + contentBorderSize / 2, y: contentBCR.top + contentBorderSize / 2 + moveY + contentBorderRadius };
            endPoint = { x: contentBCR.left + contentBorderSize / 2 + contentBorderRadius, y: contentBCR.top + contentBorderSize / 2 + moveY + contentBorderRadius * 2 };
            angle = (Math.PI * 3) / 2;
        }

        return gsap.to($sliderLight, {
            duration: durationAngle,
            ease: 'none',
            onUpdate() {
                const progress = this.progress();
                const point = getPointOnCurve(startPoint, endPoint, angle, progress);

                gsap.set($sliderLight, { x: point.x, y: point.y });
            },
        });
    };

    sliderLightAnimation = gsap
        .timeline({
            paused: true,
            repeat: -1,
        })
        .fromTo(
            $sliderLight,
            {
                x: contentBCR.left + contentBorderSize / 2,
                y: contentBCR.top + contentBorderSize / 2 + contentBorderRadius,
            },
            {
                duration: durationY,
                ease: 'none',
                x: contentBCR.left + contentBorderSize / 2,
                y: `+=${moveY}`,
            }
        )
        .add(moveOnRadius('bl'))
        .to($sliderLight, {
            duration: durationX,
            ease: 'none',
            x: `+=${moveX}`,
        })
        .add(moveOnRadius('br'))
        .to($sliderLight, {
            duration: durationY,
            ease: 'none',
            y: `-=${moveY}`,
        })
        .add(moveOnRadius('tr'))
        .to($sliderLight, {
            duration: durationX,
            ease: 'none',
            x: `-=${moveX}`,
        })
        .add(moveOnRadius('tl'));

    sliderLightMoveObserver();
};

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
                scrub: 0.5,
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
    sliderLightMoveCreate();
};

const init = () => {
    if (!$section) {
        return;
    }

    animateOnScroll();
    sliderLightMoveCreate();
};

export default {
    init,
    resize,
};

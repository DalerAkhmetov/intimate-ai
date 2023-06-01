import { gsap } from 'gsap';

import { isMobile } from '@scripts/helpers';

const $section = document.querySelector('.main__section--intro');
const $title = $section.querySelector('.main__title');
const $button = $section.querySelector('.main__button');
const $frame = $section.querySelectorAll('.main__frame');
const $name = $section.querySelector('.main__name');
const $sliderLight = $section.querySelector('.main__slider-light');

let frameBorderSize = 0;
let sliderLightAnimation = null;
let sliderLightObserver = null;

const animateAfterLoad = () => {
    return new Promise((resolve) => {
        gsap.timeline({
            onStart() {
                $section.classList.remove('is-loading');

                sliderLightMoveObserver();
            },
            onComplete() {
                gsap.set([$title, $title.querySelectorAll('.main__title-char'), $button], { clearProps: 'all' });

                resolve();
            },
        })
            .fromTo(
                $title,
                {
                    y: gsap.getProperty($title, 'y'),
                },
                {
                    delay: 0.5,
                    y: 0,
                }
            )
            .fromTo(
                $button,
                {
                    opacity: gsap.getProperty($button, 'opacity'),
                },
                {
                    opacity: 1,
                },
                '<'
            );
    });
};

const animateOnLoad = () => {
    return new Promise((resolve) => {
        gsap.to($title.querySelectorAll('.main__title-char'), {
            duration: 2,
            x: 0,
            y: 0,
            onComplete: resolve,
        });
    });
};

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
    const frameBCR = JSON.parse(JSON.stringify($frame[0].getBoundingClientRect()));
    const frameBorderRadius = gsap.getProperty($frame[0], 'border-radius') - frameBorderSize / 2;

    frameBCR.top = frameBCR.top - sectionBCR.top;
    frameBCR.bottom = sectionBCR.bottom - frameBCR.bottom;
    frameBCR.left = frameBCR.left - sectionBCR.left;
    frameBCR.right = sectionBCR.right - frameBCR.right;

    const durationX = isMobile() ? 2 : 6;
    const durationY = (frameBCR.height / frameBCR.width) * durationX;
    const durationAngle = ((frameBorderRadius * 2) / frameBCR.width) * durationX;

    const moveX = frameBCR.width - frameBorderSize - frameBorderRadius * 2;
    const moveY = frameBCR.height - frameBorderSize - frameBorderRadius * 2;

    const positionOpacityTo = ((moveX / 2 - $name.offsetWidth) / frameBCR.width) * durationX;
    const positionOpacityFrom = ((moveX / 2 + $name.offsetWidth) / frameBCR.width) * durationX;
    const durationOpacity = ($name.offsetWidth / 2 / frameBCR.width) * durationX;

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
        const radius = frameBorderRadius / 2;
        const midX = start.x - radius * Math.cos(angle);
        const midY = start.y - radius * Math.sin(angle);
        const t = gsap.utils.clamp(0, 1, progress);
        const x = cubicBezier(t, start.x, midX, midX, end.x);
        const y = cubicBezier(t, start.y, midY, midY, end.y);

        return { x, y };
    };

    const moveOnRadius = (corner) => {
        let startPoint = { x: frameBCR.left + frameBorderSize / 2 + frameBorderRadius, y: frameBCR.top + frameBorderSize / 2 };
        let endPoint = { x: frameBCR.left + frameBorderSize / 2, y: frameBCR.top + frameBorderSize / 2 + frameBorderRadius };
        let angle;

        if (corner === 'tr') {
            startPoint = { x: frameBCR.left + frameBorderSize / 2 + moveX + frameBorderRadius * 2, y: frameBCR.top + frameBorderSize / 2 + frameBorderRadius };
            endPoint = { x: frameBCR.left + frameBorderSize / 2 + moveX + frameBorderRadius, y: frameBCR.top + frameBorderSize / 2 };
            angle = Math.PI / 2;
        } else if (corner === 'br') {
            startPoint = { x: frameBCR.left + frameBorderSize / 2 + moveX + frameBorderRadius, y: frameBCR.top + frameBorderSize / 2 + moveY + frameBorderRadius * 2 };
            endPoint = { x: frameBCR.left + frameBorderSize / 2 + moveX + frameBorderRadius * 2, y: frameBCR.top + frameBorderSize / 2 + moveY + frameBorderRadius };
            angle = Math.PI;
        } else if (corner === 'bl') {
            startPoint = { x: frameBCR.left + frameBorderSize / 2, y: frameBCR.top + frameBorderSize / 2 + moveY + frameBorderRadius };
            endPoint = { x: frameBCR.left + frameBorderSize / 2 + frameBorderRadius, y: frameBCR.top + frameBorderSize / 2 + moveY + frameBorderRadius * 2 };
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
                x: frameBCR.left + frameBorderSize / 2,
                y: frameBCR.top + frameBorderSize / 2 + frameBorderRadius,
            },
            {
                duration: durationY,
                ease: 'none',
                x: frameBCR.left + frameBorderSize / 2,
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
        .addLabel('opacityChange')
        .to($sliderLight, {
            duration: durationX,
            ease: 'none',
            x: `-=${moveX}`,
        })
        .to(
            $sliderLight,
            {
                duration: durationOpacity,
                ease: 'none',
                opacity: 0,
            },
            `opacityChange+=${positionOpacityTo}`
        )
        .to(
            $sliderLight,
            {
                duration: durationOpacity,
                ease: 'none',
                opacity: 1,
            },
            `opacityChange+=${positionOpacityFrom}`
        )
        .add(moveOnRadius('tl'));
};

const frameDraw = () => {
    if (!$frame.length) {
        return;
    }

    $frame.forEach(($frameCurrent) => {
        const $canvasCurrent = $frameCurrent.querySelector('canvas');

        $frameCurrent.removeAttribute('style');

        const frameStyles = getComputedStyle($frameCurrent);
        const canvasWidth = $frameCurrent.offsetWidth;
        const canvasHeight = $frameCurrent.offsetHeight;
        const ctx = $canvasCurrent.getContext('2d');
        const lineWidth = parseInt(frameStyles.borderWidth, 10) || 1;
        const halfLineWidth = lineWidth / 2;
        const lineColor = frameStyles.borderColor;
        const radius = parseInt(frameStyles.borderRadius, 10) || 0;
        const gapSize = $name.clientWidth;

        frameBorderSize = lineWidth;

        $frameCurrent.style.border = 0;
        $canvasCurrent.width = canvasWidth * window.devicePixelRatio;
        $canvasCurrent.height = canvasHeight * window.devicePixelRatio;

        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = lineColor;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        ctx.beginPath();
        ctx.arc(halfLineWidth + radius, halfLineWidth + radius, radius, Math.PI, (Math.PI * 3) / 2, false);
        ctx.lineTo(canvasWidth / 2 - gapSize / 2, halfLineWidth);
        ctx.moveTo(canvasWidth / 2 + gapSize / 2, halfLineWidth);
        ctx.lineTo(canvasWidth - halfLineWidth - radius, halfLineWidth);
        ctx.arc(canvasWidth - halfLineWidth - radius, halfLineWidth + radius, radius, (Math.PI * 3) / 2, Math.PI * 2, false);
        ctx.lineTo(canvasWidth - halfLineWidth, canvasHeight - halfLineWidth - radius);
        ctx.arc(canvasWidth - halfLineWidth - radius, canvasHeight - halfLineWidth - radius, radius, 0, Math.PI / 2, false);
        ctx.lineTo(halfLineWidth + radius, canvasHeight - halfLineWidth);
        ctx.arc(halfLineWidth + radius, canvasHeight - halfLineWidth - radius, radius, Math.PI / 2, Math.PI, false);
        ctx.lineTo(halfLineWidth, halfLineWidth + radius);
        ctx.stroke();
    });
};

const splitTitle = () => {
    $title.innerHTML = $title.textContent
        .split(' ')
        .map((word) => {
            return `
                <span class="main__title-word">
                    ${word
                        .split('')
                        .map((char) => `<span class="main__title-char">${char}</span>`)
                        .join('')}
                </span>
            `;
        })
        .join(' ');
};

const resize = () => {
    if (!$section) {
        return;
    }

    frameDraw();
    sliderLightMoveCreate();
};

const init = () => {
    if (!$section) {
        return;
    }

    splitTitle();
    frameDraw();
    sliderLightMoveCreate();
};

export default {
    init,
    resize,
    animateOnLoad,
    animateAfterLoad,
};

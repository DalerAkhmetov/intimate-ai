import { gsap } from 'gsap';

import { isMobile } from '@scripts/helpers';

const $sectionIntro = document.querySelector('.main__section--intro');
const $title = $sectionIntro.querySelector('.main__title');
const $button = $sectionIntro.querySelector('.main__button');
const $frame = $sectionIntro.querySelectorAll('.main__frame');
const $name = $sectionIntro.querySelector('.main__name');
const $slider = $sectionIntro.querySelector('.main__slider');

let frameBorderSize = 0;
let sliderAnimation = null;
let sliderObserver = null;

const animateAfterLoad = () => {
    return new Promise((resolve) => {
        gsap.timeline({
            onStart() {
                $sectionIntro.classList.remove('is-loading');

                sliderMoveObserver();
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

const sliderMoveObserver = () => {
    if (sliderObserver) {
        sliderObserver.disconnect();
    }

    sliderObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                sliderAnimation.play();
                console.log('play');
            } else {
                sliderAnimation.pause();
                console.log('pause');
            }
        });
    });

    sliderObserver.observe($sectionIntro);
};

const sliderMoveCreate = () => {
    if (sliderAnimation) {
        sliderAnimation.revert();
    }

    const frameBCR = $frame[0].getBoundingClientRect();
    const frameBorderRadius = gsap.getProperty($frame[0], 'border-radius') - frameBorderSize / 2;

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

        return gsap.to($slider, {
            duration: durationAngle,
            ease: 'none',
            onUpdate() {
                const progress = this.progress();
                const point = getPointOnCurve(startPoint, endPoint, angle, progress);

                gsap.set($slider, { x: point.x, y: point.y });
            },
        });
    };

    sliderAnimation = gsap
        .timeline({
            paused: true,
            repeat: -1,
        })
        .fromTo(
            $slider,
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
        .to($slider, {
            duration: durationX,
            ease: 'none',
            x: `+=${moveX}`,
        })
        .add(moveOnRadius('br'))
        .to($slider, {
            duration: durationY,
            ease: 'none',
            y: `-=${moveY}`,
        })
        .add(moveOnRadius('tr'))
        .addLabel('testLabel')
        .to($slider, {
            duration: durationX,
            ease: 'none',
            x: `-=${moveX}`,
        })
        .to(
            $slider,
            {
                duration: durationOpacity,
                ease: 'none',
                opacity: 0,
            },
            `testLabel+=${positionOpacityTo}`
        )
        .to(
            $slider,
            {
                duration: durationOpacity,
                ease: 'none',
                opacity: 1,
            },
            `testLabel+=${positionOpacityFrom}`
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
    if (!$sectionIntro) {
        return;
    }

    frameDraw();
    sliderMoveCreate();
};

const init = () => {
    if (!$sectionIntro) {
        return;
    }

    splitTitle();
    frameDraw();
    sliderMoveCreate();
};

export default {
    init,
    resize,
    animateOnLoad,
    animateAfterLoad,
};

import { gsap } from 'gsap';

const $sectionIntro = document.querySelector('.main__section--intro');
const $title = $sectionIntro.querySelector('.main__title');
const $button = $sectionIntro.querySelector('.main__button');
const $frame = $sectionIntro.querySelectorAll('.main__frame');
const $name = $sectionIntro.querySelector('.main__name');

const animateAfterLoad = () => {
    return new Promise((resolve) => {
        gsap.timeline({
            onStart() {
                $sectionIntro.classList.remove('is-loading');
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
};

const init = () => {
    if (!$sectionIntro) {
        return;
    }

    splitTitle();
    frameDraw();
};

export default {
    init,
    resize,
    animateOnLoad,
    animateAfterLoad,
};

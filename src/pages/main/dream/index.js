import { gsap } from 'gsap';

const $section = document.querySelector('.main__section--dream');
const $ticker = $section.querySelectorAll('.main__ticker');
const $light = $section.querySelector('.main__light');

let tickerAnimation = null;
let lightObserver = null;

const lightMove = () => {
    if (!$light) {
        return;
    }

    const lightHalfWidth = $light.clientWidth / 2;
    const maxX = $section.clientWidth - lightHalfWidth;
    const maxY = $section.clientHeight - lightHalfWidth;

    gsap.killTweensOf($light);

    gsap.set($light, {
        x: maxX / 2,
        y: maxY / 2,
    });

    const animation = gsap.to($light, {
        duration: 5,
        ease: 'none',
        paused: true,
        repeat: -1,
        repeatRefresh: true,
        x: `random(${-lightHalfWidth}, ${maxX})`,
        y: `random(${-lightHalfWidth}, ${maxY})`,
    });

    if (lightObserver) {
        lightObserver.disconnect();
    }

    lightObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animation.play();
                } else {
                    animation.pause();
                }
            });
        },
        { threshold: 0.025 }
    );

    lightObserver.observe($section);
};

const tickerMove = () => {
    if (!$ticker.length) {
        return;
    }

    if (tickerAnimation) {
        tickerAnimation.revert();

        $section.querySelectorAll('.main__ticker-part.is-clone').forEach(($tickerPartCurrentClone) => {
            $tickerPartCurrentClone.parentNode.removeChild($tickerPartCurrentClone);
        });
    }

    tickerAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: $section,
            start: `top+=${gsap.getProperty($section, 'paddingTop')} bottom`,
            end: `bottom-=${gsap.getProperty($section, 'paddingBottom')} top`,
            scrub: true,
        },
    });

    $ticker.forEach(($tickerCurrent) => {
        const $tickerWrapperCurrent = $tickerCurrent.querySelector('.main__ticker-wrapper');
        const $tickerPartCurrent = $tickerCurrent.querySelector('.main__ticker-part');

        const isLtr = $tickerCurrent.classList.contains('main__ticker--ltr');
        const tickerWidth = $tickerCurrent.clientWidth;
        const tickerPartBCR = $tickerPartCurrent.getBoundingClientRect();
        const additionalWidth = tickerPartBCR.left >= 0 ? 0 : Math.abs(tickerPartBCR.left);
        const clonesCount = tickerPartBCR.width - additionalWidth >= tickerWidth ? 1 : Math.ceil(tickerWidth / tickerPartBCR.width);

        for (let i = clonesCount; i > 0; i--) {
            const $tickerPartCurrentClone = $tickerPartCurrent.cloneNode(true);

            $tickerWrapperCurrent.appendChild($tickerPartCurrentClone);
            $tickerPartCurrentClone.classList.add('is-clone');
        }

        tickerAnimation.to(
            $tickerWrapperCurrent,
            {
                ease: 'none',
                x: tickerPartBCR.width * (isLtr ? 1 : -1),
            },
            0
        );
    });
};

const resize = () => {
    if (!$section) {
        return;
    }

    tickerMove();
    lightMove();
};

const init = () => {
    if (!$section) {
        return;
    }

    tickerMove();
    lightMove();
};

export default {
    init,
    resize,
};

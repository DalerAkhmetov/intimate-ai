import { gsap } from 'gsap';

const $section = document.querySelector('.main__section--dream');
const $ticker = $section.querySelectorAll('.main__ticker');

let tickerAnimation = null;

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
        const clonesCount = (tickerPartBCR.width - additionalWidth >= tickerWidth ? 1 : Math.ceil(tickerWidth / tickerPartBCR.width)) + 1;

        for (let i = clonesCount; i > 0; i--) {
            const $tickerPartCurrentClone = $tickerPartCurrent.cloneNode(true);

            $tickerWrapperCurrent.appendChild($tickerPartCurrentClone);
            $tickerPartCurrentClone.classList.add('is-clone');
        }

        const distance = tickerPartBCR.width * (isLtr ? 1 : -1);
        const startOffset = distance / 2 - tickerPartBCR.left;

        tickerAnimation.fromTo(
            $tickerWrapperCurrent,
            {
                x: startOffset,
            },
            {
                ease: 'none',
                x: startOffset + distance,
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
};

const init = () => {
    if (!$section) {
        return;
    }

    tickerMove();
};

export default {
    init,
    resize,
};

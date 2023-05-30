import ASScroll from '@ashthornton/asscroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { isScrollLocked } from '@scripts/helpers';

const $scroller = document.querySelector('[asscroll-container]');

let isTouch = null;
let scroller = null;

const getElement = () => $scroller;

const getInstance = () => scroller;

const getPosition = () => (isTouch ? $scroller.scrollTop : scroller.currentPos);

const setPosition = (position, smooth = false) => {
    if (position < 0) {
        position = 0;
    } else if (position > scroller.maxScroll) {
        position = scroller.maxScroll;
    }

    if (smooth) {
        if (isTouch) {
            $scroller.scrollTo({
                top: position,
                behavior: 'smooth',
            });
        } else {
            scroller.scrollTo(position);
        }
    } else {
        if (isTouch) {
            $scroller.scrollTo(0, position);
        } else {
            scroller.currentPos = position;
        }
    }
};

const offScroll = (callback) => {
    if (isTouch) {
        $scroller.removeEventListener('scroll', callback);
    } else {
        scroller.off('scroll', callback);
    }
};

const onScroll = (callback, options = {}) => {
    if (options.once) {
        const func = () => {
            callback();

            offScroll(func);
        };

        if (isTouch) {
            $scroller.addEventListener('scroll', func);
        } else {
            scroller.on('scroll', func);
        }
    } else {
        if (isTouch) {
            $scroller.addEventListener('scroll', callback);
        } else {
            scroller.on('scroll', callback);
        }
    }
};

const makeFriendsWithScrollTrigger = () => {
    if (!isTouch) {
        gsap.ticker.add(scroller.update);
    }

    ScrollTrigger.defaults({
        scroller: $scroller,
    });

    ScrollTrigger.scrollerProxy($scroller, {
        scrollTop(value) {
            if (arguments.length) {
                setPosition(value);
            }

            return getPosition();
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: innerWidth,
                height: innerHeight,
            };
        },
        pinType: isTouch ? 'fixed' : 'transform',
    });

    if (!isTouch) {
        ScrollTrigger.addEventListener('refresh', scroller.resize);

        scroller.on('update', ScrollTrigger.update);
    }
};

const disable = () => {
    if (!scroller) {
        return;
    }

    scroller.disable(isTouch ? undefined : { inputOnly: true });
};

const enable = () => {
    if (!scroller) {
        return;
    }

    scroller.enable();
};

const init = () => {
    if (!$scroller) {
        return;
    }

    isTouch = 'ontouchstart' in document.documentElement;

    if (isTouch) {
        document.documentElement.classList.add('is-scroller-normalizer');

        scroller = ScrollTrigger.normalizeScroll({
            debounce: false,
            lockAxis: false,
            target: $scroller,
        });
    } else {
        document.documentElement.classList.add('is-scroller-asscroll');

        scroller = new ASScroll({
            customScrollbar: false,
            scrollbarStyles: false,
            disableRaf: true,
            touchScrollType: isTouch ? 'scrollTop' : undefined,
        });
    }

    makeFriendsWithScrollTrigger();

    if (!isScrollLocked()) {
        enable();
    }
};

export default {
    init,
    enable,
    disable,
    onScroll,
    offScroll,
    setPosition,
    getPosition,
    getInstance,
    getElement,
};

import ASScroll from '@ashthornton/asscroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

import { isScrollLocked } from '@scripts/helpers';

const $scroller = document.querySelector('[asscroll-container]');

const isTouch = 'ontouchstart' in document.documentElement;

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
            $scroller.scrollTop = position;
        } else {
            scroller.currentPos = position;
        }
    }
};

const offScroll = (callback) => {
    scroller.off('scroll', callback);
};

const onScroll = (callback, options = {}) => {
    if (options.once) {
        const func = () => {
            callback();

            offScroll(func);
        };

        scroller.on('scroll', func);
    } else {
        scroller.on('scroll', callback);
    }
};

const makeFriendsWithScrollTrigger = () => {
    if (isTouch) {
        gsap.ticker.add((time) => {
            scroller.raf(time * 1000);
        });
    } else {
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

    if (isTouch) {
        onScroll(ScrollTrigger.update);
    } else {
        ScrollTrigger.addEventListener('refresh', scroller.resize);

        scroller.on('update', ScrollTrigger.update);
    }
};

const disable = () => {
    if (!scroller) {
        return;
    }

    if (isTouch) {
        scroller.stop();
    } else {
        scroller.disable({ inputOnly: true });
    }
};

const enable = () => {
    if (!scroller) {
        return;
    }

    if (isTouch) {
        scroller.start();
    } else {
        scroller.enable();
    }
};

const init = () => {
    if (!$scroller) {
        return;
    }

    if (isTouch) {
        document.documentElement.classList.add('is-scroller-lenis');

        scroller = new Lenis({
            wrapper: $scroller,
            content: $scroller.querySelector('div'),
            duration: 1.5,
            smoothTouch: true,
        });

        const raf = (time) => {
            scroller.raf(time);

            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);
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

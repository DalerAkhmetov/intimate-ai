import ASScroll from '@ashthornton/asscroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { isScrollLocked } from '@scripts/helpers';

const $scroller = document.querySelector('[asscroll-container]');

const isTouch = 'ontouchstart' in document.documentElement;

let scroller = null;

const setScrollValue = (value) => {
    document.documentElement.style.setProperty('--scroll-value', value);
};

const getElement = () => $scroller;

const getInstance = () => scroller;

const getPosition = () => scroller.currentPos;

const setPosition = (position, smooth = false) => {
    if (position < 0) {
        position = 0;
    } else if (position > scroller.maxScroll) {
        position = scroller.maxScroll;
    }

    if (smooth) {
        if (isTouch) {
            scroller.currentPos = position;

            $scroller.scrollTo({
                top: position,
                behavior: 'smooth',
            });
        } else {
            scroller.scrollTo(position);
        }
    } else {
        scroller.currentPos = position;

        if (isTouch) {
            $scroller.scrollTop = position;

            setScrollValue(getPosition() / (scroller.maxScroll - innerHeight));
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
    gsap.ticker.add(scroller.update);

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

    ScrollTrigger.addEventListener('refresh', scroller.resize);

    scroller.on('update', ScrollTrigger.update);
};

const init = () => {
    if (!$scroller) {
        return;
    }

    scroller = new ASScroll({
        customScrollbar: false,
        scrollbarStyles: false,
        disableRaf: true,
        touchScrollType: isTouch ? 'scrollTop' : undefined,
    });

    makeFriendsWithScrollTrigger();

    if (isTouch) {
        setScrollValue(getPosition() / (scroller.maxScroll - innerHeight));

        onScroll((scrollPos) => {
            setScrollValue(scrollPos / (scroller.maxScroll - innerHeight));
        });

        document.documentElement.classList.add('asscroll-touch');
    } else {
        scroller.on('update', ({ currentPos }) => {
            setScrollValue(currentPos / scroller.maxScroll);
        });
    }

    if (!isScrollLocked()) {
        scroller.enable();
    }
};

export default {
    init,
    onScroll,
    offScroll,
    setPosition,
    getPosition,
    getInstance,
    getElement,
};

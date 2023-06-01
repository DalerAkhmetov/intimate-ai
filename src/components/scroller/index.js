import ASScroll from '@ashthornton/asscroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { isScrollLocked } from '@scripts/helpers';

const $scroller = document.querySelector('[asscroll-container]');

const isTouch = 'ontouchstart' in document.documentElement;

let scroller = null;
let lenis = null;

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

        lenis.on('scroll', func);
    } else {
        lenis.on('scroll', callback);
    }
};

const makeFriendsWithScrollTrigger = () => {
    gsap.ticker.add((time)=>{
        lenis.raf(time * 1000)
    })
    /*ScrollTrigger.defaults({
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
    });*/

    //ScrollTrigger.addEventListener('refresh', scroller.resize);

    //scroller.on('update', ScrollTrigger.update);
};

const disable = () => {
    if (!scroller) {
        return;
    }

    scroller.disable({ inputOnly: true });
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

    // scroller = new ASScroll({
    //     customScrollbar: false,
    //     scrollbarStyles: false,
    //     disableRaf: true,
    //    // touchScrollType: isTouch ? 'scrollTop' : undefined,
    // });
    lenis = new Lenis();

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

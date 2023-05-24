import * as bodyScrollLock from 'body-scroll-lock';

import scroller from '@src/components/scroller';

let dataScrollLocks;

export const isDesktop = () => innerWidth >= 1024;
export const isTablet = () => innerWidth < 1024;
export const isTabletOnly = () => innerWidth < 1024 && innerWidth >= 768;
export const isMobile = () => innerWidth < 768;

export const lockScroll = (state, $element, name) => {
    const scrollerInstance = scroller.getInstance();

    if (typeof dataScrollLocks === 'undefined') {
        dataScrollLocks = new Set();
    }

    let scrollLocks = dataScrollLocks;

    if (state) {
        if (typeof name === 'string') {
            scrollLocks.add(name);
        }

        bodyScrollLock.disableBodyScroll($element, {
            reserveScrollBarGap: false,
        });

        setTimeout(() => {
            document.documentElement.classList.add('is-scroll-locked');
        }, 0);

        if (scrollerInstance) {
            scrollerInstance.disable({ inputOnly: true });
        }
    } else {
        if (typeof name === 'string') {
            scrollLocks.delete(name);
        }

        bodyScrollLock.enableBodyScroll($element);

        if (!scrollLocks.size) {
            bodyScrollLock.clearAllBodyScrollLocks();

            document.documentElement.classList.remove('is-scroll-locked');

            if (scrollerInstance) {
                scrollerInstance.enable();
            }
        }
    }
};

export const isScrollLocked = () => {
    return document.documentElement.classList.contains('is-scroll-locked');
};

export const dataPage = (name) => {
    if (typeof name !== 'undefined') {
        document.documentElement.dataset.page = name;
    }

    return document.documentElement.dataset.page;
};

export const loadingState = (state) => {
    if (typeof state === 'boolean') {
        document.documentElement.classList.toggle('is-loading', state);
    }

    return document.documentElement.classList.contains('is-loading');
};

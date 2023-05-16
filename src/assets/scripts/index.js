import debounce from 'lodash.debounce';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { isTablet } from '@scripts/helpers';
import uaParser from '@scripts/ua-parser';
import vh from '@scripts/vh';

import form from '@components/form';
import popup from '@components/popup';
import preloader from '@components/preloader';
import input from '@components/ui/input';

import main from '@pages/main';

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
    ignoreMobileResize: true,
});

let resizeWidth = null;

const resize = () => {
    if (isTablet() && resizeWidth && resizeWidth === innerWidth) {
        return;
    }

    uaParser.resize();
    vh.resize();

    main.resize();

    resizeWidth = innerWidth;
};

const init = () => {
    uaParser.init();
    vh.init();

    preloader
        .init(async () => {
            form.init();
            popup.init();
            input.init();

            main.init();

            await main.animateOnLoad();
        })
        .then(() => {
            main.animateAfterLoad();
        });

    resizeWidth = innerWidth;

    window.addEventListener('resize', debounce(resize, 500));
};

init();

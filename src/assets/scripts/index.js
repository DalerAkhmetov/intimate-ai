import debounce from 'lodash.debounce';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { isTablet } from '@scripts/helpers';
import uaParser from '@scripts/ua-parser';
import vUnits from '@src/assets/scripts/v-units';

import animationTextScramble from '@components/animation/text-scramble';
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
    vUnits.resize();

    main.resize();

    resizeWidth = innerWidth;
};

const init = () => {
    uaParser.init();
    vUnits.init();

    preloader
        .init(async () => {
            animationTextScramble.init();
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

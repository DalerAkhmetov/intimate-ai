import debounce from 'lodash.debounce';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import currentYear from '@scripts/current-year';
import { isTablet } from '@scripts/helpers';
import uaParser from '@scripts/ua-parser';
import vUnits from '@src/assets/scripts/v-units';

import animationTextScramble from '@components/animation/text-scramble';
import form from '@components/form';
import fps from '@components/fps';
import getParams from '@components/get-params';
import popup from '@components/popup';
import preloader from '@components/preloader';
import scroller from '@components/scroller';
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

    const lastPosition = scroller.getPosition();

    scroller.setPosition(0);

    setTimeout(() => {
        main.resize();

        ScrollTrigger.refresh();

        scroller.setPosition(lastPosition);
    }, 100);

    resizeWidth = innerWidth;
};

const init = () => {
    currentYear.init();
    uaParser.init();
    vUnits.init();
    scroller.init();

    preloader
        .init(async () => {
            animationTextScramble.init();
            form.init();
            fps.init();
            getParams.init();
            popup.init();
            input.init();

            main.init();

            await preloader.hide();
            await main.animateOnLoad();
        })
        .then(() => {
            main.animateAfterLoad();
        });

    resizeWidth = innerWidth;

    window.addEventListener('resize', debounce(resize, 500));
};

init();

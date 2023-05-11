import debounce from 'lodash.debounce';

import { isTablet } from '@scripts/helpers';
import uaParser from '@scripts/ua-parser';
import vh from '@scripts/vh';

let resizeWidth = null;

const resize = () => {
    if (isTablet() && resizeWidth && resizeWidth === innerWidth) {
        return;
    }

    uaParser.resize();
    vh.resize();

    resizeWidth = innerWidth;
};

const init = () => {
    uaParser.init();
    vh.init();

    resizeWidth = innerWidth;

    window.addEventListener('resize', debounce(resize, 500));
};

init();

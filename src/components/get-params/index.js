import Cookies from 'js-cookie';

const $jsGetParamsLink = document.querySelectorAll('.js-get-params-link');

const cookieName = 'last-search-params';
const cookieExpires = window.mainLinkCookieExpires || 30;

const getNewUrl = (href, params = '') => {
    const url = new URL(href);
    const urlSearchParams = new URLSearchParams(url.search);
    const searchParams = new URLSearchParams(params);

    searchParams.forEach((value, key) => {
        urlSearchParams.set(key, value);
    });

    return `${url.origin}${url.pathname}?${urlSearchParams.toString()}`;
};

const setParamsToLink = () => {
    if (!$jsGetParamsLink.length) {
        return;
    }

    $jsGetParamsLink.forEach(($jsGetParamsLinkCurrent) => {
        $jsGetParamsLinkCurrent.setAttribute('href', getNewUrl($jsGetParamsLinkCurrent.getAttribute('href'), Cookies.get(cookieName)));
    });
};

const setCookies = () => {
    if (location.search) {
        Cookies.set(cookieName, location.search, { expires: cookieExpires });
    }
};

const init = () => {
    setCookies();
    setParamsToLink();
};

export default {
    init,
};

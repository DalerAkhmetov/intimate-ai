import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

const $jsGetParamsLink = document.querySelectorAll('.js-get-params-link');

const cookieName = 'last-search-params';
const cookieExpires = window.mainLinkCookieExpires || 30;
const paramName = window.mainLinkParam || 'start';

let dataFromCookie = null;

const sendData = () => {
    if (!dataFromCookie) {
        return;
    }

    fetch(window.mainLinkReqEp, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${window.cf?.bearerToken}`,
        },
        body: JSON.stringify({
            expiration_ttl: window.cf?.dataExpiration || 60,
            key: dataFromCookie.key,
            value: dataFromCookie.value,
        }),
    }).catch((error) => {
        console.error(error);
    });
};

const getNewUrl = (href) => {
    const url = new URL(href);

    return `${url.origin}${url.pathname}?${paramName}=${dataFromCookie.keyBase64}`;
};

const setParamsToLink = () => {
    if (!$jsGetParamsLink.length || !dataFromCookie) {
        return;
    }

    $jsGetParamsLink.forEach(($jsGetParamsLinkCurrent) => {
        $jsGetParamsLinkCurrent.setAttribute('href', getNewUrl($jsGetParamsLinkCurrent.getAttribute('href')));
    });
};

const getJSONFromCookieParams = () => {
    const cookieJSON = {};

    new URLSearchParams(Cookies.get(cookieName)).forEach((value, key) => {
        cookieJSON[key] = value;
    });

    return JSON.stringify(cookieJSON);
};

const createDataFromCookie = () => {
    if (!Cookies.get(cookieName)) {
        return;
    }

    const key = uuidv4();

    dataFromCookie = {
        key,
        keyBase64: btoa(key),
        value: getJSONFromCookieParams(),
    };
};

const setCookies = () => {
    if (location.search) {
        Cookies.set(cookieName, location.search, { expires: cookieExpires });
    }
};

const init = () => {
    setCookies();
    createDataFromCookie();
    setParamsToLink();
    sendData();
};

export default {
    init,
};

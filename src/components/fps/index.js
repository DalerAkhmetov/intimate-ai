let $fps = null;

const disabled = false;

const show = () => {
    if (!$fps) {
        return;
    }

    let lastUpdateTime = performance.now();

    const raf = () => {
        const t = performance.now();
        const delay = t - lastUpdateTime;

        lastUpdateTime = t;

        $fps.innerText = `fps: ${(1000 / delay).toFixed(2)}`;

        requestAnimationFrame(raf);
    };

    raf();
};

const createElement = () => {
    $fps = document.createElement('div');

    $fps.classList.add('fps');

    document.body.insertBefore($fps, document.body.firstChild);
};

const init = () => {
    if (!window.isDev || disabled) {
        return;
    }

    createElement();
    show();
};

export default {
    init,
};

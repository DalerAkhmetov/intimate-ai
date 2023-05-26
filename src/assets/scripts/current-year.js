const $jsCurrentYear = document.querySelectorAll('.js-current-year');

const currentYear = new Date().getFullYear().toString();

const init = () => {
    $jsCurrentYear.forEach(($jsCurrentYearCurrent) => {
        if ($jsCurrentYearCurrent.textContent !== currentYear) {
            $jsCurrentYearCurrent.textContent = currentYear;
        }
    });
};

export default {
    init,
};

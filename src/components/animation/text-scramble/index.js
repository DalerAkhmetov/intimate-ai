import { gsap } from 'gsap';

const $jsTextScrabmle = document.querySelectorAll('.js-text-scrabmle');

const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!', '§', '$', '%', '&', '/', '(', ')', '=', '?', '_', '<', '>', '^', '°', '*', '#', '-', ':', ';', '~'];
const duration = 2; // sec
const delay = 0.5; // from 0 to 1
const sliceCount = Math.round((Math.min(delay, 1) / 1) * symbols.length);

const animate = ($jsTextScrabmleCurrent) => {
    if (!$jsTextScrabmleCurrent.generatedText) {
        return;
    }

    const generatedTextLength = $jsTextScrabmleCurrent.generatedText.length;

    let i = 0;

    const interval = setInterval(() => {
        $jsTextScrabmleCurrent.textContent = $jsTextScrabmleCurrent.generatedText[i];

        i++;

        if (i >= generatedTextLength) {
            clearInterval(interval);

            delete $jsTextScrabmleCurrent.generatedText;
        }
    }, (duration * 1000) / generatedTextLength);
};

const generate = ($jsTextScrabmleCurrent) => {
    const splittedText = $jsTextScrabmleCurrent.textContent.split('').map((char, charIndex) => {
        if (char === ' ') {
            return char;
        }

        const charSet = gsap.utils.shuffle([...symbols]);

        if (sliceCount > 0 && charIndex) {
            charSet.push(...Array(charIndex).fill(charSet.slice(0, sliceCount)).flat());
        }

        charSet.push(char);

        return charSet;
    });

    const generatedTextLength = splittedText.at(-1).length;

    $jsTextScrabmleCurrent.generatedText = [];

    for (let i = 0; i < generatedTextLength; i++) {
        $jsTextScrabmleCurrent.generatedText.push(
            splittedText
                .map((charSet) => {
                    if (typeof charSet === 'string') {
                        return charSet;
                    } else if (i >= charSet.length) {
                        return charSet.at(-1);
                    } else {
                        return charSet[i];
                    }
                })
                .join('')
        );
    }
};

const init = () => {
    if (!$jsTextScrabmle.length) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate(entry.target);

                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 1 }
    );

    $jsTextScrabmle.forEach(($jsTextScrabmleCurrent) => {
        generate($jsTextScrabmleCurrent);

        observer.observe($jsTextScrabmleCurrent);
    });
};

export default {
    init,
};

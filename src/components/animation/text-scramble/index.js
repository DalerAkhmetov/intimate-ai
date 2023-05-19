import { gsap } from 'gsap';

const $jsTextScramble = document.querySelectorAll('.js-text-scramble');

const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!', '§', '$', '%', '&', '/', '(', ')', '=', '?', '_', '<', '>', '^', '°', '*', '#', '-', ':', ';', '~'];
const duration = 2; // sec
const delay = 0.5; // from 0 to 1, where 0 - faster, 1 - slower
const sliceCount = Math.round((Math.min(delay, 1) / 1) * symbols.length);

const animate = ($jsTextScrambleCurrent) => {
    if (!$jsTextScrambleCurrent.generatedText) {
        return;
    }

    const counter = { i: 0 };

    gsap.set($jsTextScrambleCurrent, {
        overflow: 'hidden',
        width: $jsTextScrambleCurrent.clientWidth,
        height: $jsTextScrambleCurrent.clientHeight,
    });

    gsap.to(counter, {
        duration,
        ease: 'none',
        roundProps: 'i',
        i: $jsTextScrambleCurrent.generatedText.length - 1,
        onUpdate() {
            $jsTextScrambleCurrent.textContent = $jsTextScrambleCurrent.generatedText[counter.i];
        },
        onComplete() {
            delete $jsTextScrambleCurrent.generatedText;

            gsap.set($jsTextScrambleCurrent, { clearProps: 'all' });
        },
    });
};

const generate = ($jsTextScrambleCurrent) => {
    const splittedText = $jsTextScrambleCurrent.textContent.split('').map((char, charIndex) => {
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

    $jsTextScrambleCurrent.generatedText = [];

    for (let i = 0; i < generatedTextLength; i++) {
        $jsTextScrambleCurrent.generatedText.push(
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
    if (!$jsTextScramble.length) {
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

    $jsTextScramble.forEach(($jsTextScrambleCurrent) => {
        generate($jsTextScrambleCurrent);

        observer.observe($jsTextScrambleCurrent);
    });
};

export default {
    init,
};
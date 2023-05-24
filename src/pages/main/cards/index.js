import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { isDesktop, isMobile } from '@scripts/helpers';
import animationTextScramble from '@components/animation/text-scramble';

const $section = document.querySelector('.main__section--cards');
const $areaTop = $section.querySelector('.main__area--top');
const $title = $section.querySelector('.main__title');
const $card = $section.querySelectorAll('.main__card');

const gsapCtx = gsap.context(() => {});

const getClipPathCircle = (size) => {
    if (typeof size === 'undefined') {
        size = (innerWidth > innerHeight ? innerWidth : innerHeight) * 1.25;
    }

    return `circle(${size}px at ${innerWidth}px ${innerHeight / 2}px)`;
};

const animateOnScroll = () => {
    // TODO: fix timing (duration and scroll distance), image scale animation
    if (gsapCtx.data.length) {
        gsapCtx.revert();
    }

    const isDesktopNow = isDesktop();
    const isMobileNow = isMobile();
    const neededProgressValue = isDesktopNow ? 0.85 : 0.55;

    let clipPathCompleted = false;

    gsapCtx.add(() => {
        gsap.set($section, {
            marginTop: -innerHeight * 1.5,
            clipPath: getClipPathCircle(0),
            pointerEvents: 'auto',
        });

        if (isMobileNow) {
            $card.forEach(($cardCurrent, cardIndex) => {
                const $cardPrev = $card[cardIndex - 1];

                $cardCurrent.marginTop = gsap.getProperty($cardCurrent, 'marginTop');

                if (cardIndex) {
                    gsap.set($cardCurrent, {
                        marginTop: -$cardCurrent.getBoundingClientRect().height + $cardPrev.querySelector('.main__card-text').getBoundingClientRect().top - $cardPrev.getBoundingClientRect().top,
                    });
                }
            });
        }

        const timeline = gsap
            .timeline({
                scrollTrigger: {
                    trigger: $section,
                    start: 'top top',
                    end: `+=${innerHeight * 3}`,
                    scrub: true,
                    pin: true,
                },
            })
            .to($section, {
                ease: 'none',
                clipPath: getClipPathCircle(),
                onComplete() {
                    gsap.set($section, { clearProps: 'clipPath' });
                },
                onUpdate() {
                    const isNeededProgress = this.progress() >= neededProgressValue;

                    if (isNeededProgress && !clipPathCompleted) {
                        clipPathCompleted = true;

                        animationTextScramble.animate($title);
                    } else if (!isNeededProgress && clipPathCompleted) {
                        clipPathCompleted = false;

                        animationTextScramble.animate($title, true);
                    }
                },
            });

        gsap.set(timeline.scrollTrigger.spacer, { pointerEvents: 'none' });

        const cardFromXDirection = isMobileNow ? -1 : 1;

        $card.forEach(($cardCurrent, cardIndex) => {
            $cardCurrent.BCR = $cardCurrent.getBoundingClientRect();

            timeline.from($cardCurrent, {
                ease: 'none',
                x: $cardCurrent.BCR.width * (cardIndex % 2 ? cardFromXDirection : -cardFromXDirection),
                y: innerHeight,
            });
        });

        const areaTopBCR = $areaTop.getBoundingClientRect();
        const titleBCR = $title.getBoundingClientRect();
        const cardsBottomOffset = (innerHeight - (titleBCR.bottom - areaTopBCR.top) - $card[0].clientHeight) / 2;

        $card.forEach(($cardCurrent, cardIndex) => {
            if (isMobileNow && !cardIndex) {
                return;
            }

            const isFirstCardInTimeline = cardIndex === (isMobileNow ? 1 : 0);

            let x = 0;
            let y = 0;

            if (isMobileNow) {
                x = ($cardCurrent.BCR.left - $card[0].BCR.left - $cardCurrent.BCR.width - $cardCurrent.marginTop) * (cardIndex > 1 ? 1 : -1);

                y = -$cardCurrent.BCR.top + $card[0].BCR.top;
            } else {
                y = innerHeight - ($cardCurrent.BCR.top - areaTopBCR.top + $cardCurrent.BCR.height) - cardsBottomOffset;

                if (cardIndex === 0) {
                    x = innerWidth / 2 - $cardCurrent.BCR.left - $cardCurrent.BCR.width / 2;
                } else if (cardIndex === 1) {
                    if (isDesktopNow) {
                        x = -$cardCurrent.BCR.left + gsap.getProperty($areaTop, 'paddingLeft');
                    } else {
                        x = -Math.abs($cardCurrent.BCR.left - $card[0].BCR.left) - $cardCurrent.BCR.width - gsap.getProperty($cardCurrent, 'paddingRight');
                    }
                } else if (cardIndex === 2) {
                    if (isDesktopNow) {
                        x = innerWidth - $cardCurrent.BCR.right - gsap.getProperty($areaTop, 'paddingRight');
                    } else {
                        x = Math.abs($cardCurrent.BCR.left - $card[0].BCR.left) + $cardCurrent.BCR.width + gsap.getProperty($cardCurrent, 'paddingLeft');
                    }
                }
            }

            timeline.to(
                $cardCurrent,
                {
                    delay: isFirstCardInTimeline ? 0.5 : 0,
                    ease: 'none',
                    x,
                    y,
                },
                isFirstCardInTimeline ? undefined : '<'
            );
        });
    });
};

const resize = () => {
    if (!$section) {
        return;
    }

    animateOnScroll();
};

const init = () => {
    if (!$section) {
        return;
    }

    animateOnScroll();
};

export default {
    init,
    resize,
};

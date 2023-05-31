import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { isDesktop, isMobile } from '@scripts/helpers';
import animationTextScramble from '@components/animation/text-scramble';

const $section = document.querySelector('.main__section--cards');
const $areaTop = $section.querySelector('.main__area--top');
const $title = $section.querySelector('.main__title');
const $card = $section.querySelectorAll('.main__card');
const $imageScale = $section.querySelector('.main__image-scale');
const $imageScaleWrapper = $section.querySelector('.main__image-scale-wrapper');
const $imageScaleBg = $section.querySelector('.main__image-scale-bg');
const $imageScaleGirl = $section.querySelector('.main__image-scale-girl');
const $imageSpace = $section.querySelector('.main__image-space');
const $button = $section.querySelector('.main__button');

const gsapCtx = gsap.context(() => {});

const getClipPathCircle = (size) => {
    if (typeof size === 'undefined') {
        size = (innerWidth > innerHeight ? innerWidth : innerHeight) * 1.25;
    }

    return `circle(${size}px at ${innerWidth}px ${innerHeight / 2}px)`;
};

const setImageScaleSize = () => {
    const $cardFirstImage = $card[0].querySelector('.main__card-image');

    gsap.set([$imageScale, $imageScaleWrapper], { clearProps: 'all' });

    const widthStart = $cardFirstImage.clientWidth;
    const heightStart = $cardFirstImage.clientHeight;
    const widthEnd = $imageSpace.clientWidth;
    const heightEnd = $imageSpace.clientHeight;

    let scaleX = widthStart / widthEnd;
    let scaleY = heightStart / heightEnd;
    let scaleWrapperX = 1;
    let scaleWrapperY = 1;
    let clipX = 0;
    let clipY = 0;

    if (scaleX < scaleY) {
        scaleX = scaleY;
        clipX = ((widthEnd * scaleX - widthStart) / 2) * (heightEnd / heightStart);
    } else {
        scaleY = scaleX;
        clipY = ((heightEnd * scaleY - heightStart) / 2) * (widthEnd / widthStart);
    }

    $imageScale.style.setProperty('--clip-path-top', `${clipY}px`);
    $imageScale.style.setProperty('--clip-path-right', `${clipX}px`);
    $imageScale.style.setProperty('--clip-path-bottom', `${clipY}px`);
    $imageScale.style.setProperty('--clip-path-left', `${clipX}px`);
    $imageScale.style.setProperty('--clip-path-radius', `${gsap.getProperty($imageScale, '--radius-from')}`);

    gsap.set($imageScale, {
        width: widthEnd,
        height: heightEnd,
        scaleX,
        scaleY,
        clipPath: 'inset(var(--clip-path-top) var(--clip-path-right) var(--clip-path-bottom) var(--clip-path-left) round var(--clip-path-radius))',
    });

    gsap.set($imageScaleWrapper, {
        scaleX: scaleWrapperX,
        scaleY: scaleWrapperY,
    });
};

const animateOnScroll = () => {
    // TODO: fix timing (duration and scroll distance)
    if (gsapCtx.data.length) {
        gsapCtx.revert();
    }

    const isDesktopNow = isDesktop();
    const isMobileNow = isMobile();
    const neededProgressValue = isDesktopNow ? 0.85 : 0.55;

    let clipPathCompleted = false;
    let imageScaleMoveTo = 0;

    gsapCtx.add(() => {
        setImageScaleSize();

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
                    onLeave() {
                        gsap.set($card[0], { zIndex: 1 });
                    },
                    onEnterBack() {
                        gsap.set($card[0], { clearProps: 'zIndex' });
                    },
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

            if (!cardIndex) {
                const cardImageCurrentBCR = $cardCurrent.querySelector('.main__card-image').getBoundingClientRect();

                imageScaleMoveTo = cardImageCurrentBCR.top + cardImageCurrentBCR.height / 2 - $cardCurrent.BCR.top;
            }

            timeline.from($cardCurrent, {
                ease: 'none',
                x: $cardCurrent.BCR.width * (cardIndex % 2 ? cardFromXDirection : -cardFromXDirection),
                y: innerHeight,
            });
        });

        const areaTopBCR = $areaTop.getBoundingClientRect();
        const titleBCR = $title.getBoundingClientRect();
        const imageSpaceBCR = $imageSpace.getBoundingClientRect();
        const cardsBottomOffset = (innerHeight - (titleBCR.bottom - areaTopBCR.top) - $card[0].clientHeight) / 2;

        $card.forEach(($cardCurrent, cardIndex) => {
            if (isMobileNow && !cardIndex) {
                imageScaleMoveTo = imageSpaceBCR.top + imageSpaceBCR.height / 2 - ($cardCurrent.BCR.top + imageScaleMoveTo);

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

            if (!cardIndex) {
                imageScaleMoveTo = imageSpaceBCR.top + imageSpaceBCR.height / 2 - ($cardCurrent.BCR.top + y + imageScaleMoveTo);
            }
        });

        const imageTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: $section,
                endTrigger: $button,
                start: `bottom bottom+=${$section.clientHeight - (innerHeight + 10)}`,
                end: `bottom-=${$button.clientHeight} bottom`,
                scrub: 0.5,
            },
        });

        imageTimeline
            .to([$imageScaleWrapper, $imageScaleBg, $imageScaleGirl], {
                ease: 'none',
                x: 0,
                y: 0,
                scale: 1,
            })
            .to(
                $imageScale,
                {
                    ease: 'none',
                    x: 0,
                    y: imageScaleMoveTo,
                    scale: 1,
                    '--clip-path-top': '0px',
                    '--clip-path-right': '0px',
                    '--clip-path-bottom': '0px',
                    '--clip-path-left': '0px',
                    '--clip-path-radius': gsap.getProperty($imageScale, '--radius-to'),
                    roundProps: 'y',
                },
                '<'
            )
            .from(
                $button,
                {
                    ease: 'none',
                    yPercent: 100,
                },
                '<'
            );
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

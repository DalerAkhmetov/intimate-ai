import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import scroller from '@src/components/scroller';

import { isDesktop, isMobile } from '@scripts/helpers';
import animationTextScramble from '@components/animation/text-scramble';

const $canvas = document.querySelector('.main__section-canvas');
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
    if (gsapCtx.data.length) {
        gsapCtx.revert();
    }

    const isDesktopNow = isDesktop();
    const isMobileNow = isMobile();
    const neededProgressValue = isDesktopNow ? 0.85 : 0.55;

    let clipPathCompleted = false;
    let imageScaleMoveTo = 0;

    const animationTotalDistance = innerHeight * 2.25;
    const getDurationFromDistance = (value) => (value / animationTotalDistance) * 0.5;

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
                    end: `+=${animationTotalDistance}`,
                    scrub: 0.5,
                    pin: true,
                    anticipatePin: 1,
                    onLeave() {
                        gsap.set($card[0], { zIndex: 1 });
                    },
                    onEnterBack() {
                        gsap.set($card[0], { clearProps: 'zIndex' });
                    },
                },
            })
            .to($section, {
                duration: getDurationFromDistance(innerHeight / 2),
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
                duration: getDurationFromDistance(innerHeight / 3),
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
                x = ($cardCurrent.BCR.left * 2 + $cardCurrent.BCR.width) * (cardIndex > 1 ? 1 : -1);
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
                    delay: isFirstCardInTimeline ? getDurationFromDistance(innerHeight / 4) : 0,
                    duration: getDurationFromDistance(innerHeight / 2),
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

        /*imageTimeline
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
            );*/
    });
};

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
function mapLinear(x, a1, a2, b1, b2 ) {
    //console.log(x, a1, a2, b1, b2);
    return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );
}

const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
        image.src = url;
    });
};

class Playground {
    constructor(canvas, textures) {
        this.canvas = canvas;
        this.background = textures.cardBackground;
        this.progress = 0;
        this.dpr = Math.min(2, window.devicePixelRatio)
        this.renderParams = {};
    }


    setProgress = (p) => {
        this.progress = p;
        this.computeRenderParams();
    }
    create = () => {
        console.log('start creating, add gsap ticker callback');
        this.context = this.canvas.getContext("2d")
        this.onResize()
        gsap.ticker.add(this.update);
        window.addEventListener("resize", this.onResize)
    }
    onResize = () => {
        this.canvas.style.width = "".concat(window.innerWidth, "px")
        this.canvas.style.height = "".concat(window.innerHeight, "px")
        //this.canvas.style.marginTop = "".concat(-3000, "px")
        this.canvas.width = window.innerWidth * this.dpr
        this.canvas.height = window.innerHeight * this.dpr

        this.computeRenderParams();
    }
    computeRenderParams = () => {
        /*let ratio = 1198 / 798;
        let width = lerp(200, window.innerWidth, this.progress);
        let height = width / ratio;
        let posX = (window.innerWidth - width) * 0.5,
            posY = lerp(0, 200, this.progress);*/
        let ratio = 1198 / 798;
        let width = lerp(200, window.innerWidth, this.progress);
        //let height = width / ratio;
        let height = lerp(100, window.innerHeight, this.progress);
        let posX = (window.innerWidth - width) * 0.5,
            posY = lerp(200, 0, this.progress);

        this.renderParams = {
            ratio,
            width,
            height,
            posX,
            posY,
        }
    }
    draw = () => {
        let ctx = this.context;
        // ctx.strokeStyle = "rgb(255, 0, 0)";
        // ctx.fillStyle = "rgba(255, 255, 0, .5)";
        let {ratio, width, height, posX, posY} = this.renderParams;
        ctx.save();
        ctx.translate(posX, posY);
        ctx.beginPath();
        //ctx.roundRect(0, 0, width, height, 20); не работает на iOS safari 14
        ctx.rect(0, 0, width, height);
        ctx.clip();
        ctx.drawImage(this.background, 0, 0, width, height);
        ctx.restore();
        //ctx.stroke();
        //ctx.fill();
    }
    update = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.save()
        this.context.scale(this.dpr, this.dpr)
        this.draw()
        this.context.restore()
    }
}

const resize = () => {
    if (!$section) {
        return;
    }

    animateOnScroll();
};

const loadResources = async () => {
    let image = await loadImage('https://images.prismic.io/okcc-labs/367d3ec0-317b-4fac-ba90-d885e27c7cdd_card-primary.png?auto=compress,format&w=1200')
    return {
        textures: {
            cardBackground: image,
        }
    }
}

class AnimationCreator {
    constructor(textures) {
        this.textures = textures;
        this.steps = {
            background: {start: 0, end: 0}
        }
    }
    compute = () => {
        let areaTopBCR = $areaTop.getBoundingClientRect();
        let sectionBCR = $section.getBoundingClientRect();
        this.steps.background.start = areaTopBCR.bottom + window.innerHeight * 1.5;
        this.steps.background.end =  sectionBCR.bottom + window.innerHeight * 1.5;
        this.steps.background.start = 3800;
        this.steps.background.end =  4500;
        // this.steps.background.start = 3000;
        // this.steps.background.end = 4500;
    }

    async create() {
        this.compute();
        window.addEventListener("resize", this.compute)

        let p = new Playground($canvas, this.textures);
        p.create();
        scroller.onScroll((t) => {
            console.log(t.scroll);
            console.log(this.steps);
            p.setProgress(clamp(mapLinear(t.scroll, this.steps.background.start, this.steps.background.end, 0, 1), 0, 1));
        });

    }
}

const init = async () => {
    if (!$section) {
        return;
    }
    animateOnScroll();



    const {textures} = await loadResources();
    let animCreator = new AnimationCreator(textures);
    setTimeout(animCreator.create.bind(animCreator), 3000); // вместо 3000 создание должно произойти после полной загрузки, так как от этого зависит расчет правильных точек анимации по скроллу
};

export default {
    init,
    resize,
};

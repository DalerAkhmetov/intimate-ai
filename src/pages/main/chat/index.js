import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { isDesktop } from '@scripts/helpers';
import animationTextScramble from '@components/animation/text-scramble';

const $section = document.querySelector('.main__section--chat');
const $title = $section.querySelector('.main__title');
const $text = $section.querySelector('.main__text');
const $device = $section.querySelector('.main__device');
const $screen = $device.querySelector('.main__screen');
const $messages = $screen.querySelector('.main__messages');
const $message = $screen.querySelectorAll('.main__message');
const $pause = $screen.querySelector('.main__play-pause img:last-child');
const $voiceTrack = $screen.querySelector('.main__voice-track:last-child');
const $button = $screen.querySelector('.main__button');
const $fillCircle = $section.querySelector('.main__fill-circle');

const gsapCtx = gsap.context(() => {});

const animateOnScroll = () => {
    if (gsapCtx.data.length) {
        gsapCtx.revert();
    }

    const isDesktopNow = isDesktop();
    const baseProps = {
        ease: 'none',
        opacity: 0,
    };

    gsapCtx.add(() => {
        ScrollTrigger.create({
            trigger: $title,
            start: 'bottom bottom',
            onEnter() {
                animationTextScramble.animate($title);
            },
            onLeaveBack() {
                animationTextScramble.animate($title, true);
            },
        });

        gsap.timeline({
            scrollTrigger: {
                trigger: isDesktopNow ? $text : $section,
                endTrigger: isDesktopNow ? $section : undefined,
                start: isDesktopNow ? 'top bottom' : 'top top',
                end: isDesktopNow ? 'bottom bottom' : `+=${innerHeight / 2}`,
                scrub: true,
                pin: !isDesktopNow,
            },
        })
            .from($text, baseProps)
            .from($device, baseProps);

        const messagesDistance = innerHeight * 2;
        const messagesTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: $section,
                start: 'bottom bottom',
                end: `+=${messagesDistance}`,
                scrub: true,
                pin: true,
            },
        });

        gsap.set($messages, { y: $messages.clientHeight });

        $message.forEach(($messageCurrent, messageIndex) => {
            messagesTimeline.to($messages, {
                delay: 0.5,
                ease: 'none',
                y: `-=${(messageIndex ? 0 : gsap.getProperty($messages, 'paddingTop') + gsap.getProperty($messages, 'paddingBottom')) + $messageCurrent.clientHeight + gsap.getProperty($messageCurrent, 'marginTop')}`,
            });

            messagesTimeline.from($messageCurrent, baseProps, '<');

            if ($messageCurrent.classList.contains('main__message--voice')) {
                messagesTimeline
                    .fromTo(
                        $pause,
                        { opacity: 0 },
                        {
                            delay: 0.5,
                            ease: 'none',
                            opacity: 1,
                        }
                    )
                    .to($voiceTrack, {
                        ease: 'none',
                        width: '100%',
                    })
                    .fromTo(
                        $pause,
                        { opacity: 1 },
                        {
                            ease: 'none',
                            opacity: 0,
                        }
                    );
            }

            if ($messageCurrent.classList.contains('main__message--image')) {
                messagesTimeline.from($button, {
                    ...baseProps,
                    delay: 0.5,
                });
            }
        });

        messagesTimeline.to($fillCircle, {
            delay: 0.5,
            duration: (messagesDistance / (innerHeight / 2)) * 0.5,
            ease: 'none',
            scale: 1,
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

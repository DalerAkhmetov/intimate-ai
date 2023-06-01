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
const $audio = $screen.querySelector('.main__audio');
const $playPause = $screen.querySelector('.main__play-pause');
const $voiceTrack = $screen.querySelector('.main__voice-track:last-child');
const $button = $screen.querySelector('.main__button');

const gsapCtx = gsap.context(() => {});

const audioPlayPauseHadler = () => {
    $playPause.classList.toggle('is-playing', !$audio.paused);
};

const audioTimeupdateHandler = () => {
    gsap.killTweensOf($voiceTrack);

    gsap.to($voiceTrack, {
        duration: 0.3,
        ease: 'none',
        width: `${($audio.currentTime / $audio.duration) * 100}%`,
    });
};

const playPauseClickHandler = () => {
    if ($audio.paused) {
        $audio.play();
    } else {
        $audio.pause();
    }
};

const animateOnScroll = () => {
    if (gsapCtx.data.length) {
        gsapCtx.revert();
    }

    const isDesktopNow = isDesktop();
    const baseProps = {
        ease: 'none',
        opacity: 0,
    };

    const messagesFirstPosition = gsap.getProperty($messages, 'paddingTop') + gsap.getProperty($messages, 'paddingBottom') + $message[0].clientHeight + gsap.getProperty($message[0], 'marginTop');
    const messagesDistance = $messages.clientHeight - messagesFirstPosition + $button.clientHeight + innerHeight / 2;

    const getDurationFromDistance = (value) => (value / messagesDistance) * 0.5;

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

        gsap.set($messages, { y: $messages.clientHeight });

        gsap.timeline({
            scrollTrigger: {
                trigger: $text,
                endTrigger: $section,
                start: isDesktopNow ? 'top bottom' : 'bottom bottom',
                end: 'bottom bottom',
                scrub: true,
            },
        })
            .from($text, baseProps)
            .from($device, baseProps, '<50%')
            .to(
                $messages,
                {
                    ease: 'none',
                    y: `-=${messagesFirstPosition}`,
                },
                '<'
            )
            .from($message[0], baseProps, '<');

        const messagesTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: $section,
                start: 'bottom bottom',
                end: `+=${messagesDistance}`,
                scrub: true,
                pin: true,
                anticipatePin: 1,
            },
        });

        $message.forEach(($messageCurrent, messageIndex) => {
            if (!messageIndex) {
                return;
            }

            const positionToMove = $messageCurrent.clientHeight + gsap.getProperty($messageCurrent, 'marginTop');

            messagesTimeline.to($messages, {
                duration: getDurationFromDistance(positionToMove),
                ease: 'none',
                y: `-=${positionToMove}`,
            });

            messagesTimeline.from(
                $messageCurrent,
                {
                    ...baseProps,
                    duration: getDurationFromDistance(positionToMove),
                },
                '<'
            );

            if ($messageCurrent.classList.contains('main__message--image')) {
                messagesTimeline.from($button, {
                    ...baseProps,
                    duration: getDurationFromDistance($button.clientHeight),
                });
            }
        });

        messagesTimeline.to($section, {
            duration: getDurationFromDistance(innerHeight / 2),
            ease: 'none',
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

    $audio.addEventListener('play', audioPlayPauseHadler);
    $audio.addEventListener('pause', audioPlayPauseHadler);
    $audio.addEventListener('timeupdate', audioTimeupdateHandler);
    $playPause.addEventListener('click', playPauseClickHandler);
};

export default {
    init,
    resize,
};

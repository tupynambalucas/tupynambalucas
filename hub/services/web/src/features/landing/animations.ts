import gsap from 'gsap';

export const animateLandingIntro = (
  leftPanelRef: HTMLElement,
  logoWrapperRef: HTMLElement,
  rightPanelRef: HTMLElement,
): gsap.core.Timeline => {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out', duration: 1 },
  });

  tl.from(leftPanelRef, {
    xPercent: -100,
    duration: 1.2,
  })
    .from(
      logoWrapperRef,
      {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      },
      '-=0.4',
    )
    .from(
      rightPanelRef,
      {
        xPercent: 100,
        opacity: 0,
        duration: 1,
      },
      '-=0.6',
    );

  return tl;
};

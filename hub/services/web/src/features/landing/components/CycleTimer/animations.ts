import gsap from 'gsap';

export const animateTimerEntrance = (container: HTMLElement): void => {
  const elements = container.children;

  gsap.fromTo(
    elements,
    {
      y: 30,
      opacity: 0,
      scale: 0.8,
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      clearProps: 'all',
    },
  );
};

export const animateSecondsTick = (targetSelector: string): void => {
  gsap.fromTo(
    targetSelector,
    { scale: 1.15, color: 'var(--color-success)' },
    { scale: 1, color: 'var(--color-success)', duration: 0.4, ease: 'power1.out' },
  );
};

import gsap from 'gsap';

export const shakeElement = (element: HTMLElement | null): void => {
  if (element === null) return;

  gsap.killTweensOf(element);
  gsap.set(element, { x: 0 });

  gsap.fromTo(
    element,
    { x: -6 },
    {
      x: 6,
      duration: 0.05,
      repeat: 5,
      yoyo: true,
      ease: 'sine.inOut',
      clearProps: 'x',
      onComplete: () => {
        gsap.set(element, { x: 0, clearProps: 'x' });
      },
    },
  );
};

export const animateFormEntrance = (element: HTMLElement | null): void => {
  if (element === null) return;

  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      clearProps: 'all',
    },
  );
};

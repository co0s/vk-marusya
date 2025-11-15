import gsap from 'gsap';

export const modalAnimation = {
  show: (element: HTMLElement) => {
    gsap.fromTo(
      element,
      { opacity: 0, y: -30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }
    );
  },
  hide: (element: HTMLElement) => {
    return gsap.to(element, {
      opacity: 0,
      y: 20,
      scale: 0.98,
      duration: 0.25,
      ease: 'power2.in',
    });
  },
};



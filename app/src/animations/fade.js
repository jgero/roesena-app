import { sineOut } from 'svelte/easing';

// animation duration in ms
let duration = 200;
// delay fade-in unil old content is faded out
let delay = duration;

let delayZero = 0;

export const fadeIn = _ => ({
  duration,
  delay,
  easing: sineOut,
  css: t => `opacity: ${t}`
});
export const fadeOut = _ => ({
  duration,
  delayZero,
  easing: sineOut,
  css: t => `opacity: ${t}`
});

import { writable } from 'svelte/store';

function createPopupFlash() {
  const { subscribe, set, update } = writable("");

  return {
    subscribe,
    next: (message) => set(message)
  }
}

export const flashPopup = createPopupFlash();

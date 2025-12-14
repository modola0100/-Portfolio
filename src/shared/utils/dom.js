// Utility function to select a DOM element
export const $ = (selector, parent = document) => parent.querySelector(selector);

// Utility function to select multiple DOM elements
export const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

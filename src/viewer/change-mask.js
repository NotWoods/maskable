// @ts-check

/** Set of masks corresponding to radio buttons on the page. */
const defaultMasks = {
  none: 'inset(0)',
  circle: 'inset(6.36% round 50%)',
  rounded_rect: 'inset(6.36% round 34px)',
  sharp_rect: 'inset(6.36%)',
  drop: 'inset(6.36% round 50% 50% 34px)',
  cylinder: 'inset(6.36% round 50% / 30%)',
  minimum: 'inset(10% round 50%)',
  squircle: 'url(#squircle)',
};
const borderRadiiAndScale = {
  none: ['0', 'scale(1)'],
  circle: ['50%', 'scale(1.15)'],
  rounded_rect: ['34px', 'scale(1.15)'],
  sharp_rect: ['0', 'scale(1.15)'],
  drop: ['50% 50% 34px', 'scale(1.15)'],
  cylinder: ['50% / 30%', 'scale(1.15)'],
  minimum: ['50%', 'scale(1.25)'],
};


if ('serviceWorker' in navigator) {
  // Gotta load this somewhere!
  navigator.serviceWorker.register('/sw.js');
}

if (new URL(location.href).searchParams.has('secret')) {
  // Secret masks with poor support
  body.classList.add('show-secrets');
}

const maskSupport = CSS.supports(
  '(clip-path: inset(0)) or (-webkit-clip-path: inset(0))',
);

/** @type {HTMLElement} */
const container = document.querySelector('.icon__grid');
/** @type {NodeListOf<HTMLElement>} All elements to change the mask of. */
const masked = document.querySelectorAll('.masked');
/** @type {NodeListOf<HTMLElement>} */
const icons = document.querySelectorAll('.icon');

document.querySelector('.masks').addEventListener('change', evt => {
  const radio = /** @type {HTMLInputElement} */ (evt.target);
  if (radio.name === 'mask') {
    if (maskSupport) {
      const clipPath = defaultMasks[radio.value];
      masked.forEach(mask => {
        // When the radio buttons are selected,
        // change the clip path to the new mask.
        mask.style.webkitClipPath = clipPath;
        mask.style.clipPath = clipPath;
      });
    } else {
      const [borderRadius, scale] = borderRadiiAndScale[radio.value];
      icons.forEach(icon => {
        icon.style.transform = scale;
      });
      masked.forEach(mask => {
        mask.style.borderRadius = borderRadius;
      });
    }
  }
});
document.querySelector('.controls').addEventListener('change', evt => {
  const checkbox = /** @type {HTMLInputElement} */ (evt.target);
  switch (checkbox.name) {
    case 'shrink':
      // Shrink the icon to 1/4 size
      const size = checkbox.checked ? '0.25' : '1';
      container.style.transform = `scale(${size})`;
      break;
    case 'ghost':
      // Show ghost image behind icon
      container.classList.toggle('icon--ghost', checkbox.checked);
      break;
  }
});

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
  flower: 'url(#flower)',
  pebble: 'url(#pebble)',
  vessel: 'url(#vessel)',
  hexagon: 'url(#hexagon)',
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

const maskSupport = CSS.supports(
  '(clip-path: inset(0)) or (-webkit-clip-path: inset(0))'
);

/**
 * Apply the given mask onto the given HTML elements.
 * @param {NodeListOf<HTMLElement> | HTMLElement[]} masked
 * @param {NodeListOf<HTMLElement> | HTMLElement[]} icons
 * @param {string} mask
 * @returns {boolean} True if successful.
 */
export function applyMask(masked, icons, mask) {
  const maskName = /** @type {keyof typeof defaultMasks} */ (mask);
  if (maskSupport) {
    const clipPath = defaultMasks[maskName];
    masked.forEach((mask) => {
      // When the radio buttons are selected,
      // change the clip path to the new mask.
      mask.style.webkitClipPath = clipPath;
      mask.style.clipPath = clipPath;
    });
  } else {
    const tuple = borderRadiiAndScale[maskName];
    if (!tuple) return false;

    const [borderRadius, scale] = tuple;
    icons.forEach((icon) => {
      icon.style.transform = scale;
    });
    masked.forEach((mask) => {
      mask.style.borderRadius = borderRadius;
    });
  }
  return true;
}

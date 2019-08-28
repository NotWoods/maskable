/** Set of masks corresponding to radio buttons on the page. */
const defaultMasks = {
    none: 'inset(0 0 0 0)',
    circle: 'inset(3.5% round 50%)',
    rounded_rect: 'inset(3.5% round 34px)',
    sharp_rect: 'inset(3.5%)',
    drop: 'inset(3.5% round 50% 50% 34px)',
    minimum: 'inset(10% round 50%)',
};

/** @type {HTMLElement} */
const container = document.querySelector('.icon__grid');
/** @type {NodeListOf<HTMLElement>} All elements to change the mask of. */
const masked = document.querySelectorAll('.masked');

document.querySelector('.masks').addEventListener('change', evt => {
    const radio = /** @type {HTMLInputElement} */ (evt.target);
    if (radio.name === 'mask') {
        masked.forEach(mask => {
            // When the radio buttons are selected,
            // change the clip path to the new mask.
            mask.style.clipPath = defaultMasks[radio.value];
        });
    }
});
document.querySelector('.controls').addEventListener('change', evt => {
    const checkbox = /** @type {HTMLInputElement} */ (evt.target);
    switch (checkbox.name) {
        case 'shrink':
            // Shrink the icon to 1/4 size
            const size = checkbox.checked ? '0.25' : '1'
            container.style.transform = `scale(${size})`;
            break;
        case 'ghost':
            // Show ghost image behind icon
            container.classList.toggle('icon--ghost', checkbox.checked);
            break;
    }
});

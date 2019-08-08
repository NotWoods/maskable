const defaultMasks = {
    circle: {
        borderTopLeftRadius: '50%',
        borderTopRightRadius: '50%',
        borderBottomLeftRadius: '50%',
        borderBottomRightRadius: '50%',
    },
    rounded_rect: {
        borderTopLeftRadius: '34px',
        borderTopRightRadius: '34px',
        borderBottomLeftRadius: '34px',
        borderBottomRightRadius: '34px',
    },
    sharp_rect: {
        borderTopLeftRadius: '0',
        borderTopRightRadius: '0',
        borderBottomLeftRadius: '0',
        borderBottomRightRadius: '0',
    },
    drop: {
        borderTopLeftRadius: '50%',
        borderTopRightRadius: '50%',
        borderBottomLeftRadius: '50%',
        borderBottomRightRadius: '34px',
    },
};

const mask = document.querySelector('.icon__mask');
document.querySelector('.masks').addEventListener('change', evt => {
    const radio = /** @type {HTMLInputElement} */ (evt.target);
    if (radio.name === 'mask') {
        Object.assign(mask.style, defaultMasks[radio.value]);
    }
});

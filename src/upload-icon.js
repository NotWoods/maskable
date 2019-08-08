/**
 * Changes the displayed icon.
 * @param {Blob | string | undefined} source
 */
function updateDisplayedIcon(source) {
    if (!source) return;

    /** @type {HTMLImageElement} */
    const imgElement = document.querySelector('.icon');

    // Revoke the old URL
    const oldUrl = imgElement.src;
    if (oldUrl.startsWith('blob:')) {
        URL.revokeObjectURL(oldUrl);
    }

    if (typeof source !== 'string') {
        // Create a URL coresponding to the file.
        source = URL.createObjectURL(source);
    }
    updateSource(source);
    imgElement.src = source;
}

/**
 * Changes the "Icon from" credits at the bottom of the app.
 * @param {string} link
 */
function updateSource(link) {
    /** @type {HTMLElement} */
    const sourceDisplay = document.querySelector('.source');
    /** @type {HTMLAnchorElement} */
    const sourceLink = sourceDisplay.querySelector('.source__link');

    /** @type {HTMLImageElement} */
    const preview = document.querySelector(`.demo__preview[src="${link}"]`);
    if (preview != undefined) {
        sourceDisplay.hidden = false;
        sourceLink.href = preview.dataset.source;
        sourceLink.textContent = preview.alt;
    } else {
        sourceDisplay.hidden = true;
    }
}

/** @type {HTMLInputElement} */
const fileInput = document.querySelector('#icon_file');
/** @type {import('file-drop-element').FileDropElement} */
const fileDrop = document.querySelector('#icon_drop');

fileInput.addEventListener('change', () =>
    updateDisplayedIcon(fileInput.files[0]),
);
fileDrop.addEventListener('filedrop', evt => updateDisplayedIcon(evt.files[0]));

// File input focus polyfill for Firefox
fileInput.addEventListener('focus', () => fileInput.classList.add('focus'), {
    passive: true,
});
fileInput.addEventListener('blur', () => fileInput.classList.remove('focus'), {
    passive: true,
});

const demoUrl = new URL(location.href).searchParams.get('demo');
updateDisplayedIcon(demoUrl);

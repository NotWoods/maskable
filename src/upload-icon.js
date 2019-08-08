/**
 * Changes the displayed icon.
 * @param {Blob | undefined} file
 */
function updateDisplayedIcon(file) {
    if (!file) return;

    /** @type {HTMLImageElement} */
    const imgElement = document.querySelector('.icon');

    // Revoke the old URL
    const oldUrl = imgElement.src;
    if (oldUrl.startsWith('blob:')) {
        URL.revokeObjectURL(oldUrl);
    }

    // Create a URL coresponding to the file.
    imgElement.src = URL.createObjectURL(file);
}

/** @type {HTMLInputElement} */
const fileInput = document.querySelector('#icon_file');
fileInput.addEventListener(
    'change',
    () => updateDisplayedIcon(fileInput.files[0]),
    { passive: true },
);

// File input focus polyfill for Firefox
fileInput.addEventListener('focus', () => fileInput.classList.add('focus'), {
    passive: true,
});
fileInput.addEventListener('blur', () => fileInput.classList.remove('focus'), {
    passive: true,
});

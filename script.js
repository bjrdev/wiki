document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const btnA11y = document.getElementById('btn-a11y');
    const a11yMenu = document.getElementById('a11y-menu');
    const toggleThemeBtn = document.getElementById('toggle-theme');
    const fontDecreaseBtn = document.getElementById('font-decrease');
    const fontIncreaseBtn = document.getElementById('font-increase');

    const savedTheme = localStorage.getItem('wiki-theme') || 'light';
    const savedFontScale = parseFloat(localStorage.getItem('wiki-font-scale')) || 1;

    root.setAttribute('data-theme', savedTheme);
    root.style.setProperty('--font-scale', savedFontScale);

    let currentScale = savedFontScale;

    btnA11y.addEventListener('click', (e) => {
        e.stopPropagation();
        a11yMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!a11yMenu.contains(e.target) && e.target !== btnA11y) {
            a11yMenu.classList.add('hidden');
        }
    });

    toggleThemeBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('wiki-theme', newTheme);
    });

    fontDecreaseBtn.addEventListener('click', () => {
        if (currentScale > 0.8) {
            currentScale -= 0.1;
            updateFontScale();
        }
    });

    fontIncreaseBtn.addEventListener('click', () => {
        if (currentScale < 1.4) {
            currentScale += 0.1;
            updateFontScale();
        }
    });

    function updateFontScale() {
        root.style.setProperty('--font-scale', currentScale);
        localStorage.setItem('wiki-font-scale', currentScale.toString());
    }
});

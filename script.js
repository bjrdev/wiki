document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const body = document.body;

    const btnLang = document.getElementById('btn-lang');
    const menuLang = document.getElementById('menu-lang');
    const btnAppearance = document.getElementById('btn-appearance');
    const menuAppearance = document.getElementById('menu-appearance');

    function closeAllMenus() {
        menuLang.classList.add('hidden');
        menuAppearance.classList.add('hidden');
    }

    btnLang.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = menuLang.classList.contains('hidden');
        closeAllMenus();
        if (isHidden) menuLang.classList.remove('hidden');
    });

    btnAppearance.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = menuAppearance.classList.contains('hidden');
        closeAllMenus();
        if (isHidden) menuAppearance.classList.remove('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-container')) closeAllMenus();
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-target')).classList.remove('hidden');
        });
    });

    const prefs = {
        theme: localStorage.getItem('wiki-theme') || 'white',
        font: localStorage.getItem('wiki-font') || 'sans',
        size: localStorage.getItem('wiki-size') || '1',
        height: localStorage.getItem('wiki-height') || '1.6',
        fixedHeader: localStorage.getItem('wiki-fixed') !== 'false',
        hideLinks: localStorage.getItem('wiki-hidelinks') === 'true',
        tocBullets: localStorage.getItem('wiki-bullets') === 'true'
    };

    function applyPrefs() {
        body.setAttribute('data-theme', prefs.theme);
        body.setAttribute('data-font', prefs.font);

        root.style.setProperty('--article-font-size', `${prefs.size}rem`);
        root.style.setProperty('--article-line-height', prefs.height);

        body.classList.toggle('fixed-header', prefs.fixedHeader);
        body.classList.toggle('hide-article-links', prefs.hideLinks);
        body.classList.toggle('show-toc-bullets', prefs.tocBullets);

        document.querySelectorAll('.color-btn').forEach(b => b.classList.toggle('active', b.dataset.color === prefs.theme));
        document.querySelectorAll('.font-btn').forEach(b => b.classList.toggle('active', b.dataset.fontVal === prefs.font));
        document.getElementById('slider-size').value = prefs.size;
        document.getElementById('slider-height').value = prefs.height;
        document.getElementById('toggle-header').checked = prefs.fixedHeader;
        document.getElementById('toggle-links').checked = prefs.hideLinks;
        document.getElementById('toggle-bullets').checked = prefs.tocBullets;
    }
    applyPrefs();

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            prefs.theme = btn.dataset.color;
            localStorage.setItem('wiki-theme', prefs.theme);
            applyPrefs();
        });
    });

    document.querySelectorAll('.font-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            prefs.font = btn.dataset.fontVal;
            localStorage.setItem('wiki-font', prefs.font);
            applyPrefs();
        });
    });

    document.getElementById('slider-size').addEventListener('input', (e) => {
        prefs.size = e.target.value;
        localStorage.setItem('wiki-size', prefs.size);
        applyPrefs();
    });

    document.getElementById('slider-height').addEventListener('input', (e) => {
        prefs.height = e.target.value;
        localStorage.setItem('wiki-height', prefs.height);
        applyPrefs();
    });

    document.getElementById('toggle-header').addEventListener('change', (e) => {
        prefs.fixedHeader = e.target.checked;
        localStorage.setItem('wiki-fixed', prefs.fixedHeader);
        applyPrefs();
    });
    
    document.getElementById('toggle-links').addEventListener('change', (e) => {
        prefs.hideLinks = e.target.checked;
        localStorage.setItem('wiki-hidelinks', prefs.hideLinks);
        applyPrefs();
    });

    document.getElementById('toggle-bullets').addEventListener('change', (e) => {
        prefs.tocBullets = e.target.checked;
        localStorage.setItem('wiki-bullets', prefs.tocBullets);
        applyPrefs();
    });

    document.querySelectorAll('.lang-list a').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const targetLang = link.dataset.lang;
            const currentPath = window.location.pathname;
            
            const langRegex = /\/([a-z]{2})\//;
            let newPath = "";

            if (currentPath.match(langRegex)) {
                newPath = currentPath.replace(langRegex, `/${targetLang}/`);
            } else {
                newPath = `/${targetLang}/Home/`;
            }

            try {
                const response = await fetch(newPath, { method: 'HEAD' });
                if (response.ok) {
                    window.location.href = newPath;
                } else {
                    showTranslationWarning(currentPath);
                }
            } catch (err) {
                showTranslationWarning(currentPath);
            }
        });
    });

    function showTranslationWarning(fallbackUrl) {
        const warning = document.getElementById('translation-warning');
        const fallbackLink = document.getElementById('fallback-link');
        
        warning.classList.remove('hidden');
        fallbackLink.href = fallbackUrl;
        closeAllMenus();
    }
});

async function loadthemes() {
    try {
        const response = await fetch('themes-data.json');
        const themes = await response.json();

        renderthemes(themes);
        renderOverlays(themes);
        initializeEventListeners();
    } catch (error) {
        console.error('Error loading theme data:', error);
    }
}

function renderthemes(themes) {
    const container = document.getElementById('themesContainer');

    themes.forEach(theme => {
        const firstClass = theme.first ? ' zafirst' : '';
        const secClass = !theme.first ? ' zasec' : '';
        const taglineText = theme.subtitle;
        const themeHTML = `
    <div class="theme-section${firstClass}${secClass}" data-theme="${theme.id}">
        <div class="theme-banner" style="background-image: url('${theme.backgroundImage}')">
            <h2 class="theme-title">${theme.title}</h2>
            <p class="theme-tagline">${taglineText}</p>
        </div>
    </div>
`;
        container.innerHTML += themeHTML;
    });
}

function renderOverlays(themes) {
    const container = document.getElementById('overlaysContainer');

    themes.forEach(theme => {
        const projectsHTML = theme.projects.map(project => `
            <div class="project-item">
                <div class="project-content">
                    <div class="project-info">
                        <div class="project-name">${project.name}</div>
                        <div class="project-description">${project.description}</div>
                    </div>
                    <div class="board-image">
                        <img src="${project.image}" alt="${project.name}">
                    </div>
                </div>
            </div>
        `).join('');
        let overlayHTML = `
            <div class="detail-overlay" id="overlay-${theme.id}">
                <div class="detail-panel">
                    <button class="close-btn">&times;</button>
                    <h2 class="panel-title">${theme.title}</h2>
                    <p class="panel-subtitle">${theme.subtitle}</p>
                    <div class="theme-info-section">
                        <div class="theme-description-box">${theme.themeText}</div>
                    </div>
                    <div class="projects-section">
                        <h3 class="project-title">Project Ideas</h3>
                        <div class="projects-container">
                            ${projectsHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += overlayHTML;
    });
}

function initializeEventListeners() {
    const themes = document.querySelectorAll('.theme-section');
    const overlays = document.querySelectorAll('.detail-overlay');
    const closeBtns = document.querySelectorAll('.close-btn');

    themes.forEach(theme => {
        theme.addEventListener('click', () => {
            const themeId = theme.dataset.theme;
            const overlay = document.getElementById(`overlay-${themeId}`);
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeOverlay);
    });

    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeOverlay();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeOverlay();
        }
    });
}

function closeOverlay() {
    const overlays = document.querySelectorAll('.detail-overlay');
    overlays.forEach(overlay => {
        overlay.classList.remove('active');
    });
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', loadthemes);

document.addEventListener('DOMContentLoaded', () => {

    const selectorGrid = document.getElementById('module-selector-grid');

    if (!selectorGrid) return;

    const createSubsystemCard = (subsystem, idx = 0) => {
        const subsystemsListHtml = subsystem.modules.map(item => {
            const name = typeof item === 'string' ? item : item.name;
            return `
                <div class="sc-subsystem-item" title="${name}">
                    <span class="sc-subsystem-bullet"></span>
                    <span>${name}</span>
                </div>
            `;
        }).join('');

        return `
            <article class="sc-card" data-subsystem-id="${subsystem.id}">
                <div class="sc-stripe"></div>
                <div class="sc-index">${String(idx + 1).padStart(2, '0')}</div>
                <div class="sc-head">
                    <p class="sc-eyebrow">${subsystem.category}</p>
                    <h3 class="sc-title">${subsystem.title}</h3>
                    <p class="sc-desc">${subsystem.description}</p>
                </div>
                <details class="sc-details">
                    <summary class="sc-details-summary">
                        <span class="sc-summary-tag">
                            <span class="material-symbols-outlined">layers</span>
                            ${subsystem.modules.length} Subsystems
                        </span>
                        <span class="sc-summary-toggle">
                            <span>View Details</span>
                            <span class="material-symbols-outlined sc-summary-chevron">expand_more</span>
                        </span>
                    </summary>
                    <div class="sc-subsystems-list">
                        ${subsystemsListHtml}
                    </div>
                </details>
                <div class="sc-footer">
                    <a class="sc-open-btn" href="../authentication_card_component_standard/code.html?subsystem=${encodeURIComponent(subsystem.id)}">
                        <span>Open Dashboard</span>
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </a>
                </div>
            </article>
        `;
    };

    const renderSelectorGrid = () => {
        selectorGrid.innerHTML = SUBSYSTEMS.map(createSubsystemCard).join('');
    };

    renderSelectorGrid();
});

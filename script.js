fetch('updates.json').then(res => res.json()).then(data => {
    const container = document.getElementById('updatesScroll');

    container.innerHTML = data.updates.map(u => `
        <div class="update-card">
            <img src="${u.image}" alt="${u.title}" class="update-img" /
            <div>
                <h3 class="update-content">${u.title}</h3>
                <p class="update-content">${u.text}</p>
                <span class="date">${u.date}</span>
            </div>
        </div>
    `).join('');

    const scrollContainer = container;
    const btnLeft = document.getElementById("scrollLeft");
    const btnRight = document.getElementById("scrollRight");

    requestAnimationFrame(() => {
        const wrapper = document.querySelector(".updates-wrapper");
        const firstCard = scrollContainer.querySelector(".update-card");

        const wrapperWidth = wrapper.clientWidth;
        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = parseInt(getComputedStyle(scrollContainer).gap) || 0;

        const fullCardWidth = cardWidth + gap;

        let scrollX = wrapperWidth / 2 - cardWidth / 2;

        scrollContainer.style.transform = `translateX(${scrollX}px)`;


        function updateButtons() {
            const maxScroll = scrollContainer.scrollWidth - wrapperWidth;
            btnLeft.classList.toggle("disabled", scrollX >= wrapperWidth / 2 - cardWidth / 2);
            btnRight.classList.toggle("disabled", scrollX <= -maxScroll);
        }


        btnRight.onclick = () => {
            const maxScroll = scrollContainer.scrollWidth - wrapperWidth;
            if (scrollX > -maxScroll) {
                scrollX -= fullCardWidth;
                scrollContainer.style.transform = `translateX(${scrollX}px)`;
            }
            updateButtons();
        };

        btnLeft.onclick = () => {
            const leftLimit = wrapperWidth / 2 - cardWidth / 2;
            if (scrollX < leftLimit) {
                scrollX += fullCardWidth;
                scrollContainer.style.transform = `translateX(${scrollX}px)`;
            }
            updateButtons();
        };

        updateButtons();
    });
});

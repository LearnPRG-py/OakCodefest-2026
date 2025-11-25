fetch('updates.json')
.then(res => res.json())
.then(data => {
    const container = document.getElementById('updatesScroll');

    container.innerHTML = data.updates.map(u => `
        <div class="update-card">
        <h3>${u.title}</h3>
        <p>${u.text}</p>
        <span class="date">${u.date}</span>
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

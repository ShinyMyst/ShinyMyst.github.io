// These event listeners bind the buttons to their respective functions.
game.nextButton.addEventListener('click', () => navigate('next'));
game.prevButton.addEventListener('click', () => navigate('prev'));
game.wrongBtn.addEventListener('click', () => triggerWrong());
game.musicToggleButton.addEventListener('click', () => toggleMusic());

// This function handles the 'wrong' pop-up animation and sound.
function triggerWrong() {
    if (game.wrongCount >= 3) return;

    game.wrongCount++;
    game.wrongSound.currentTime = 0;
    game.wrongSound.play();

    game.wrongXContainer.innerHTML = '';

    for (let i = 0; i < game.wrongCount; i++) {
        const img = document.createElement('img');
        img.src = 'assets/images/wrong.webp';
        img.className = 'wrong-x';
        img.style.opacity = 0;
        game.wrongXContainer.appendChild(img);

        requestAnimationFrame(() => {
            img.style.opacity = 1;
        });
    }

    const timeout = game.wrongSound.duration * 1000 + 250;
    setTimeout(() => {
        const imgs = game.wrongXContainer.querySelectorAll('img');
        imgs.forEach(img => {
            img.style.opacity = 0;
        });

        setTimeout(() => {
            game.wrongXContainer.innerHTML = '';
        }, 300);
    }, timeout);
}

// This function reveals an answer box and plays the correct sound.
function reveal(el) {
    el.classList.add('revealed');
    game.correctSound.currentTime = 0;
    game.correctSound.play();
}
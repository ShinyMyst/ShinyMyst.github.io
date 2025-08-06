// This function handles the audio toggle.
function toggleMusic() {
    if (game.introMusic.paused) {
        game.introMusic.play();
        game.musicToggleButton.textContent = 'Stop Music';
    } else {
        game.introMusic.pause();
        game.musicToggleButton.textContent = 'Play Music';
    }
}
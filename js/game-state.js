// This file acts as the central "store" for the game's state and elements.
// All other scripts can access these properties and functions.
const game = {
    // Game state variables
    screenIndex: 0,
    questionIndex: -1,
    wrongCount: 0,

    // Game data
    questions: gameQuestions,

    // DOM Elements
    titleScreen: document.getElementById('title-screen'),
    gameScreen: document.getElementById('game-screen'),
    nextButton: document.getElementById('next-btn'),
    prevButton: document.getElementById('prev-btn'),
    musicToggleButton: document.getElementById('music-toggle-btn'),
    wrongBtn: document.getElementById('wrong-btn'),
    wrongXContainer: document.getElementById('wrong-x-container'),

    // Audio Elements
    introMusic: document.getElementById('intro-music'),
    correctSound: new Audio('assets/audio/correct.mp3'),
    wrongSound: new Audio('assets/audio/wrong.mp3'),
};